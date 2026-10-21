/* =========================================================
   Demo · Panel de gestión de citas — Clínica MedicalCenter
   Agenda por médico (día y semana), lista con filtros, sala de espera,
   médicos, ficha de la cita, nueva cita, reprogramación y cancelación.
   Usa los datos y utilidades de datos.js.
   ========================================================= */

/* ---------- estado de la interfaz ---------- */
const ROLES = [['recepcion', 'Recepción · Ana Suárez'], ...MEDICOS.map((m) => ['med:' + m.id, m.n])];
const ui = { view: 'agenda', scale: 'dia', date: TODAY, esp: '', med: '', role: 'recepcion', autoMed: false };
const roleMed = () => (ui.role.startsWith('med:') ? ui.role.slice(4) : null);
const isRecep = () => !roleMed();
const visibles = () => (roleMed() ? db.citas.filter((c) => c.med === roleMed()) : db.citas);
const medsFiltrados = () => MEDICOS.filter((m) => (roleMed() ? m.id === roleMed() : (!ui.esp || m.esp === ui.esp) && (!ui.med || m.id === ui.med)));
// en la vista semanal se muestra un médico a la vez para que la agenda sea legible
const semanaMed = () => { if (ui.scale === 'semana' && !roleMed() && !ui.med) { ui.med = MEDICOS.find((m) => !ui.esp || m.esp === ui.esp).id; ui.autoMed = true; } };

const opts = (list, sel) => list.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');
const pill = (estado) => `<span class="st st--${estado}">${ESTADOS[estado][0]}</span>`;

/* ---------- aviso ---------- */
let toastT;
function toast(msg) {
    const t = $('#toast');
    t.innerHTML = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), 3800);
}

/* ---------- indicadores ---------- */
function renderKpis() {
    const hoy = visibles().filter((c) => c.fecha === TODAY);
    const act = hoy.filter((c) => c.estado !== 'cancelada');
    const meds = roleMed() ? [MED[roleMed()]] : MEDICOS;
    const cupos = meds.reduce((a, m) => { const h = m.hor[dow(TODAY)]; return a + (h ? Math.floor((toMin(h[1]) - toMin(h[0])) / m.dur) : 0); }, 0);
    const cobrado = act.filter((c) => c.pago).reduce((a, c) => a + svcOf(c)[1], 0);
    const n = (e) => act.filter((c) => c.estado === e).length;
    const k = [
        ['Citas de hoy', act.length, `${cupos ? Math.round((act.length / cupos) * 100) : 0} % de ocupación`],
        ['Por llegar', n('confirmada') + n('reservada'), `${n('reservada')} con pago pendiente`],
        ['En sala de espera', n('espera'), n('consulta') + ' en consulta ahora'],
        ['Atendidas', n('atendida'), n('ausente') + ' no asistieron'],
        ['Cobrado hoy', bs(cobrado), 'QR y caja'],
    ];
    $('#kpis').innerHTML = k.map(([t, v, s]) => `<div class="kpi"><small>${t}</small><b>${v}</b><span>${s}</span></div>`).join('');
    const espera = visibles().filter((c) => c.fecha === TODAY && c.estado === 'espera').length;
    $('#nav-sala').textContent = espera || '';
}

/* ---------- agenda ---------- */
const PX = 2.2; // píxeles por minuto

function syncFiltros() {
    const rm = roleMed();
    $('#f-esp').innerHTML = opts([['', 'Todas las especialidades'], ...ESPECIALIDADES.map((e) => [e, e])], rm ? MED[rm].esp : ui.esp);
    const meds = MEDICOS.filter((m) => !ui.esp || m.esp === ui.esp);
    $('#f-med').innerHTML = opts([...(ui.scale === 'dia' ? [['', 'Todos los médicos']] : []), ...meds.map((m) => [m.id, m.n])], rm || ui.med);
    $('#f-esp').disabled = $('#f-med').disabled = !!rm;
}


function card(c, compact, pos) {
    const p = pacIdx[c.pac];
    const m = MED[c.med];
    const short = compact ? p.n.split(' ')[0] : p.n;
    const row = m.dur * PX < 56 ? ' appt--row' : '';
    return `<button class="appt appt--${c.estado}${row}" data-cita="${c.id}" style="${pos};height:${m.dur * PX - 3}px;--mc:${m.c}" title="${esc(`${hm(c.hora)} · ${p.n} · ${svcOf(c)[0]} · ${ESTADOS[c.estado][0]}`)}">
        <span class="appt__t">${hm(c.hora)}${c.pago ? '' : ' · <i>QR</i>'}</span><b>${esc(short)}</b>${compact || row ? '' : `<small>${esc(svcOf(c)[0])}</small>`}</button>`;
}

