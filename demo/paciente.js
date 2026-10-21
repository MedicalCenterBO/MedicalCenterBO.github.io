/* =========================================================
   Demo · Solicitar ficha (flujo del paciente) — Clínica MedicalCenter
   Información de la clínica → especialidad o médico → calendario de
   horarios → código de paciente o registro → ficha con QR → pago simulado
   → factura de venta y venta enviada.
   Usa los datos y utilidades de datos.js; las fichas quedan en el panel.
   ========================================================= */

const PASOS = [
    ['inicio', 'Información de la clínica'],
    ['como', 'Especialidad o médico'],
    ['horarios', 'Horarios disponibles'],
    ['codigo', 'Código de paciente'],
    ['ficha', 'Ficha y pago QR'],
    ['factura', 'Factura y venta enviada'],
];
const ETAPA = { inicio: 0, como: 1, esp: 1, med: 1, horarios: 2, codigo: 3, ficha: 4, factura: 5 };
const chev = '<i class="chev" aria-hidden="true">›</i>';
const mesKey = (k) => k.slice(0, 8) + '01';
const MAX_DIAS = 30;

const st = { paso: 'inicio', pila: [], esp: null, med: null, mes: mesKey(TODAY), fecha: null, sel: null, pac: null, reg: false, nuevo: null, cita: null, q: '' };
const reset = () => Object.assign(st, { paso: 'inicio', pila: [], esp: null, med: null, mes: mesKey(TODAY), fecha: null, sel: null, pac: null, reg: false, nuevo: null, cita: null, q: '' });

/* ---------- disponibilidad ---------- */
const medsEnFoco = () => (st.med ? [MED[st.med]] : MEDICOS.filter((m) => m.esp === st.esp));
function fichasLibres(k) {
    if (k < TODAY || k > addDays(TODAY, MAX_DIAS)) return [];
    const out = [];
    medsEnFoco().forEach((m) => slotsDe(m, k).forEach((t, i) => {
        if (libre(k, t) && !ocupado(m.id, k, t)) out.push({ med: m.id, hora: t, n: i + 1 });
    }));
    return out;
}

