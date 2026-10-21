/* =========================================================
   Tótem de reserva de fichas — Clínica MedicalCenter (demo)
   Mismo recorrido que «Agendar cita» de la propuesta, pensado para
   una pantalla táctil grande: sin registro, con teclado en pantalla,
   resumen siempre visible y reinicio automático por inactividad.
   Todos los datos son ficticios.
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const bs = (n) => 'Bs ' + n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const bs0 = (n) => 'Bs ' + Math.round(n).toLocaleString('es-BO');
const sinTildes = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- datos de ejemplo ---------- */
const ESPECIALIDADES = [
    ['Medicina general', 'steth', 'Consultas y chequeos'],
    ['Pediatría', 'baby', 'Niños y adolescentes'],
    ['Ginecología', 'mujer', 'Salud de la mujer'],
    ['Neurología', 'brain', 'Cerebro y sistema nervioso'],
    ['Cardiología', 'heart', 'Corazón y presión arterial'],
    ['Traumatología', 'bone', 'Huesos, articulaciones y lesiones'],
    ['Imagenología', 'scan', 'Ecografía, rayos X, tomografía'],
    ['Laboratorio', 'flask', 'Análisis clínicos'],
];
// [nombre, especialidad, días de atención (0 = domingo), hora de inicio, hora de fin]
const MEDICOS = [
    ['Dr. Ricardo Salvatierra', 'Neurología', [1, 2, 3, 4, 5], 8, 12],
    ['Dra. Carla Méndez', 'Pediatría', [1, 2, 3, 4, 5, 6], 8, 11],
    ['Dr. Jorge Áñez', 'Medicina general', [1, 2, 3, 4, 5, 6], 7, 12],
    ['Dra. Ana Vaca', 'Medicina general', [1, 3, 5], 14, 18],
    ['Dra. Lucía Arteaga', 'Ginecología', [2, 4, 6], 9, 12],
    ['Dr. Marcelo Rivero', 'Cardiología', [1, 2, 4, 5], 15, 19],
    ['Dra. Paola Justiniano', 'Traumatología', [1, 3, 5], 8, 12],
    ['Dr. Hugo Roca', 'Imagenología', [1, 2, 3, 4, 5, 6], 7, 13],
    ['Toma de muestras', 'Laboratorio', [1, 2, 3, 4, 5, 6], 7, 11],
];
// [servicio, precio, detalle] por especialidad; el primero viene marcado
const SERVICIOS = {
    'Medicina general': [['Consulta médica', 150, 'Consulta con médico general'], ['Certificado médico', 100], ['Control de presión arterial', 50]],
    'Pediatría': [['Consulta pediátrica', 200, 'Consulta con la especialista'], ['Control de niño sano', 180], ['Vacunación', 120]],
    'Ginecología': [['Consulta ginecológica', 250, 'Consulta con la especialista'], ['Papanicolaou', 180], ['Ecografía obstétrica', 320]],
    'Neurología': [['Consulta médica', 250, 'Consulta con el especialista'], ['Electroencefalograma', 350], ['Electromiografía', 420], ['Doppler transcraneal', 380]],
    'Cardiología': [['Consulta médica', 250, 'Consulta con el especialista'], ['Electrocardiograma', 150], ['Ecocardiograma', 450], ['Holter de 24 horas', 380]],
    'Traumatología': [['Consulta médica', 250, 'Consulta con la especialista'], ['Infiltración', 300], ['Rayos X', 180]],
    'Imagenología': [['Ecografía abdominal', 280, 'Con preparación en ayunas'], ['Rayos X de tórax', 150], ['Tomografía', 1400], ['Resonancia magnética', 1800]],
    'Laboratorio': [['Hemograma completo', 90, 'Resultado el mismo día'], ['Perfil lipídico', 150], ['Glicemia', 40], ['Examen general de orina', 50]],
};
const REGISTRADOS = { '71234567': { nombre: 'María Rojas', nit: '4589632', razon: 'Rojas', correo: 'maria.rojas@correo.com' } };
const PASOS = ['Inicio', 'Cómo agendar', 'Especialidad', 'Médico', 'Fecha y ficha', 'Servicios', 'Celular', 'Facturación', 'Confirmar', 'Pago QR', 'Listo'];
const SUB = ['Reserve su ficha sin registrarse', 'Elija cómo buscar', 'Toque la especialidad', 'Toque el médico', 'Elija la fecha y su ficha', 'Marque lo que necesita', 'Solo su número de celular', 'Datos para su factura', 'Revise su reserva', 'Escanee con la app de su banco', 'Su ficha está reservada'];

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_L = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// próximos 6 días con atención (se omite el domingo), desde hoy
function proximosDias() {
    const out = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < 6) { if (d.getDay() !== 0) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
}
const FECHAS = proximosDias();

// fichas de un médico en una fecha: cada 15 minutos; algunas ya ocupadas (siempre las mismas)
function fichasDe(medIdx, fecha) {
    const [, , dias, ini, fin] = MEDICOS[medIdx];
    if (!dias.includes(fecha.getDay())) return [];
    const hoy = new Date(), esHoy = fecha.toDateString() === hoy.toDateString();
    const ahora = hoy.getHours() * 60 + hoy.getMinutes() + 30;
    let seed = medIdx * 97 + fecha.getDate() * 31 + fecha.getMonth() * 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const out = [];
    for (let m = ini * 60, n = 1; m < fin * 60; m += 15, n++) {
        const ocupada = rnd() < (esHoy ? 0.75 : 0.45) || (esHoy && m < ahora);
        out.push({ n, hora: hhmm(m), ocupada });
    }
    return out;
}