function renderAgenda() {
    semanaMed();
    syncFiltros();
    const meds = medsFiltrados();
    const dias = ui.scale === 'dia' ? [ui.date] : Array.from({ length: 6 }, (_, i) => addDays(monday(ui.date), i));
    $('#range-label').textContent = ui.scale === 'dia' ? fmtLong(ui.date) + (ui.date === TODAY ? ' · hoy' : '') : `Semana del ${fmtDay(dias[0])} al ${fmtDay(dias[5])}`;

    // columnas: en día, una por médico que atiende; en semana, una por día con carriles por médico
    const cols = ui.scale === 'dia'
        ? meds.filter((m) => m.hor[dow(ui.date)]).map((m) => ({ k: ui.date, lanes: [m], head: `<span class="av" style="--mc:${m.c}">${ini(m.n)}</span><div><b>${esc(m.n)}</b><small>${esc(m.esp)} · Cons. ${m.cons}</small></div>` }))
        : dias.map((k) => ({ k, lanes: meds.filter((m) => m.hor[dow(k)]), head: `<div><b>${fmtDay(k)}</b><small>${k === TODAY ? 'Hoy' : ''}</small></div>`, day: true }));

    const grid = $('#grid');
    if (!cols.length || cols.every((c) => !c.lanes.length)) {
        grid.style.removeProperty('--cols');
        grid.innerHTML = `<p class="empty">${meds.length === 1 ? `${esc(meds[0].n)} no atiende ${ui.scale === 'dia' ? 'este día' : 'esta semana'}.` : 'Ningún médico atiende en este rango.'} Use las flechas para cambiar de fecha.</p>`;
        return;
    }
    let a = 24 * 60, b = 0;
    cols.forEach((col) => col.lanes.forEach((m) => { const h = m.hor[dow(col.k)]; a = Math.min(a, toMin(h[0])); b = Math.max(b, toMin(h[1])); }));
    a = Math.floor(a / 60) * 60; b = Math.ceil(b / 60) * 60;
    const H = (b - a) * PX;
    const y = (t) => (t - a) * PX;

    let horas = '', lineas = '';
    for (let t = a; t <= b; t += 60) { horas += `<span style="top:${y(t)}px">${hm(t)}</span>`; lineas += `<span class="hl" style="top:${y(t)}px"></span>`; }

    const body = cols.map((col, ci) => {
        const n = col.lanes.length || 1;
        let inner = '';
        col.lanes.forEach((m, li) => {
            const h = m.hor[dow(col.k)];
            const lane = `left:calc(${(li / n) * 100}% + 3px);width:calc(${100 / n}% - 6px)`;
            inner += `<div class="work" style="top:${y(toMin(h[0]))}px;height:${(toMin(h[1]) - toMin(h[0])) * PX}px;${lane}"></div>`;
            const citas = db.citas.filter((c) => c.med === m.id && c.fecha === col.k && c.estado !== 'cancelada');
            const tomados = new Set(citas.map((c) => c.hora));
            if (n === 1) {
                slotsDe(m, col.k).forEach((t) => {
                    if (!tomados.has(t) && libre(col.k, t)) inner += `<button class="ghost" data-new="${m.id}|${col.k}|${t}" style="top:${y(t)}px;height:${m.dur * PX - 3}px;${lane}">+ ${hm(t)} libre</button>`;
                });
            }
            citas.forEach((c) => { inner += card(c, n > 2, `top:${y(c.hora)}px;${lane}`); });
        });
        const now = col.k === TODAY && nowMin() >= a && nowMin() <= b ? `<div class="now" style="top:${y(nowMin())}px">${ci === 0 || col.day ? `<i>${hm(nowMin())}</i>` : ''}</div>` : '';
        return `<div class="col${col.k === TODAY && col.day ? ' col--today' : ''}" style="height:${H}px">${lineas}${inner}${now}</div>`;
    }).join('');

    grid.style.setProperty('--cols', cols.length);
    grid.innerHTML = `<div class="g-head"><div class="g-corner"></div>${cols.map((c) => `<div class="g-colhead"${c.day ? ` data-day="${c.k}" role="button" tabindex="0" title="Ver el día"` : ''}>${c.head}</div>`).join('')}</div>
        <div class="g-body"><div class="g-times" style="height:${H}px">${horas}</div>${body}</div>`;

    $('#legend').innerHTML = Object.entries(ESTADOS).filter(([e]) => e !== 'cancelada').map(([e, [t]]) => `<span><i class="sw sw--${e}"></i>${t}</span>`).join('')
        + `<span class="legend__hint">${ui.scale === 'semana' ? 'Toque un día para verlo en detalle o un cupo libre para agendar.' : 'Toque un cupo libre para agendar.'}</span>`;
}