/* ---------- QR de muestra ---------- */
function qrSvg(seed) {
    const r = rngFrom(seed), N = 29;
    let cells = '';
    const finder = (x, y) => (x >= 0 && x < 7 && y >= 0 && y < 7);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const f = finder(x, y) || finder(x - (N - 7), y) || finder(x, y - (N - 7));
        if (f) continue;
        if (r() < .48) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    const eye = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg viewBox="-2 -2 ${N + 4} ${N + 4}" class="qr__svg" role="img" aria-label="Código QR de pago (muestra)"><rect x="-2" y="-2" width="${N + 4}" height="${N + 4}" fill="#fff"/><g fill="#12263a">${cells}${eye(0, 0)}${eye(N - 7, 0)}${eye(0, N - 7)}</g></svg>`;
}

/* ---------- pantallas ---------- */
const docCard = (m, extra = '') => `<div class="doc"><span class="av" style="--mc:${m.c}">${ini(m.n)}</span><div><b>${esc(m.n)}</b><small>${esc(m.esp)}${extra}</small></div></div>`;
const precio = () => SERVICIOS[st.sel ? MED[st.sel.med].esp : st.esp][0];

const V = {
    inicio: () => ({
        title: 'Inicio',
        html: `<section class="hero">
                <img src="../assets/logo-white.png" alt="Clínica MedicalCenter">
                <h2>¿Necesita un médico?</h2>
                <p>Solicite su ficha en minutos, elija el horario que le convenga y pague con QR. Sin filas y sin crear una cuenta.</p>
                <button class="btn btn--light" data-go="como">Solicitar ficha</button>
            </section>
            <h3 class="h">Nuestra clínica</h3>
            <p class="lead">Clínica MedicalCenter atiende en Santa Cruz de la Sierra con consulta externa, laboratorio e imagenología en un mismo lugar.</p>
            <div class="svcs">
                <div><span>🩺</span><b>Consulta externa</b></div>
                <div><span>🧪</span><b>Laboratorio</b></div>
                <div><span>🩻</span><b>Imagenología</b></div>
            </div>
            <h3 class="h">Especialidades</h3>
            <div class="chips">${ESPECIALIDADES.map((e) => `<button class="chip" data-esp="${esc(e)}">${esc(e)}</button>`).join('')}</div>
            <h3 class="h">Sede</h3>
            <div class="card card--line"><b>Sede Cristo Redentor</b><small>Av. Cristo Redentor · Santa Cruz de la Sierra</small><small>Consultas de lunes a sábado, según el horario de cada médico.</small></div>
            <h3 class="h">Cómo funciona</h3>
            <ol class="how">
                <li><b>Elija especialidad o médico</b> y vea sus horarios disponibles.</li>
                <li><b>Reserve su ficha</b> con su código de paciente, o regístrese para obtener uno.</li>
                <li><b>Pague con QR</b> y reciba su ficha y su factura por WhatsApp.</li>
            </ol>`,
        cta: '<button class="btn btn--primary btn--block" data-go="como">Solicitar ficha</button>',
    }),

    como: () => ({
        title: 'Cómo agendar',
        html: `<p class="lead">Para reservar su ficha elija el método que le sea más cómodo:</p>
            <button class="item" data-go="esp"><div><b>Por especialidad</b><small>Vea todos los horarios de la especialidad.</small></div>${chev}</button>
            <button class="item" data-go="med"><div><b>Por médico</b><small>Si ya sabe con quién quiere atenderse.</small></div>${chev}</button>`,
    }),

    esp: () => ({
        title: 'Especialidades',
        html: `<input class="search" id="q" type="search" placeholder="Buscar especialidad…" value="${esc(st.q)}" aria-label="Buscar especialidad">
            <div id="list">${ESPECIALIDADES.filter((e) => e.toLowerCase().includes(st.q.toLowerCase())).map((e) => {
                const n = MEDICOS.filter((m) => m.esp === e).length;
                return `<button class="item" data-esp="${esc(e)}"><div><b>${esc(e)}</b><small>${n} médico${n === 1 ? '' : 's'}</small></div>${chev}</button>`;
            }).join('') || '<p class="muted">Sin resultados.</p>'}</div>`,
    }),

    med: () => {
        const meds = MEDICOS.filter((m) => (!st.esp || m.esp === st.esp) && m.n.toLowerCase().includes(st.q.toLowerCase()));
        return {
            title: st.esp ? st.esp : 'Médicos',
            html: `${st.esp ? `<button class="item item--accent" data-todos="1"><div><b>Cualquier médico de ${esc(st.esp)}</b><small>Ver todos los horarios disponibles de la especialidad.</small></div>${chev}</button>
                <p class="h">O elija a su médico</p>` : `<input class="search" id="q" type="search" placeholder="Buscar médico…" value="${esc(st.q)}" aria-label="Buscar médico">`}
                ${meds.map((m) => `<button class="item" data-med="${m.id}">${docCard(m)}${chev}</button>`).join('') || '<p class="muted">Sin resultados.</p>'}`,
        };
    },

    horarios: () => {
        const meds = medsEnFoco();
        const m0 = meds[0];
        const head = st.med
            ? `<div class="card">${docCard(m0, ` · Consultorio ${m0.cons}`)}</div>
               <p class="h">Horario normal de atención</p>
               <div class="hours">${[1, 2, 3, 4, 5, 6].filter((d) => m0.hor[d]).map((d) => `<div><b>${DIAS_L[d]}</b><small>${m0.hor[d][0]} a ${m0.hor[d][1]}</small></div>`).join('')}</div>`
            : `<div class="card"><div class="doc"><span class="av av--esp">${ini(st.esp)}</span><div><b>${esc(st.esp)}</b><small>${meds.map((m) => esc(m.n)).join(' · ')}</small></div></div></div>`;

        // calendario del mes
        const first = parse(st.mes);
        const y = first.getFullYear(), mo = first.getMonth();
        const dias = new Date(y, mo + 1, 0).getDate();
        const lead = (first.getDay() + 6) % 7;
        let cells = '';
        for (let i = 0; i < lead; i++) cells += '<span></span>';
        for (let d = 1; d <= dias; d++) {
            const k = `${y}-${pad(mo + 1)}-${pad(d)}`;
            const n = fichasLibres(k).length;
            const cls = [k === TODAY && 'today', k === st.fecha && 'on', n && 'has'].filter(Boolean).join(' ');
            cells += `<button class="${cls}" data-dia="${k}" ${n ? '' : 'disabled'} aria-label="${fmtLong(k)}${n ? `, ${n} fichas` : ', sin fichas'}">${d}${n ? '<i></i>' : ''}</button>`;
        }
        const prevOk = st.mes > mesKey(TODAY);
        const nextOk = mesKey(addDays(st.mes, 32)) <= mesKey(addDays(TODAY, MAX_DIAS));

        let fichas = '';
        if (st.fecha) {
            const libres = fichasLibres(st.fecha);
            const grupos = meds.map((m) => [m, libres.filter((f) => f.med === m.id)]).filter(([, l]) => l.length);
            fichas = `<p class="h">Seleccione su ficha · ${fmtLong(st.fecha)}</p>` + (grupos.length ? grupos.map(([m, l]) => `
                ${st.med ? '' : `<p class="sub"><span class="dot" style="--mc:${m.c}"></span>${esc(m.n)}</p>`}
                <div class="fichas">${l.map((f) => `<button class="ficha${st.sel && st.sel.med === f.med && st.sel.hora === f.hora ? ' on' : ''}" data-ficha="${f.med}|${f.hora}"><small>Ficha</small><b>${f.n}</b><span>🕒 ${hm(f.hora)}</span></button>`).join('')}</div>`).join('')
                : '<div class="empty">No hay fichas habilitadas para esta fecha. Elija otra fecha.</div>');
        } else fichas = '<div class="empty">Elija un día marcado en el calendario para ver las fichas disponibles.</div>';

        return {
            title: 'Horarios',
            html: `${head}
                <p class="h">Fechas disponibles</p>
                <div class="cal">
                    <div class="cal__head"><button data-mes="-1" ${prevOk ? '' : 'disabled'} aria-label="Mes anterior">‹</button><b>${MESES_L[mo]} ${y}</b><button data-mes="1" ${nextOk ? '' : 'disabled'} aria-label="Mes siguiente">›</button></div>
                    <div class="cal__dow">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => `<span>${d}</span>`).join('')}</div>
                    <div class="cal__grid">${cells}</div>
                </div>
                ${fichas}`,
            cta: st.sel ? `<div class="sum"><small>${esc(MED[st.sel.med].n)} · ${fmtDay(st.fecha)} · ${hm(st.sel.hora)}</small><b>${esc(precio()[0])} · ${bs(precio()[1])}</b></div><button class="btn btn--primary" data-go="codigo">Reservar</button>` : '',
        };
    },

    codigo: () => {
        const p = st.pac ? pacIdx[st.pac] : null;
        if (st.reg) {
            return {
                title: 'Registrarse',
                html: `<div class="note">Complete sus datos para obtener su <b>código de paciente</b>. Lo usará cada vez que solicite una ficha.</div>
                    <label class="fld"><span>Nombre completo</span><input id="r-nom" autocomplete="name" placeholder="Nombre y apellidos"></label>
                    <label class="fld"><span>Carnet de identidad (CI)</span><input id="r-ci" inputmode="numeric" placeholder="Ej. 7654321"></label>
                    <label class="fld"><span>Celular (WhatsApp)</span><input id="r-tel" inputmode="tel" placeholder="Ej. 71234567"></label>
                    <label class="fld"><span>Correo para la factura <em>(opcional)</em></span><input id="r-mail" type="email" placeholder="nombre@correo.com"></label>
                    <p class="err" id="err" role="alert"></p>
                    <button class="lnk" data-reg="0">Ya tengo un código de paciente</button>`,
                cta: '<button class="btn btn--primary btn--block" data-act="registrar">Obtener mi código</button>',
            };
        }
        return {
            title: 'Código de paciente',
            html: `${st.nuevo ? `<div class="code-new"><small>Su código de paciente es</small><b>${st.nuevo}</b><span>Guárdelo para su próxima ficha. También se lo enviamos por WhatsApp.</span></div>`
                : '<div class="note">Para reservar ingrese su <b>código de paciente</b>. No necesita crear una cuenta.</div>'}
                <label class="fld"><span>Código de paciente</span><input id="cod" autocomplete="off" placeholder="Ej. MC-10200" value="${p ? p.cod : ''}"></label>
                <p class="found" id="found">${p ? `✓ Paciente encontrado · <b>${esc(p.n)}</b>` : ''}</p>
                <p class="err" id="err" role="alert"></p>
                ${st.nuevo ? '' : `<div class="or"><span>¿No tiene código?</span></div>
                <button class="btn btn--ghost btn--block" data-reg="1">Registrarse para obtener un código</button>
                <p class="hint">Para probar la demo use <button class="lnk" data-demo="MC-10200">MC-10200</button> (María Rojas).</p>`}`,
            cta: `<button class="btn btn--primary btn--block" data-act="identificar" ${p ? '' : 'disabled'}>Continuar</button>`,
        };
    },

    ficha: () => {
        const c = find(st.cita), p = pacIdx[c.pac], m = MED[c.med];
        const n = slotsDe(m, c.fecha).indexOf(c.hora) + 1;
        const [svc, monto] = svcOf(c);
        return {
            title: 'Su ficha',
            html: `<div class="ticket">
                    <div class="ticket__doc"><span class="av" style="--mc:${m.c}">${ini(m.n)}</span><b>${esc(m.n)}</b><small>${esc(m.esp)} · Consultorio ${m.cons}</small></div>
                    <ul>
                        <li>👤 ${esc(p.n)} · <span class="mono">${p.cod}</span></li>
                        <li>📅 ${fmtLong(c.fecha)}</li>
                        <li>🕒 ${hm(c.hora)}</li>
                        <li>🏥 Sede Cristo Redentor</li>
                        <li>🩺 ${esc(svc)}</li>
                    </ul>
                    <div class="ticket__n"><b>Ficha ${n}</b><small>Total</small><strong>${bs(monto)}</strong></div>
                </div>
                <div class="pay">
                    <p>Pague <b>${bs(monto)}</b> escaneando el código QR desde la app de su banco.</p>
                    <div class="qr">${qrSvg(c.id)}</div>
                    <small class="muted">Vence en <b id="timer">15:00</b> · Ref. ${c.id}</small>
                </div>
                <div class="warn">La ficha queda reservada a su nombre y se confirma al recibir el pago.</div>`,
            cta: '<button class="btn btn--demo btn--block" data-act="pagar"><em>Solo demo</em>Simular pago QR</button>',
        };
    },

    factura: () => {
        const c = find(st.cita), p = pacIdx[c.pac], m = MED[c.med];
        const [svc, monto] = svcOf(c);
        const n = slotsDe(m, c.fecha).indexOf(c.hora) + 1;
        const nro = 1000 + Number(c.id.slice(2));
        const cuf = rngFrom(c.id + 'cuf');
        const hex = Array.from({ length: 28 }, () => '0123456789ABCDEF'[Math.floor(cuf() * 16)]).join('');
        return {
            title: 'Factura',
            html: `<div class="done">
                    <span class="done__ok" aria-hidden="true">✓</span>
                    <h2>Venta enviada</h2>
                    <p>Su ficha ${n} con ${esc(m.n)} está confirmada para el ${fmtLong(c.fecha)} a las ${hm(c.hora)}.</p>
                    <ol class="track">
                        <li>Pago QR confirmado por el banco</li>
                        <li>Factura emitida</li>
                        <li>Ficha y factura enviadas por WhatsApp al ${p.tel}${p.mail ? ` y a ${esc(p.mail)}` : ''}</li>
                    </ol>
                </div>
                <article class="inv" aria-label="Factura de venta">
                    <header>
                        <div><b>CLÍNICA MEDICALCENTER</b><small>Casa matriz · Sede Cristo Redentor<br>Santa Cruz de la Sierra</small></div>
                        <div class="inv__meta"><small>NIT</small><b>Muestra</b><small>Factura Nº</small><b>${nro}</b></div>
                    </header>
                    <h3>FACTURA<small>(con derecho a crédito fiscal)</small></h3>
                    <dl>
                        <div><dt>Fecha</dt><dd>${fmtDay(TODAY)} · ${hm(nowMin())}</dd></div>
                        <div><dt>Nombre / Razón social</dt><dd>${esc(p.n)}</dd></div>
                        <div><dt>NIT / CI</dt><dd>${p.ci || '—'}</dd></div>
                        <div><dt>Cód. paciente</dt><dd>${p.cod}</dd></div>
                    </dl>
                    <table>
                        <thead><tr><th>Cant.</th><th>Descripción</th><th>Importe</th></tr></thead>
                        <tbody><tr><td>1</td><td>${esc(svc)}<small>${esc(m.n)} · Ficha ${n} · ${fmtDay(c.fecha)} ${hm(c.hora)}</small></td><td>${bs(monto)}</td></tr></tbody>
                        <tfoot><tr><td colspan="2">Total</td><td>${bs(monto)}</td></tr><tr><td colspan="2">Pagado con QR</td><td>${bs(monto)}</td></tr></tfoot>
                    </table>
                    <footer>
                        <div class="qr qr--sm">${qrSvg(hex)}</div>
                        <small>CUF ${hex}<br>Factura de muestra generada para la demo. En producción la emite el sistema de facturación en línea.</small>
                    </footer>
                </article>`,
            cta: '<a class="btn btn--ghost" href="dashboard.html">Ver en el panel</a><button class="btn btn--primary" data-act="otra">Solicitar otra ficha</button>',
        };
    },
};
const MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const find = (id) => db.citas.find((c) => c.id === id);

/* ---------- render y navegación ---------- */
let timer;
function render() {
    const v = V[st.paso]();
    $('#bar-title').textContent = v.title;
    $('#back').hidden = st.paso === 'inicio' || st.paso === 'factura';
    $('#screen').innerHTML = v.html;
    $('#screen').scrollTop = 0;
    $('#cta').innerHTML = v.cta || '';
    $('#cta').hidden = !v.cta;
    const e = ETAPA[st.paso];
    $('#prog').style.width = `${((e + 1) / PASOS.length) * 100}%`;
    $('#intro-steps').innerHTML = PASOS.map(([, t], i) => `<li class="${i < e ? 'is-done' : i === e ? 'is-now' : ''}">${t}</li>`).join('');
    clearInterval(timer);
    if (st.paso === 'ficha') {
        let s = 15 * 60;
        timer = setInterval(() => { s = Math.max(s - 1, 0); const el = $('#timer'); if (el) el.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }, 1000);
    }
    const q = $('#q');
    if (q) { q.addEventListener('input', () => { st.q = q.value; const pos = q.selectionStart; render(); const n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); }); }
    const cod = $('#cod');
    if (cod) cod.addEventListener('input', buscarCodigo);
}

function go(paso) {
    st.pila.push(st.paso);
    st.paso = paso;
    st.q = '';
    if (paso === 'como') { st.esp = null; st.med = null; }
    if (paso === 'esp') st.med = null;
    if (paso === 'codigo') { st.nuevo = null; st.reg = false; }
    if (paso === 'horarios') { st.mes = mesKey(TODAY); st.fecha = primerDia(); st.sel = null; }
    render();
}
function back() {
    if (st.paso === 'ficha') liberar();
    if (st.paso === 'codigo' && st.reg) { st.reg = false; return render(); }
    st.paso = st.pila.pop() || 'inicio';
    st.q = '';
    render();
}
function primerDia() {
    for (let i = 0; i <= MAX_DIAS; i++) { const k = addDays(TODAY, i); if (fichasLibres(k).length) { st.mes = mesKey(k); return k; } }
    return null;
}
// si el paciente vuelve atrás sin pagar, la ficha reservada se libera
function liberar() {
    const i = db.citas.findIndex((c) => c.id === st.cita && !c.pago);
    if (i >= 0) { db.citas.splice(i, 1); save(); }
    st.cita = null;
}

/* ---------- identificación ---------- */
function buscarCodigo() {
    const raw = $('#cod').value.trim().toUpperCase().replace(/\s+/g, '');
    const cod = /^\d+$/.test(raw) ? 'MC-' + raw : raw;
    const p = db.pacs.find((x) => x.cod === cod);
    st.pac = p ? p.id : null;
    $('#found').innerHTML = p ? `✓ Paciente encontrado · <b>${esc(p.n)}</b>` : '';
    $('#err').textContent = raw.length >= 8 && !p ? 'No encontramos ese código. Revíselo o regístrese para obtener uno.' : '';
    $('[data-act="identificar"]').disabled = !p;
}

function registrar() {
    const err = (t) => { $('#err').textContent = t; };
    const n = $('#r-nom').value.trim().replace(/\s+/g, ' ');
    const ci = $('#r-ci').value.replace(/\D/g, '');
    const tel = $('#r-tel').value.replace(/\D/g, '');
    const mail = $('#r-mail').value.trim();
    if (n.split(' ').length < 2) return err('Ingrese su nombre y apellido.');
    if (ci.length < 5) return err('Ingrese su número de carnet de identidad.');
    if (!/^[67]\d{7}$/.test(tel)) return err('Ingrese un celular de 8 dígitos que empiece con 6 o 7.');
    const ya = db.pacs.find((x) => x.tel === tel || (x.ci && x.ci === ci));
    if (ya) { st.pac = ya.id; st.nuevo = ya.cod; st.reg = false; render(); $('#err').textContent = ''; return; }
    const p = { id: 'p' + db.pacs.length, cod: nuevoCodigo(), n, ci, tel, mail };
    db.pacs.push(p); pacIdx = PAC(); save();
    st.pac = p.id; st.nuevo = p.cod; st.reg = false;
    render();
}

function reservar() {
    const { med, hora } = st.sel;
    if (ocupado(med, st.fecha, hora)) { st.paso = 'horarios'; st.sel = null; render(); return; }
    const c = { id: 'C-' + (++db.seq), pac: st.pac, med, fecha: st.fecha, hora, svc: 0, estado: 'reservada', pago: false, canal: 'portal', hist: [[stamp(), 'Ficha reservada en el portal · pago QR pendiente']] };
    db.citas.push(c); save();
    st.cita = c.id;
    go('ficha');
}

function pagar() {
    const c = find(st.cita);
    c.pago = true; c.estado = 'confirmada';
    c.hist.push([stamp(), 'Pago QR confirmado por el banco'], [stamp(), 'Factura emitida'], [stamp(), 'Ficha y factura enviadas por WhatsApp']);
    save();
    st.pila = [];
    st.paso = 'factura';
    render();
}

/* ---------- eventos ---------- */
$('#back').addEventListener('click', back);
document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go],[data-esp],[data-med],[data-todos],[data-dia],[data-mes],[data-ficha],[data-act],[data-reg],[data-demo]');
    if (!t || t.disabled) return;
    const d = t.dataset;
    if (d.go) return go(d.go);
    if (d.esp) {
        // desde las especialidades del inicio se salta directo a sus médicos
        if (st.paso === 'inicio') { st.pila.push('inicio', 'como'); st.paso = 'esp'; }
        st.esp = d.esp; st.med = null;
        return go('med');
    }
    if (d.med) { st.med = d.med; return go('horarios'); }
    if (d.todos) { st.med = null; return go('horarios'); }
    if (d.dia) { st.fecha = d.dia; st.sel = null; return render(); }
    if (d.mes) { st.mes = mesKey(addDays(st.mes, +d.mes > 0 ? 32 : -1)); return render(); }
    if (d.ficha) { const [m, h] = d.ficha.split('|'); st.sel = { med: m, hora: +h }; render(); $('#cta').scrollIntoView({ block: 'nearest' }); return; }
    if (d.reg) { st.reg = d.reg === '1'; return render(); }
    if (d.demo) { $('#cod').value = d.demo; return buscarCodigo(); }
    if (d.act === 'identificar') return reservar();
    if (d.act === 'registrar') return registrar();
    if (d.act === 'pagar') return pagar();
    if (d.act === 'otra') { reset(); return render(); }
});
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.matches('input')) return;
    e.preventDefault();
    const b = $('#cta .btn--primary');
    if (b && !b.disabled) b.click();
});

render();