/* ---------- íconos de línea (estilo uniforme, sin emojis) ---------- */
const ICONOS = {
    steth: '<path d="M5 3v5a4 4 0 008 0V3"/><path d="M9 12v2a6 6 0 0012 0v-3"/><circle cx="21" cy="9" r="2"/>',
    baby: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0M12 3c-1.5 0-2 1.6-.8 2.6"/>',
    mujer: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
    brain: '<path d="M9.5 4A3 3 0 006.5 7 3 3 0 004.5 12a3 3 0 002 5 3 3 0 003 3h1V4zM14.5 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3h-1V4z"/>',
    heart: '<path d="M20.8 5.6a5 5 0 00-7.7-.6L12 6.1l-1.1-1.1a5 5 0 00-7.1 7.1L12 20.3l8.2-8.2a5 5 0 00.6-6.5z"/><path d="M3.5 12h4l2-3 3 6 2-3h5.5"/>',
    bone: '<path d="M17 10l-7 7a2.5 2.5 0 11-3.5-.5 2.5 2.5 0 11-.5-3.5l7-7a2.5 2.5 0 113.5.5 2.5 2.5 0 11.5 3.5z"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M12 7v10M9 9.5h6M9 12h6M9.5 14.5h5"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.5 15h9"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3"/>',
    hosp: '<path d="M4 21V8l8-5 8 5v13"/><path d="M12 9v6M9 12h6M10 21v-3h4v3"/>',
    medico: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1M12 15.5v4M10 17.5h4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    recibo: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const ico = (k) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[k] || ''}</svg>`;

/* ---------- modo de teclado ----------
   Por defecto se usa el teclado del dispositivo (campos de texto normales).
   El botón flotante activa los teclados en pantalla del tótem. */
let TECLADO_APP = false;
try { TECLADO_APP = localStorage.getItem('totem.tecladoApp') === '1' || /teclado=app/.test(location.search); } catch { /* sin almacenamiento */ }
const PASOS_CON_TEXTO = [2, 3, 6, 7];

/* ---------- estado de la reserva ---------- */
const NUEVA = () => ({ paso: 0, esp: null, viaEsp: false, med: null, dia: 0, ficha: null, svc: new Set(), tel: '', nombre: '', nit: '', razon: '', correo: '', whatsapp: true, pagando: false, pagado: false, buscar: '' });
let S = NUEVA();

const med = () => (S.med === null ? null : MEDICOS[S.med]);
const espActual = () => (med() ? med()[1] : S.esp);
const servicios = () => SERVICIOS[espActual()] || [];
const total = () => [...S.svc].reduce((a, i) => a + servicios()[i][1], 0);
const fichaSel = () => (S.med === null || S.ficha === null ? null : fichasDe(S.med, FECHAS[S.dia]).find((f) => f.n === S.ficha));
const paciente = () => REGISTRADOS[S.tel] || null;
const telValido = () => /^[67]\d{7}$/.test(S.tel);
const fechaLarga = (f) => `${DIAS_L[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
const iniciales = (n) => n.replace(/^Dr(a)?\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const lupa = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';

/* ---------- pantallas ---------- */
const VISTAS = [
    // 0 · inicio
    () => `<div class="hero"><div><p>¿Necesita un médico?</p><small>Reserve su ficha en menos de 2 minutos, sin crear una cuenta.</small></div>
            <button class="btn" data-a="go" data-to="1">Reservar ficha</button></div>
        <p class="h">También puede</p>
        <div class="quick">
            <button data-a="espDirecta" data-v="Laboratorio"><i>${ico('flask')}</i>Laboratorio</button>
            <button data-a="espDirecta" data-v="Imagenología"><i>${ico('scan')}</i>Imagenología</button>
            <button data-a="aviso" data-v="Sus resultados están en el portal y le llegan por WhatsApp apenas estén listos."><i>${ico('doc')}</i>Resultados</button>
            <button data-a="aviso" data-v="Para ver sus citas ingrese al portal con su usuario y contraseña."><i>${ico('cal')}</i>Mis citas</button>
        </div>
        <p class="h">Así de fácil</p>
        <div class="how"><span><b>1</b>Elija especialidad o médico</span><span><b>2</b>Escoja fecha y ficha</span><span><b>3</b>Ingrese su celular</span><span><b>4</b>Pague con QR</span></div>`,

    // 1 · cómo agendar
    () => `<p class="lead">¿Cómo prefiere buscar su ficha?</p>
        <div class="choice">
            <button class="big" data-a="go" data-to="2"><i>${ico('hosp')}</i><b>Por especialidad</b><small>Si sabe qué tipo de atención necesita: pediatría, cardiología, laboratorio…</small></button>
            <button class="big" data-a="porMedico"><i>${ico('medico')}</i><b>Por médico</b><small>Si ya conoce a su médico y quiere atenderse con él o ella.</small></button>
        </div>`,

    // 2 · especialidades
    () => `${buscador('Buscar especialidad')}<div id="lista">${listaEsp()}</div>`,

    // 3 · médicos
    () => `${buscador('Buscar médico', S.esp)}<div id="lista">${listaMed()}</div>`,

    // 4 · fecha y ficha
    () => {
        const [n, e, dias, ini, fin] = med();
        const fichas = fichasDe(S.med, FECHAS[S.dia]);
        return `<div class="doc doc--head"><span class="av">${iniciales(n)}</span><span><b>${esc(n)}</b><small>${esc(e)}</small><em>Atiende ${rangoDias(dias)} · ${hhmm(ini * 60)} a ${hhmm(fin * 60)}</em></span></div>
        <p class="h">1 · Elija la fecha</p>
        <div class="days">${FECHAS.map((f, i) => {
            const libres = fichasDe(S.med, f).filter((x) => !x.ocupada).length;
            return `<button class="day${i === S.dia ? ' is-on' : ''}${libres ? '' : ' is-full'}" data-a="dia" data-v="${i}"><small>${etiquetaDia(f)}</small><b>${f.getDate()}</b><em>${libres ? libres + ' libres' : 'Sin fichas'}</em></button>`;
        }).join('')}</div>
        <p class="h">2 · Toque su ficha · ${fechaLarga(FECHAS[S.dia])}</p>
        ${fichas.some((f) => !f.ocupada)
            ? `<div class="fichas">${fichas.map((f) => `<button class="ficha${S.ficha === f.n ? ' is-on' : ''}" data-a="ficha" data-v="${f.n}"${f.ocupada ? ' disabled' : ''}><small>Ficha</small><b>${f.n}</b><span>${f.hora}</span></button>`).join('')}</div>`
            : `<div class="empty">${fichas.length ? 'Ya no quedan fichas para este día.' : 'El médico no atiende este día.'} Elija otra fecha.</div>`}`;
    },

    // 5 · servicios
    () => `<p class="lead">¿Qué necesita en su cita?</p>
        <div class="svcs">${servicios().map(([t, v, d], i) => `<button class="svc${S.svc.has(i) ? ' is-on' : ''}" data-a="svc" data-v="${i}" aria-pressed="${S.svc.has(i)}">
            <span class="box">${S.svc.has(i) ? '✓' : ''}</span><span><b>${esc(t)}</b>${d ? `<small>${esc(d)}</small>` : ''}</span><span class="pr">${bs0(v)}</span></button>`).join('')}</div>`,

    // 6 · celular
    () => `<div class="phone${TECLADO_APP ? '' : ' phone--nativo'}">
            <div class="phone__left">
                <p class="lead">Ingrese su número de celular</p>
                <div class="note">No necesita crear una cuenta. Si ya se atendió con nosotros, lo reconocemos por su número.</div>
                ${TECLADO_APP
                    ? `<div class="display"><span>+591</span>${S.tel ? `<b>${S.tel.replace(/(\d{4})(?=\d)/, '$1 ')}</b><i class="caret"></i>` : '<b class="ph">7000 0000</b>'}</div>`
                    : `<label class="display display--input"><span>+591</span><input data-tel type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="8" placeholder="7000 0000" value="${S.tel}" aria-label="Número de celular"></label>`}
                <div id="tel-info">${telInfo()}</div>
                <p class="demo-hint">Demo: <button data-a="demoTel" data-v="71234567">usar un número registrado</button> o <button data-a="demoTel" data-v="76543210">uno nuevo</button></p>
            </div>
            ${TECLADO_APP ? `<div class="pad">${['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => `<button data-a="tecla" data-v="${k}">${k}</button>`).join('')}
                <button class="k-fn" data-a="tecla" data-v="C">Borrar todo</button><button data-a="tecla" data-v="0">0</button><button class="k-fn" data-a="tecla" data-v="<">⌫</button></div>` : ''}
        </div>`,

    // 7 · facturación
    () => `<p class="lead">¿A nombre de quién emitimos la factura?</p>
        <div class="note">Estos datos son opcionales. Si los deja vacíos, la factura se emite a nombre de ${esc(nombrePaciente())} sin NIT.</div>
        <div class="grid2">${campo('nit', 'NIT o CI (opcional)', 'num', 'Toque para escribir')}${campo('razon', 'Nombre o razón social (opcional)', 'alpha', 'Toque para escribir')}</div>
        <button class="toggle${S.whatsapp ? ' is-on' : ''}" data-a="whatsapp"><span class="sw"></span><span><b>Enviarme la factura y la confirmación por WhatsApp</b><small>Al +591 ${S.tel}</small></span></button>
        ${campo('correo', 'Correo electrónico (opcional)', 'email', 'Toque para escribir su correo')}`,

    // 8 · confirmar
    () => {
        const [n, e] = med(), f = fichaSel(), fecha = FECHAS[S.dia];
        return `<div class="ticket">
            <div class="ticket__left"><small>Ficha</small><b>${f.n}</b><span>${f.hora} · ${DIAS[fecha.getDay()]} ${fecha.getDate()}</span></div>
            <div class="ticket__right"><ul>
                <li><i>${ico('user')}</i><span><b>${esc(nombrePaciente())}</b><small>Cel. ${S.tel}</small></span></li>
                <li><i>${ico('steth')}</i><span><b>${esc(n)}</b><small>${esc(e)}</small></span></li>
                <li><i>${ico('cal')}</i><span><b>${fechaLarga(fecha)}</b><small>${f.hora} · Sede Cristo Redentor</small></span></li>
                <li><i>${ico('recibo')}</i><span><b>${[...S.svc].map((i) => servicios()[i][0]).join(', ')}</b><small>Factura a ${esc(S.razon.trim() || nombrePaciente())} · ${S.nit ? `NIT/CI ${S.nit}` : 'sin NIT'}</small></span></li>
            </ul><div class="ticket__tot"><small>Total a pagar</small><b>${bs(total())}</b></div></div>
        </div>
        <div class="note note--warn">Revise que los datos sean correctos antes de pagar. Preséntese 15 minutos antes de su cita.</div>`;
    },

    // 9 · pago QR
    () => `<div class="pay">
            <div class="qrcard">${qrSVG()}<small>Ref. MC-${new Date().getFullYear()}-00${4800 + (S.ficha || 0)}</small></div>
            <div class="screen__inner" style="margin:0">
                <p class="lead">Pague <b>${bs(total())}</b> con QR</p>
                <span class="timer">${ico('reloj')} Vence en <b id="qr-timer">15:00</b></span>
                <div class="pay__how"><b>Cómo pagar:</b> abra la app de su banco, elija <b>Pagar con QR</b> y apunte la cámara a este código. Cualquier banco del país.</div>
                <ul class="pay__steps" id="pay-steps">
                    <li class="done">Código QR generado</li>
                    <li class="now">Esperando la confirmación del banco</li>
                    <li>Cita registrada en Medicaltec</li>
                    <li>Factura emitida por SBA</li>
                </ul>
            </div>
        </div>`,

    // 10 · listo
    () => {
        const [n, e] = med(), f = fichaSel(), fecha = FECHAS[S.dia];
        return `<div class="fin"><div class="fin__msg">
            <div class="fin__check">✓</div>
            <h2>¡Ficha reservada!</h2>
            <p>${S.whatsapp ? `Le enviamos la confirmación y la factura por WhatsApp al ${S.tel}.` : 'Su factura fue emitida.'} Retire su comprobante impreso.</p>
            <p class="printing" id="printing">Imprimiendo su comprobante…</p>
            <p class="restart">El sistema volverá al inicio en <b id="restart">25</b> segundos.</p></div>
            <div class="slip"><small>Clínica MedicalCenter</small><b>Ficha ${f.n}</b>
                <p><strong>${esc(n)}</strong><br>${esc(e)}<br>${fechaLarga(fecha)} · ${f.hora}</p><hr>
                <p>${esc(nombrePaciente())} · ${bs(total())} pagado</p><hr>
                <p>Preséntese 15 minutos antes en recepción.</p></div>
        </div>`;
    },
];

function etiquetaDia(f) {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const dif = Math.round((f - hoy) / 86400000);
    return dif === 0 ? 'Hoy' : dif === 1 ? 'Mañana' : DIAS[f.getDay()];
}
const nombrePaciente = () => (paciente() ? paciente().nombre : S.nombre || 'Nuevo paciente');
function rangoDias(dias) {
    const d = [...dias].sort();
    const consecutivos = d.every((x, i) => i === 0 || x === d[i - 1] + 1);
    return consecutivos && d.length > 2 ? `${DIAS[d[0]]} a ${DIAS[d[d.length - 1]]}` : d.map((x) => DIAS[x]).join(', ');
}
function listaEsp() {
    const q = sinTildes(S.buscar.trim());
    const l = ESPECIALIDADES.filter(([n]) => sinTildes(n).includes(q));
    return `<div class="tiles">${l.map(([n, i, d]) => `<button class="tile" data-a="esp" data-v="${esc(n)}"><i>${ico(i)}</i><b>${esc(n)}</b><small>${esc(d)}</small></button>`).join('') || '<div class="empty">No encontramos esa especialidad.</div>'}</div>`;
}
function listaMed() {
    const q = sinTildes(S.buscar.trim());
    const l = MEDICOS.map((m, i) => [m, i]).filter(([m]) => (!S.esp || m[1] === S.esp) && (sinTildes(m[0]).includes(q) || sinTildes(m[1]).includes(q)));
    return `<div class="docs">${l.map(([[n, e, dias, ini, fin], i]) => `<button class="doc" data-a="med" data-v="${i}"><span class="av">${iniciales(n)}</span>
            <span><b>${esc(n)}</b><small>${esc(e)}</small><em>${rangoDias(dias)} · ${hhmm(ini * 60)} a ${hhmm(fin * 60)}</em></span><span class="go">›</span></button>`).join('') || '<div class="empty">No encontramos ese médico.</div>'}</div>`;
}
function telInfo() {
    const p = paciente();
    if (telValido()) return p
        ? `<div class="found"><span class="av">${iniciales(p.nombre)}</span><div><b>¡Hola, ${esc(p.nombre)}!</b><small>Encontramos su registro</small></div></div>`
        : `<div class="found found--new"><div><b>Número nuevo</b><small>Escriba su nombre y quedará registrado</small></div></div>
           ${campo('nombre', 'Nombre completo', 'alpha', 'Toque para escribir su nombre')}`;
    return S.tel.length === 8 ? '<div class="note note--warn">El número debe empezar con 6 o 7.</div>' : '';
}
function buscador(ph, chip) {
    const quitar = chip ? `<span class="clear" data-a="quitarEsp">${esc(chip)} ✕</span>` : '';
    if (!TECLADO_APP) return `<label class="search">${lupa}<input data-buscar type="search" enterkeyhint="search" autocomplete="off" placeholder="${ph}…" value="${esc(S.buscar)}" aria-label="${ph}">${quitar}</label>`;
    return `<div class="search" data-a="buscar" role="button" tabindex="0" aria-label="${ph}">${lupa}${S.buscar ? `<b>${esc(S.buscar)}</b>` : ph + '…'}
        ${chip ? `<span style="margin-left:auto" class="clear" data-a="quitarEsp">${esc(chip)} ✕</span>` : ''}${S.buscar ? `<button class="clear" data-a="limpiar">Borrar</button>` : ''}</div>`;
}
// tipo de teclado nativo para cada campo
const NATIVO = { num: 'type="text" inputmode="numeric" autocomplete="off"', alpha: 'type="text" inputmode="text" autocapitalize="words" autocomplete="name"', email: 'type="email" inputmode="email" autocapitalize="off" autocomplete="email"' };
function campo(clave, label, tipo, ph) {
    const v = S[clave];
    if (!TECLADO_APP) return `<label class="field"><span>${label}</span><input class="field__input" data-k="${clave}" ${NATIVO[tipo]} enterkeyhint="next" placeholder="${ph.replace('Toque para escribir', 'Escriba')}" value="${esc(v)}"></label>`;
    return `<button class="field" data-a="campo" data-k="${clave}" data-t="${tipo}" data-l="${esc(label)}"><span>${label}</span><b class="${v ? '' : 'ph'}">${v ? esc(v) : ph}</b></button>`;
}

/* ---------- validación y botón principal de cada paso ---------- */
function principal() {
    switch (S.paso) {
        case 0: return null;
        case 1: case 2: case 3: return null;
        case 4: return { txt: 'Continuar', ok: !!fichaSel(), info: fichaSel() ? `Ficha <b>${S.ficha}</b> · ${fichaSel().hora}` : 'Toque una ficha libre' };
        case 5: return { txt: 'Continuar', ok: S.svc.size > 0, info: `${S.svc.size} servicio(s) · <b>${bs(total())}</b>` };
        case 6: return { txt: 'Continuar', ok: telValido() && (!!paciente() || S.nombre.trim().length > 2), info: telValido() ? '' : 'Ingrese los 8 dígitos de su celular' };
        case 7: return { txt: S.nit || S.razon.trim() ? 'Continuar' : 'Continuar sin datos', ok: true, info: '' };
        case 8: return { txt: 'Pagar con QR', ok: true, info: `Total <b>${bs(total())}</b>` };
        case 9: return { txt: S.pagando ? 'Verificando pago…' : 'Simular pago (demo)', ok: !S.pagando, info: 'En el sistema real, el pago se detecta solo' };
        case 10: return { txt: 'Finalizar', ok: true, info: '' };
    }
}

/* ---------- render ---------- */
let pasoPintado = -1;
function render() {
    const p = S.paso, nuevoPaso = p !== pasoPintado;
    pasoPintado = p;
    const screen = $('#screen'), scroll = screen.scrollTop;
    $('#step-title').textContent = PASOS[p];
    $('#step-sub').textContent = SUB[p];
    // para volver, se tocan los pasos ya completados de la barra de progreso
    const puedeVolver = p < 10 && !S.pagando;
    $('#steps').innerHTML = PASOS.slice(0, 10).map((t, i) => i < p && puedeVolver
        ? `<button type="button" class="step is-done" data-a="paso" data-v="${i}" aria-label="Volver a ${t}"><i></i><span>${t}</span></button>`
        : `<div class="step${i < p ? ' is-done' : ''}${i === p ? ' is-on' : ''}"${i === p ? ' aria-current="step"' : ''}><i></i><span>${t}</span></div>`).join('');
    // al actualizar dentro del mismo paso (una tecla, una ficha, un filtro) no se anima ni se mueve el scroll
    screen.classList.toggle('anim', nuevoPaso);
    screen.innerHTML = `<div class="screen__inner">${VISTAS[p]()}</div>`;
    screen.scrollTop = nuevoPaso ? 0 : scroll;
    $('#summary').hidden = p === 0 || p === 10;
    $('#kbtoggle').hidden = !PASOS_CON_TEXTO.includes(p);
    $('#kbtoggle').setAttribute('aria-pressed', TECLADO_APP);
    renderResumen();
    renderAcciones();
    if (p === 9 && nuevoPaso) iniciarTimerQR();
    if (p === 10 && nuevoPaso) finalizar();
}
function renderResumen() {
    const f = fichaSel(), m = med(), p = paciente();
    const fila = (icono, label, val, opt) => `<div class="sum__row${val ? ' is-set' : ''}${opt ? ' opt' : ''}"><i>${ico(icono)}</i><div><small>${label}</small><b class="${val ? '' : 'vacio'}">${val || 'Sin elegir'}</b></div></div>`;
    $('#summary').innerHTML = `<h3>Su reserva</h3><div class="sum__rows">
        ${fila('hosp', 'Especialidad', esc(espActual() || ''))}
        ${fila('medico', 'Médico', m ? esc(m[0]) : '')}
        ${fila('cal', 'Fecha y ficha', f ? `${DIAS[FECHAS[S.dia].getDay()]} ${FECHAS[S.dia].getDate()} · Ficha ${f.n} · ${f.hora}` : '')}
        ${fila('recibo', 'Servicios', S.svc.size ? [...S.svc].map((i) => servicios()[i][0]).join(', ') : '', true)}
        ${fila('user', 'Paciente', telValido() ? esc(p ? p.nombre : S.nombre || 'Nuevo paciente') : '', true)}</div>
        <div class="sum__total"><small>Total</small><b>${bs(total())}</b></div>`;
    $('#summary').classList.toggle('is-empty', !espActual());
}
function renderAcciones() {
    const p = S.paso, pr = principal();
    $('#actions').innerHTML = `${pr?.info ? `<span class="actions__info">${pr.info}</span>` : ''}
        ${pr ? `<button class="btn btn--primary" data-a="siguiente"${pr.ok ? '' : ' disabled'}>${pr.txt}<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>` : ''}`;
    $('#actions').hidden = !pr;
}

/* ---------- acciones ---------- */
const ir = (paso) => { S.paso = paso; S.buscar = ''; render(); };
const ACCIONES = {
    go: (t) => ir(+t.dataset.to),
    porMedico: () => { S.esp = null; S.viaEsp = false; ir(3); },
    espDirecta: (t) => { S.esp = t.dataset.v; S.viaEsp = true; ir(3); },
    esp: (t) => { S.esp = t.dataset.v; S.viaEsp = true; ir(3); },
    quitarEsp: () => { S.esp = null; S.viaEsp = false; render(); },
    med: (t) => {
        const nuevo = +t.dataset.v;
        if (nuevo !== S.med) { S.med = nuevo; S.ficha = null; S.svc = new Set([0]); }
        S.dia = Math.max(0, FECHAS.findIndex((f) => fichasDe(S.med, f).some((x) => !x.ocupada)));
        ir(4);
    },
    dia: (t) => { S.dia = +t.dataset.v; S.ficha = null; render(); },
    ficha: (t) => { S.ficha = +t.dataset.v; render(); setTimeout(() => $('#actions .btn--primary')?.focus({ preventScroll: true }), 50); },
    svc: (t) => { const i = +t.dataset.v; S.svc.has(i) ? S.svc.delete(i) : S.svc.add(i); render(); },
    tecla: (t) => {
        const k = t.dataset.v;
        if (k === 'C') S.tel = '';
        else if (k === '<') S.tel = S.tel.slice(0, -1);
        else if (S.tel.length < 8) S.tel += k;
        autocompletar(); render();
    },
    demoTel: (t) => { S.tel = t.dataset.v; S.nombre = ''; autocompletar(); render(); },
    whatsapp: () => { S.whatsapp = !S.whatsapp; render(); },
    buscar: () => teclado({ label: 'Buscar', tipo: 'alpha', valor: S.buscar, vivo: true, listo: (v) => { S.buscar = v; render(); } }),
    limpiar: () => { S.buscar = ''; render(); },
    campo: (t) => teclado({ label: t.dataset.l, tipo: t.dataset.t, valor: S[t.dataset.k], listo: (v) => { S[t.dataset.k] = v; render(); } }),
    aviso: (t) => toast(t.dataset.v),
    paso: (t) => ir(+t.dataset.v),
    atras: () => {
        if (S.paso === 3 && !S.viaEsp) return ir(1);
        if (S.paso === 9) return ir(8);
        ir(S.paso - 1);
    },
    siguiente: () => {
        if (S.paso === 9) return pagar();
        if (S.paso === 10) return volverAlInicio();
        ir(S.paso + 1);
    },
};
// datos de facturación del paciente registrado
function autocompletar() {
    const p = paciente();
    if (p) { S.nit ||= p.nit; S.razon ||= p.razon; S.correo ||= p.correo; }
}
document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    e.stopPropagation();
    ACCIONES[t.dataset.a]?.(t);
});
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-a]')) { e.preventDefault(); e.target.click(); }
});
$('#screen').addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('[data-buscar]')) {
        S.buscar = t.value;
        $('#lista').innerHTML = S.paso === 2 ? listaEsp() : listaMed();
    } else if (t.matches('[data-tel]')) {
        const v = t.value.replace(/\D/g, '').slice(0, 8);
        if (t.value !== v) t.value = v;
        if (v !== S.tel) { S.tel = v; autocompletar(); $('#tel-info').innerHTML = telInfo(); }
    } else if (t.matches('.field__input')) {
        S[t.dataset.k] = t.dataset.k === 'nit' ? t.value.replace(/\D/g, '') : t.value;
        if (t.dataset.k === 'nit' && t.value !== S.nit) t.value = S.nit;
    }
    renderResumen(); renderAcciones();
});
// Enter: pasa al siguiente campo o continúa si el paso está completo
$('#screen').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.matches('input')) return;
    e.preventDefault();
    const campos = $$('#screen input'), i = campos.indexOf(e.target);
    if (campos[i + 1]) return campos[i + 1].focus();
    e.target.blur();
    const btn = $('#actions .btn--primary');
    if (btn && !btn.disabled) btn.click();
});