/* ---------- lista ---------- */
function renderLista() {
    const rm = roleMed();
    if (!$('#l-estado').options.length) {
        $('#l-estado').innerHTML = opts([['', 'Todos los estados'], ...Object.entries(ESTADOS).map(([e, [t]]) => [e, t])], '');
        $('#l-canal').innerHTML = opts([['', 'Todos los canales'], ...Object.entries(CANALES)], '');
    }
    const espSel = $('#l-esp').value;
    $('#l-esp').innerHTML = opts([['', 'Todas las especialidades'], ...ESPECIALIDADES.map((e) => [e, e])], espSel);
    $('#l-esp').disabled = !!rm;
    const q = $('#q').value.trim().toLowerCase();
    const rango = $('#l-rango').value;
    const est = $('#l-estado').value, esp = $('#l-esp').value, canal = $('#l-canal').value;
    const lun = monday(TODAY);
    const enRango = (k) => ({
        hoy: k === TODAY,
        manana: k === addDays(TODAY, 1),
        semana: k >= lun && k <= addDays(lun, 6),
        proximas: k >= TODAY,
        todas: true,
    }[rango]);
    const list = visibles().filter((c) => {
        const p = pacIdx[c.pac];
        return enRango(c.fecha) && (!est || c.estado === est) && (!esp || MED[c.med].esp === esp) && (!canal || c.canal === canal)
            && (!q || `${p.n} ${p.tel} ${p.ci} ${c.id}`.toLowerCase().includes(q));
    }).sort((x, y) => x.fecha.localeCompare(y.fecha) || x.hora - y.hora || x.med.localeCompare(y.med));
    const max = 250;
    $('#rows').innerHTML = list.slice(0, max).map((c) => {
        const p = pacIdx[c.pac], m = MED[c.med];
        return `<tr data-cita="${c.id}" tabindex="0">
            <td class="mono">${c.id}</td>
            <td><b>${fmtDay(c.fecha)}</b> ${hm(c.hora)}</td>
            <td><b>${esc(p.n)}</b><small>${p.tel}</small></td>
            <td><span class="dotm" style="--mc:${m.c}"></span>${esc(m.n)}<small>${esc(m.esp)}</small></td>
            <td>${esc(svcOf(c)[0])}<small>${bs(svcOf(c)[1])}</small></td>
            <td>${CANALES[c.canal]}</td>
            <td>${c.pago ? '<span class="pay pay--ok">Pagado</span>' : '<span class="pay">Pendiente</span>'}</td>
            <td>${pill(c.estado)}</td></tr>`;
    }).join('');
    $('#rows-empty').hidden = list.length > 0;
    $('#rows-count').textContent = list.length ? `${list.length} cita${list.length === 1 ? '' : 's'}${list.length > max ? ` · se muestran las primeras ${max}` : ''}` : '';
}

/* ---------- sala de espera ---------- */
function renderSala() {
    const hoy = visibles().filter((c) => c.fecha === TODAY).sort((x, y) => x.hora - y.hora);
    const colsDef = [
        ['Por llegar', hoy.filter((c) => ['confirmada', 'reservada'].includes(c.estado))],
        ['En espera', hoy.filter((c) => c.estado === 'espera').sort((x, y) => (x.lleg || 0) - (y.lleg || 0))],
        ['En consulta', hoy.filter((c) => c.estado === 'consulta')],
        ['Atendidas hoy', hoy.filter((c) => ['atendida', 'ausente'].includes(c.estado)).reverse()],
    ];
    const acc = (c) => {
        const late = c.hora + 15 < nowMin();
        if (c.estado === 'reservada') return isRecep() ? `<button class="mini mini--solid" data-act="cobrar-llegada" data-id="${c.id}">Cobrar y registrar llegada</button>${late ? `<button class="mini" data-act="ausente" data-id="${c.id}">No asistió</button>` : ''}` : '';
        if (c.estado === 'confirmada') return isRecep() ? `<button class="mini mini--solid" data-act="llegada" data-id="${c.id}">Registrar llegada</button>${late ? `<button class="mini" data-act="ausente" data-id="${c.id}">No asistió</button>` : ''}` : '';
        if (c.estado === 'espera') return `<button class="mini mini--solid" data-act="iniciar" data-id="${c.id}">Llamar e iniciar consulta</button>`;
        if (c.estado === 'consulta') return `<button class="mini mini--solid" data-act="finalizar" data-id="${c.id}">Finalizar consulta</button>`;
        return '';
    };
    const extra = (c) => {
        if (c.estado === 'espera' && c.lleg != null) { const w = Math.max(nowMin() - c.lleg, 0); return `<span class="wait${w > 20 ? ' wait--late' : ''}">Esperando ${w} min</span>`; }
        if (['confirmada', 'reservada'].includes(c.estado) && c.hora + 15 < nowMin()) return '<span class="wait wait--late">Retrasado</span>';
        return '';
    };
    $('#board').innerHTML = colsDef.map(([t, list]) => `<div class="lane"><header><b>${t}</b><span>${list.length}</span></header>
        <div class="lane__list">${list.map((c) => {
            const p = pacIdx[c.pac], m = MED[c.med];
            return `<article class="tk" style="--mc:${m.c}"><button class="tk__main" data-cita="${c.id}">
                <span class="tk__t">${hm(c.hora)} ${pill(c.estado)}</span><b>${esc(p.n)}</b>
                <small>${esc(m.n)} · Cons. ${m.cons}</small><small>${esc(svcOf(c)[0])}</small>${extra(c)}</button>
                <div class="tk__acts">${acc(c)}</div></article>`;
        }).join('') || '<p class="lane__empty">Sin pacientes</p>'}</div></div>`).join('');
}

/* ---------- médicos ---------- */
function renderMedicos() {
    const meds = roleMed() ? [MED[roleMed()]] : MEDICOS;
    $('#docs').innerHTML = meds.map((m) => {
        const hoy = db.citas.filter((c) => c.med === m.id && c.fecha === TODAY && c.estado !== 'cancelada');
        const cupos = slotsDe(m, TODAY).length;
        const prox = hoy.filter((c) => c.hora >= nowMin() && ['confirmada', 'reservada', 'espera'].includes(c.estado)).sort((x, y) => x.hora - y.hora)[0];
        const sem = [1, 2, 3, 4, 5, 6].map((d) => `<li class="${m.hor[d] ? 'on' : ''}${d === dow(TODAY) ? ' today' : ''}"><b>${DIAS[d]}</b><span>${m.hor[d] ? m.hor[d].join('–') : '—'}</span></li>`).join('');
        const libres = slotsDe(m, TODAY).filter((t) => !ocupado(m.id, TODAY, t) && libre(TODAY, t)).length;
        return `<article class="doc" style="--mc:${m.c}">
            <header><span class="av av--lg" style="--mc:${m.c}">${ini(m.n)}</span><div><h3>${esc(m.n)}</h3><small>${esc(m.esp)} · Consultorio ${m.cons} · fichas de ${m.dur} min</small></div></header>
            <ul class="week">${sem}</ul>
            ${cupos ? `<div class="occ"><div class="occ__bar"><span style="width:${Math.round((hoy.length / cupos) * 100)}%"></span></div><small>Hoy: ${hoy.length} de ${cupos} fichas ocupadas · ${libres} libres desde ahora</small></div>` : '<p class="muted small">Hoy no atiende.</p>'}
            ${prox ? `<p class="small">Próximo: <b>${hm(prox.hora)} · ${esc(pacIdx[prox.pac].n)}</b> ${pill(prox.estado)}</p>` : ''}
            <div class="doc__acts"><button class="mini mini--solid" data-agenda="${m.id}">Ver agenda</button>${isRecep() && libres ? `<button class="mini" data-newmed="${m.id}">Agendar</button>` : ''}</div>
        </article>`;
    }).join('');
}

/* ---------- navegación ---------- */
const TITULOS = {
    agenda: ['Agenda', 'Citas por médico y horario, sincronizadas con Medicaltec.'],
    lista: ['Citas', 'Búsqueda y filtros por fecha, estado, especialidad y canal.'],
    sala: ['Sala de espera', 'Llegadas, consultas en curso y atendidas del día.'],
    medicos: ['Médicos', 'Horarios de atención y ocupación de hoy.'],
};
function render() {
    renderKpis();
    $$('.nav').forEach((b) => b.classList.toggle('is-on', b.dataset.view === ui.view));
    $$('.view').forEach((v) => { v.hidden = v.id !== 'v-' + ui.view; });
    const [t, s] = TITULOS[ui.view];
    $('#title').textContent = t;
    $('#subtitle').textContent = `${s} ${fmtLong(TODAY)}, ${hm(nowMin())}${SIMULADO ? ' (hora simulada)' : ''}.`;
    $$('[data-scale]').forEach((b) => b.classList.toggle('on', b.dataset.scale === ui.scale));
    ({ agenda: renderAgenda, lista: renderLista, sala: renderSala, medicos: renderMedicos })[ui.view]();
    if (drawerId) openDrawer(drawerId);
}