/* ---------- botón flotante: teclado del dispositivo / teclado del tótem ---------- */
$('#kbtoggle').addEventListener('click', (e) => {
    e.stopPropagation();
    TECLADO_APP = !TECLADO_APP;
    try { localStorage.setItem('totem.tecladoApp', TECLADO_APP ? '1' : '0'); } catch { /* sin almacenamiento */ }
    if (document.activeElement?.matches('input')) document.activeElement.blur();
    render();
    toast(TECLADO_APP ? 'Teclado en pantalla activado' : 'Usando el teclado del dispositivo');
});

/* ---------- pago ---------- */
let qrT;
function iniciarTimerQR() {
    clearInterval(qrT);
    let s = 15 * 60;
    qrT = setInterval(() => {
        s--;
        const el = $('#qr-timer');
        if (!el) return clearInterval(qrT);
        el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        if (s <= 0) { clearInterval(qrT); toast('El código QR venció. Generamos uno nuevo.'); render(); }
    }, 1000);
}
function pagar() {
    S.pagando = true; renderAcciones();
    $$('button.step').forEach((b) => { b.disabled = true; });
    const li = $$('#pay-steps li'), paso = reduced ? 0 : 900;
    [1, 2, 3].forEach((i, k) => setTimeout(() => {
        li[i].className = 'done';
        if (li[i + 1]) li[i + 1].className = 'now';
        if (i === 3) setTimeout(() => { clearInterval(qrT); S.pagando = false; S.pagado = true; ir(10); }, paso);
    }, paso * (k + 1)));
}