/* ---------- acciones sobre una cita ---------- */
const find = (id) => db.citas.find((c) => c.id === id);
function act(id, a) {
    const c = find(id);
    if (!c) return;
    const p = pacIdx[c.pac], m = MED[c.med];
    const log = (x) => c.hist.push([stamp(), x]);
    switch (a) {
        case 'pago':
            c.pago = true; if (c.estado === 'reservada') c.estado = 'confirmada';
            log('Pago registrado en caja'); toast(`Pago de <b>${bs(svcOf(c)[1])}</b> registrado. Factura enviada a ${esc(p.n)}.`); break;
        case 'cobrar-llegada':
            c.pago = true; log('Pago registrado en caja');
        // falls through
        case 'llegada':
            c.estado = 'espera'; c.lleg = nowMin(); log('Llegada registrada en recepción');
            toast(`<b>${esc(p.n)}</b> está en sala de espera. Se avisó a ${esc(m.n)}.`); break;
        case 'iniciar': {
            const otra = db.citas.find((x) => x.med === c.med && x.fecha === c.fecha && x.estado === 'consulta');
            if (otra) { otra.estado = 'atendida'; otra.hist.push([stamp(), 'Consulta finalizada']); }
            c.estado = 'consulta'; log('Consulta iniciada');
            toast(`Llamando a <b>${esc(p.n)}</b> al consultorio ${m.cons}.${otra ? ` Se finalizó la consulta de ${esc(pacIdx[otra.pac].n)}.` : ''}`); break;
        }
        case 'finalizar':
            c.estado = 'atendida'; log('Consulta finalizada'); toast(`Consulta de <b>${esc(p.n)}</b> finalizada. Se enviará la encuesta de satisfacción.`); break;
        case 'ausente':
            c.estado = 'ausente'; log('Marcada como no asistió'); toast(`Se marcó la inasistencia. El bot ofrecerá a ${esc(p.n)} reprogramar por WhatsApp.`); break;
        case 'recordatorio':
            log('Recordatorio enviado por WhatsApp'); toast(`Recordatorio enviado por WhatsApp al ${p.tel}${c.pago ? '' : ', con el QR de pago'}.`); break;
        case 'reprogramar': openModal('reprog', { cita: c }); return;
        case 'cancelar': openCancel(c); return;
        case 'control': openModal('new', { pac: c.pac, med: c.med }); return;
    }
    save(); render();
}

/* ---------- ficha ---------- */
let drawerId = null;
function openDrawer(id) {
    const c = find(id);
    if (!c) return closeDrawer();
    drawerId = id;
    const p = pacIdx[c.pac], m = MED[c.med], [svc, precio] = svcOf(c);
    const previas = db.citas.filter((x) => x.pac === c.pac && x.id !== c.id && x.estado === 'atendida').length;
    $('#d-code').textContent = `${c.id} · ${CANALES[c.canal]}`;
    $('#d-title').textContent = p.n;
    $('#d-body').innerHTML = `
        <div class="d-state">${pill(c.estado)}<span class="muted small">${ESTADOS[c.estado][1]}</span></div>
        <dl class="dl">
            <div><dt>Fecha</dt><dd>${fmtLong(c.fecha)}</dd></div>
            <div><dt>Hora</dt><dd>${hm(c.hora)} – ${hm(fin(c))}</dd></div>
            <div><dt>Médico</dt><dd><span class="dotm" style="--mc:${m.c}"></span>${esc(m.n)}</dd></div>
            <div><dt>Especialidad</dt><dd>${esc(m.esp)} · Cons. ${m.cons}</dd></div>
            <div><dt>Servicio</dt><dd>${esc(svc)}</dd></div>
            <div><dt>Importe</dt><dd>${bs(precio)} ${c.pago ? '<span class="pay pay--ok">Pagado</span>' : '<span class="pay">Pendiente</span>'}</dd></div>
            <div><dt>Teléfono</dt><dd>${p.tel}</dd></div>
            <div><dt>Código de paciente</dt><dd class="mono">${p.cod || '—'}</dd></div>
        </dl>
        <p class="muted small">${previas ? `${previas} consulta${previas === 1 ? '' : 's'} atendida${previas === 1 ? '' : 's'} en la clínica.` : 'Primera consulta en la clínica.'}</p>
        <h4>Historial</h4>
        <ol class="tl">${c.hist.map(([t, x]) => `<li><small>${esc(t)}</small>${esc(x)}</li>`).join('')}</ol>`;
    const b = (a, t, cls = '') => `<button class="btn btn--sm ${cls}" data-act="${a}" data-id="${c.id}">${t}</button>`;
    const hoy = c.fecha === TODAY, rec = isRecep();
    const passed = hoy && c.hora + 15 < nowMin();
    const acts = {
        reservada: [rec && b('pago', 'Registrar pago', 'btn--primary'), rec && hoy && b('cobrar-llegada', 'Cobrar y registrar llegada'), rec && b('recordatorio', 'Reenviar QR por WhatsApp'), b('reprogramar', 'Reprogramar'), rec && passed && b('ausente', 'No asistió'), rec && b('cancelar', 'Cancelar', 'btn--danger-ghost')],
        confirmada: [rec && hoy && b('llegada', 'Registrar llegada', 'btn--primary'), rec && b('recordatorio', 'Enviar recordatorio'), b('reprogramar', 'Reprogramar'), rec && passed && b('ausente', 'No asistió'), rec && b('cancelar', 'Cancelar', 'btn--danger-ghost')],
        espera: [b('iniciar', 'Llamar e iniciar consulta', 'btn--primary')],
        consulta: [b('finalizar', 'Finalizar consulta', 'btn--primary')],
        atendida: [b('control', 'Agendar control', 'btn--primary')],
        ausente: [b('reprogramar', 'Reprogramar', 'btn--primary')],
        cancelada: [b('control', 'Agendar de nuevo', 'btn--primary')],
    }[c.estado].filter(Boolean);
    $('#d-acts').innerHTML = acts.join('');
    $('#drawer').classList.add('on');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#scrim').hidden = false;
}
function closeDrawer() {
    drawerId = null;
    $('#drawer').classList.remove('on');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#scrim').hidden = true;
}

/* ---------- nueva cita / reprogramar ---------- */
const md = { mode: 'new', cita: null, pac: null, med: null, fecha: null, hora: null };
const telOk = (t) => /^[67]\d{7}$/.test(t);

function openModal(mode, pre = {}) {
    closeDrawer();
    Object.assign(md, { mode, cita: pre.cita || null, pac: pre.pac || null, med: null, fecha: null, hora: null });
    const c = md.cita;
    const medId = c ? c.med : pre.med || roleMed() || ui.med || MEDICOS.find((m) => !ui.esp || m.esp === ui.esp).id;
    md.med = medId;
    md.fecha = pre.fecha || null;
    md.hora = pre.hora != null ? pre.hora : null;
    $('#m-title').textContent = c ? `Reprogramar ${c.id}` : 'Nueva cita';
    $('#m-ok').textContent = c ? 'Reprogramar' : 'Agendar';
    $('#m-pac').hidden = !!c;
    $('#m-extra').hidden = !!c;
    $('#m-motivo-wrap').hidden = !c;
    $('#m-motivo').value = '';
    $('#m-err').textContent = '';
    const pac = c ? pacIdx[c.pac] : md.pac ? pacIdx[md.pac] : null;
    $('#m-tel').value = pac ? pac.tel : '';
    $('#m-nom').value = ''; $('#m-ci').value = '';
    $('#m-canal').innerHTML = opts(Object.entries(CANALES), 'recepcion');
    $('#m-pagado').checked = false;
    $('#m-esp').innerHTML = opts(ESPECIALIDADES.map((e) => [e, e]), MED[medId].esp);
    $('#m-esp').disabled = $('#m-med').disabled = !!c || !!roleMed();
    lookupTel();
    fillMeds();
    $('#modal').showModal();
    if (!c && !pac) $('#m-tel').focus();
}

function lookupTel() {
    const t = $('#m-tel').value.replace(/\D/g, '');
    const p = db.pacs.find((x) => x.tel === t);
    md.pac = p ? p.id : null;
    const found = $('#m-found');
    if (p) {
        const n = db.citas.filter((x) => x.pac === p.id && x.estado === 'atendida').length;
        const prox = db.citas.filter((x) => x.pac === p.id && x.fecha >= TODAY && ['confirmada', 'reservada'].includes(x.estado)).length;
        found.innerHTML = `<span class="ok">✓</span><div><b>${esc(p.n)}</b><small>Paciente ${p.cod} · CI ${p.ci || '—'} · ${n} consulta${n === 1 ? '' : 's'} atendida${n === 1 ? '' : 's'}${prox ? ` · ${prox} cita${prox === 1 ? '' : 's'} próxima${prox === 1 ? '' : 's'}` : ''}</small></div>`;
        found.hidden = false;
        $('#m-newpac').hidden = true;
    } else {
        found.hidden = !telOk(t);
        found.innerHTML = telOk(t) ? '<span class="new">+</span><div><b>Número nuevo</b><small>Complete el nombre para registrarlo en Medicaltec.</small></div>' : '';
        $('#m-newpac').hidden = !telOk(t);
    }
}

function fillMeds() {
    const esp = $('#m-esp').value;
    const meds = MEDICOS.filter((m) => m.esp === esp);
    if (!meds.some((m) => m.id === md.med)) md.med = meds[0].id;
    $('#m-med').innerHTML = opts(meds.map((m) => [m.id, m.n]), md.med);
    $('#m-svc').innerHTML = opts(SERVICIOS[esp].map(([n, p], i) => [String(i), `${n} · ${bs(p)}`]), md.cita ? String(md.cita.svc) : '0');
    fillDays();
}

function fillDays() {
    const m = MED[md.med];
    const dias = [];
    for (let i = 0; dias.length < 10 && i < 30; i++) {
        const k = addDays(TODAY, i);
        if (!m.hor[dow(k)]) continue;
        const libres = slotsDe(m, k).filter((t) => libre(k, t) && !ocupado(m.id, k, t, md.cita && md.cita.id)).length;
        dias.push([k, libres]);
    }
    if (!md.fecha || !dias.some(([k, l]) => k === md.fecha && l)) { md.fecha = (dias.find(([, l]) => l) || [null])[0]; md.hora = null; }
    $('#m-days').innerHTML = dias.map(([k, l]) => `<button type="button" class="day${k === md.fecha ? ' on' : ''}" data-k="${k}" ${l ? '' : 'disabled'}><b>${fmtDay(k)}</b><small>${l ? `${l} libre${l === 1 ? '' : 's'}` : 'Lleno'}</small></button>`).join('');
    fillSlots();
}