/* ---------- reserva completada: impresión y reinicio ---------- */
let finT;
function finalizar() {
    clearInterval(finT);
    setTimeout(() => { const p = $('#printing'); if (p) { p.textContent = 'Comprobante impreso. ¡Que tenga un buen día!'; p.classList.add('ok'); } }, reduced ? 0 : 3000);
    let s = 25;
    finT = setInterval(() => {
        s--;
        const el = $('#restart');
        if (!el) return clearInterval(finT);
        el.textContent = s;
        if (s <= 0) volverAlInicio();
    }, 1000);
}

/* ---------- código QR ilustrativo (vector, siempre el mismo) ---------- */
function qrSVG() {
    const N = 29, cells = [];
    let seed = 42 + (S.ficha || 0);
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
    const centro = (x, y) => x >= 11 && x <= 17 && y >= 11 && y <= 17;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && !centro(x, y) && rnd() < 0.5) cells.push(`M${x} ${y}h1v1h-1z`);
    const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#12263a"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#12263a"/>`;
    return `<svg viewBox="-2 -2 ${N + 4} ${N + 4}" role="img" aria-label="Código QR de pago (ilustrativo)" shape-rendering="crispEdges">
        <rect x="-2" y="-2" width="${N + 4}" height="${N + 4}" fill="#fff"/><path d="${cells.join('')}" fill="#12263a"/>${f(0, 0)}${f(N - 7, 0)}${f(0, N - 7)}
        <rect x="11.5" y="11.5" width="6" height="6" rx="1" fill="#fff"/><image href="https://medicalcenter.bo/wp-content/uploads/2021/05/cropped-logo-32x32.png" x="12" y="12" width="5" height="5"/></svg>`;
}