function fillSlots() {
    const m = MED[md.med];
    const k = md.fecha;
    const sl = k ? slotsDe(m, k).filter((t) => libre(k, t)) : [];
    const free = sl.filter((t) => !ocupado(m.id, k, t, md.cita && md.cita.id));
    if (!free.includes(md.hora)) md.hora = null;
    $('#m-slots').innerHTML = sl.length ? sl.map((t) => {
        const busy = !free.includes(t);
        return `<button type="button" class="slot${t === md.hora ? ' on' : ''}" data-t="${t}" ${busy ? 'disabled' : ''}>${hm(t)}</button>`;
    }).join('') : '<p class="muted small">Sin horarios libres.</p>';
    summary();
}

function summary() {
    const m = MED[md.med];
    const svc = md.cita ? svcOf(md.cita) : SERVICIOS[m.esp][+$('#m-svc').value || 0];
    $('#m-sum').textContent = md.fecha && md.hora != null ? `${fmtDay(md.fecha)} · ${hm(md.hora)} · ${svc[0]} · ${bs(svc[1])}` : 'Elija un horario libre';
}

function submitModal() {
    const err = (t) => { $('#m-err').textContent = t; return false; };
    const tel = $('#m-tel').value.replace(/\D/g, '');
    if (!md.cita && !telOk(tel)) return err('Ingrese un teléfono de 8 dígitos que empiece con 6 o 7.');
    if (!md.fecha || md.hora == null) return err('Elija una fecha y un horario libre.');
    const m = MED[md.med];
    if (md.cita) {
        const c = md.cita;
        const antes = `${fmtDay(c.fecha)} ${hm(c.hora)}`;
        c.fecha = md.fecha; c.hora = md.hora;
        if (['ausente', 'cancelada'].includes(c.estado)) c.estado = c.pago ? 'confirmada' : 'reservada';
        const motivo = $('#m-motivo').value.trim();
        c.hist.push([stamp(), `Reprogramada de ${antes} a ${fmtDay(c.fecha)} ${hm(c.hora)}${motivo ? ' · ' + motivo : ''}`]);
        toast(`Cita reprogramada para el <b>${fmtDay(c.fecha)} a las ${hm(c.hora)}</b>. Se avisó a ${esc(pacIdx[c.pac].n)} por WhatsApp.`);
        finish(c);
        return true;
    }
    let pid = md.pac;
    if (!pid) {
        const nom = $('#m-nom').value.trim().replace(/\s+/g, ' ');
        if (nom.split(' ').length < 2) return err('Ingrese el nombre y apellido del paciente nuevo.');
        pid = 'p' + db.pacs.length;
        db.pacs.push({ id: pid, cod: nuevoCodigo(), n: nom, tel, ci: $('#m-ci').value.replace(/\D/g, '') });
        pacIdx = PAC();
    }
    const pago = $('#m-pagado').checked;
    const canal = $('#m-canal').value;
    const c = { id: 'C-' + (++db.seq), pac: pid, med: m.id, fecha: md.fecha, hora: md.hora, svc: +$('#m-svc').value, estado: pago ? 'confirmada' : 'reservada', pago, canal, hist: [[stamp(), `Agendada por ${CANALES[canal]}${isRecep() ? ' · Ana Suárez' : ' · ' + m.n}`]] };
    c.hist.push([stamp(), pago ? 'Pago registrado' : 'QR de pago enviado por WhatsApp']);
    db.citas.push(c);
    toast(`Cita <b>${c.id}</b> agendada para el ${fmtDay(c.fecha)} a las ${hm(c.hora)}. ${pago ? 'Confirmación' : 'Confirmación y QR de pago'} enviados por WhatsApp.`);
    finish(c);
    return true;
}

function finish(c) {
    save();
    if (ui.view === 'agenda') { ui.date = c.fecha; if (ui.scale === 'dia' && ui.med && ui.med !== c.med) ui.med = ''; if (ui.esp && ui.esp !== MED[c.med].esp) ui.esp = ''; }
    render();
    const el = $(`.appt[data-cita="${c.id}"]`);
    if (el) { el.classList.add('flash'); el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }); }
}

/* ---------- cancelar ---------- */
let cancelId = null;
function openCancel(c) {
    closeDrawer();
    cancelId = c.id;
    $('#c-text').innerHTML = `${esc(pacIdx[c.pac].n)} · ${fmtLong(c.fecha)} a las ${hm(c.hora)} con ${esc(MED[c.med].n)}. El horario quedará libre para otro paciente.`;
    $('#cancel').showModal();
}
$('#cancel').addEventListener('close', () => {
    if ($('#cancel').returnValue !== 'ok') return;
    const c = find(cancelId);
    const motivo = $('#c-motivo').value;
    c.estado = 'cancelada'; c.motivo = motivo;
    c.hist.push([stamp(), 'Cancelada · ' + motivo]);
    toast(`Cita ${c.id} cancelada.${$('#c-wa').checked ? ' Se avisó al paciente por WhatsApp.' : ''}${c.pago ? ' El pago queda como saldo a favor.' : ''}`);
    save(); render();
});

/* ---------- eventos ---------- */
$('#role').innerHTML = opts(ROLES, ui.role);
$('#role').addEventListener('change', (e) => {
    ui.role = e.target.value; ui.esp = ''; ui.med = '';
    $('#btn-new').hidden = false;
    closeDrawer();
    toast(isRecep() ? 'Vista de recepción: todas las agendas.' : `Vista de ${esc(MED[roleMed()].n)}: solo su agenda y sus pacientes.`);
    render();
});
$$('.nav').forEach((b) => b.addEventListener('click', () => { ui.view = b.dataset.view; closeDrawer(); render(); }));
$$('[data-scale]').forEach((b) => b.addEventListener('click', () => {
    ui.scale = b.dataset.scale;
    if (ui.scale === 'dia' && ui.autoMed) ui.med = '';
    ui.autoMed = false;
    render();
}));
$$('[data-shift]').forEach((b) => b.addEventListener('click', () => {
    const n = +b.dataset.shift;
    if (ui.scale === 'semana') ui.date = addDays(ui.date, 7 * n);
    else { let k = addDays(ui.date, n); if (dow(k) === 0) k = addDays(k, n); ui.date = k; }
    render();
}));
$('#go-today').addEventListener('click', () => { ui.date = TODAY; render(); });
$('#f-esp').addEventListener('change', (e) => { ui.esp = e.target.value; if (ui.med && ui.esp && MED[ui.med].esp !== ui.esp) ui.med = ''; render(); });
$('#f-med').addEventListener('change', (e) => { ui.med = e.target.value; ui.autoMed = false; render(); });
['#q', '#l-rango', '#l-estado', '#l-esp', '#l-canal'].forEach((s) => $(s).addEventListener('input', renderLista));

document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act],[data-cita],[data-new],[data-day],[data-agenda],[data-newmed]');
    if (!t) return;
    if (t.dataset.act) return act(t.dataset.id, t.dataset.act);
    if (t.dataset.new) { const [m, k, h] = t.dataset.new.split('|'); return openModal('new', { med: m, fecha: k, hora: +h }); }
    if (t.dataset.day) { ui.date = t.dataset.day; ui.scale = 'dia'; ui.autoMed = false; return render(); }
    if (t.dataset.agenda) { ui.view = 'agenda'; ui.scale = 'dia'; ui.date = TODAY; ui.esp = ''; ui.med = t.dataset.agenda; return render(); }
    if (t.dataset.newmed) return openModal('new', { med: t.dataset.newmed });
    if (t.dataset.cita) openDrawer(t.dataset.cita);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerId) closeDrawer();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr[data-cita], [data-day]')) { e.preventDefault(); e.target.click(); }
});
$('#d-close').addEventListener('click', closeDrawer);
$('#scrim').addEventListener('click', closeDrawer);
$('#btn-new').addEventListener('click', () => openModal('new'));

$('#m-tel').addEventListener('input', lookupTel);
$('#m-esp').addEventListener('change', () => { md.fecha = null; fillMeds(); });
$('#m-med').addEventListener('change', (e) => { md.med = e.target.value; md.fecha = null; fillDays(); });
$('#m-svc').addEventListener('change', summary);
$('#m-days').addEventListener('click', (e) => { const b = e.target.closest('.day'); if (!b || b.disabled) return; md.fecha = b.dataset.k; md.hora = null; fillDays(); });
$('#m-slots').addEventListener('click', (e) => { const b = e.target.closest('.slot'); if (!b || b.disabled) return; md.hora = +b.dataset.t; fillSlots(); });
$('#m-form').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input')) e.preventDefault(); });
$('#m-form').addEventListener('submit', (e) => { if (e.submitter && e.submitter.value === 'ok' && !submitModal()) e.preventDefault(); });

$('#reset').addEventListener('click', () => {
    if (!confirm('¿Restablecer los datos de la demo? Se perderán las citas creadas o modificadas.')) return;
    db = generate(); pacIdx = PAC(); save(); closeDrawer(); render();
    toast('Datos de la demo restablecidos.');
});

// el reloj avanza: refresca tiempos de espera y la línea de "ahora" cada minuto
setInterval(() => { if (!$('#modal').open) render(); }, 60000);

render();