/* =========================================================
   TECLADO EN PANTALLA (numérico, alfabético y de correo)
   ========================================================= */
let KB = null;
function teclado({ label, tipo, valor, vivo = false, listo }) {
    KB = { tipo, valor: valor || '', vivo, listo, original: valor || '' };
    $('#kb-label').textContent = label;
    const filas = tipo === 'num'
        ? [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['⌫', '0', 'Listo']]
        : [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
            tipo === 'email' ? ['@', '.', '_', '-', 'Espacio', 'Listo'] : ['Espacio', 'Listo']];
    $('#kb').classList.toggle('kb--num', tipo === 'num');
    $('#kb-keys').innerHTML = filas.map((r) => `<div class="kb__row">${r.map((k) => {
        const cls = k === 'Listo' ? 'w2 ok' : k === 'Espacio' ? 'w5' : k === '⌫' ? 'w2 fn' : '';
        return `<button type="button" class="${cls}" data-k="${k}">${k}</button>`;
    }).join('')}</div>`).join('');
    kbPintar();
    $('#kb').hidden = false;
}
function kbPintar() {
    const v = $('#kb-value');
    v.textContent = KB.valor;
    v.scrollLeft = v.scrollWidth;
}
function kbTecla(k) {
    if (!KB) return;
    if (k === 'Listo') return kbCerrar(true);
    if (k === '⌫') KB.valor = KB.valor.slice(0, -1);
    else if (k === 'Espacio') { if (KB.tipo !== 'num' && KB.tipo !== 'email') KB.valor += ' '; }
    else if (KB.tipo === 'num') { if (KB.valor.length < 12) KB.valor += k; }
    else if (KB.tipo === 'email') KB.valor += k.toLowerCase();
    else {
        // mayúscula al inicio de cada palabra
        const inicio = !KB.valor || KB.valor.endsWith(' ');
        if (KB.valor.length < 40) KB.valor += inicio ? k : k.toLowerCase();
    }
    kbPintar();
    if (KB.vivo) KB.listo(KB.valor);
}
function kbCerrar(aceptar) {
    if (!KB) return;
    const k = KB; KB = null;
    $('#kb').hidden = true;
    k.listo(aceptar ? k.valor.trim() : k.original);
}
$('#kb-keys').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) kbTecla(b.dataset.k); });
$('#kb').addEventListener('click', (e) => { if (e.target.id === 'kb') kbCerrar(true); });
// teclado físico, útil al probar en una computadora
document.addEventListener('keydown', (e) => {
    if (KB) {
        if (e.key === 'Enter') return kbCerrar(true);
        if (e.key === 'Escape') return kbCerrar(false);
        if (e.key === 'Backspace') return kbTecla('⌫');
        if (e.key === ' ') return kbTecla('Espacio');
        if (/^[0-9a-zA-ZñÑ@._-]$/.test(e.key)) return kbTecla(e.key.toUpperCase() === e.key && KB.tipo === 'email' ? e.key : e.key.toUpperCase());
        return;
    }
    if (S.paso === 6 && TECLADO_APP && !$('#kiosk').hidden) {
        if (/^\d$/.test(e.key)) ACCIONES.tecla({ dataset: { v: e.key } });
        if (e.key === 'Backspace') ACCIONES.tecla({ dataset: { v: '<' } });
    }
});

/* =========================================================
   PANTALLA DE ESPERA, INACTIVIDAD, RELOJ Y PANTALLA COMPLETA
   ========================================================= */
const MENSAJES = ['Sin registrarse y sin hacer fila', 'Elija especialidad, médico, fecha y ficha', 'Pague con QR desde la app de su banco', 'Reciba su factura y su confirmación por WhatsApp'];
let rotI = 0, rotT;
function rotar() {
    const el = $('#idle-rot');
    el.classList.add('out');
    setTimeout(() => { el.textContent = MENSAJES[rotI++ % MENSAJES.length]; el.classList.remove('out'); }, 400);
}
function mostrarEspera() {
    $('#idle').hidden = false; $('#kiosk').hidden = true;
    document.body.classList.add('is-idle');
    rotar(); clearInterval(rotT); rotT = setInterval(rotar, 3500);
}
function comenzar() {
    if (/kiosk/.test(location.search)) pantallaCompleta();
    $('#idle').hidden = true; $('#kiosk').hidden = false;
    document.body.classList.remove('is-idle');
    clearInterval(rotT);
    S = NUEVA(); render(); actividad();
}
function volverAlInicio() {
    clearInterval(qrT); clearInterval(finT); clearInterval(modalT); clearTimeout(inactT);
    $('#idle-modal').hidden = true; if (KB) kbCerrar(false);
    S = NUEVA(); pasoPintado = -1;
    mostrarEspera();
}
$('#idle').addEventListener('click', comenzar);
$('#btn-home').addEventListener('click', () => (S.paso > 0 ? preguntarSalir() : volverAlInicio()));

// inactividad: aviso a los 60 s (120 s mientras paga) y reinicio 15 s después
let inactT, modalT;
function actividad() {
    clearTimeout(inactT);
    if (!$('#kiosk').hidden && S.paso !== 10 && $('#idle-modal').hidden) inactT = setTimeout(avisoInactividad, S.paso === 9 ? 120000 : 60000);
}
function avisoInactividad(titulo = '¿Necesita más tiempo?') {
    if (KB) kbCerrar(true);
    $('#im-title').textContent = titulo;
    $('#idle-modal').hidden = false;
    let s = 15;
    const pintar = () => { $('#im-count').textContent = s; $('#im-count').style.setProperty('--p', s / 15); };
    pintar(); clearInterval(modalT);
    modalT = setInterval(() => { s--; pintar(); if (s <= 0) volverAlInicio(); }, 1000);
}
function preguntarSalir() { clearTimeout(inactT); avisoInactividad('¿Desea cancelar su reserva?'); }
$('#im-stay').addEventListener('click', () => { clearInterval(modalT); $('#idle-modal').hidden = true; actividad(); });
$('#im-exit').addEventListener('click', volverAlInicio);
['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, actividad, { passive: true }));

let toastT;
function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
}

function reloj() {
    const d = new Date();
    $('#clock').textContent = d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
    $('#date').textContent = `${DIAS_L[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
    $('#idle-clock').textContent = d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}
reloj(); setInterval(reloj, 15000);

function pantallaCompleta() {
    const el = document.documentElement;
    if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el).catch?.(() => {});
}
$('#btn-fs').addEventListener('click', (e) => { e.stopPropagation(); pantallaCompleta(); });
document.addEventListener('fullscreenchange', () => document.body.classList.toggle('is-fullscreen', !!document.fullscreenElement));
// evita el menú contextual por pulsación larga en pantallas táctiles
addEventListener('contextmenu', (e) => e.preventDefault());

// onda de luz en el punto exacto donde se toca una tarjeta o botón
const TOCABLES = '.btn, .tile, .doc:not(.doc--head), .big, .quick button, .day, .ficha, .svc, .field, .toggle, .top__home';
addEventListener('pointerdown', (e) => {
    const el = e.target.closest(TOCABLES);
    if (!el || el.disabled || reduced) return;
    const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
    const o = document.createElement('span');
    o.className = 'onda';
    o.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    el.appendChild(o);
    setTimeout(() => o.remove(), 650);
}, { passive: true });

mostrarEspera();
