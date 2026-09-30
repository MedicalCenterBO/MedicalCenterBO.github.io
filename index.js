/* =========================================================
   Propuesta MedicalCenter · Portal de Autogestión + Bots WhatsApp
   Todos los datos editables de la propuesta están en PROPUESTA.
   ========================================================= */

const PROPUESTA = {
    numero: 'MC-PAW-2026-001',
    fecha: '29 de septiembre de 2026',
    validez: '30 días calendario',
    proveedor: 'Servisofts S.R.L.',
    contacto: '',
    meses: 8,
    garantiaMeses: 6,
    // Bolivia: precios con factura incluyen IVA (13 %) e IT (3 %)
    iva: 0.13,
    it: 0.03,

    alcance: [
        ['Relevamiento', 'Procesos, reglas de negocio y requisitos con cada área.'],
        ['Diseño funcional y UX', 'Flujos, prototipos navegables y sistema de diseño.'],
        ['Frontend', 'Portales de pacientes, médicos y administración, 100 % responsive.'],
        ['Backend', 'Autenticación, permisos, agendas, pagos, facturación, auditoría y errores.'],
        ['Integraciones', 'Medicaltec, Radoffice, Interlab, SBA, banco/pasarela y WhatsApp.'],
        ['Bots WhatsApp', 'Flujos conversacionales y notificaciones sobre la cuenta de MedicalCenter.'],
        ['Instalación', 'Instalación y configuración del entorno de producción en Ubuntu.'],
        ['Puesta en producción', 'Salida controlada y acompañamiento inicial.'],
        ['Documentación y capacitación', 'Manuales en español y capacitación al personal de TI.'],
        ['Código fuente y garantía', 'Repositorio en el GIT de MedicalCenter y soporte post-aceptación.'],
    ],

    stack: [
        ['Frontend', 'React + Next.js · TypeScript · PWA', 'MIT'],
        ['Backend / API', 'Java 21 + Spring Boot  ó  Python 3.12 + FastAPI', 'Apache 2.0 / MIT'],
        ['Reintentos e idempotencia', 'Implementados en la aplicación, sin colas externas', 'Código propio'],
        ['Base de datos propia', 'PostgreSQL 16', 'PostgreSQL'],
        ['Servidor web', 'Nginx + Let\'s Encrypt', 'BSD-2 / Apache 2.0'],
        ['Bots WhatsApp', 'WhatsApp Business Cloud API (oficial de Meta)', 'Servicio de Meta'],
    ],

    integraciones: {
        'Medicaltec': { rol: 'Fuente principal de pacientes, agendas y ventas',
            ops: ['Búsqueda y vinculación de pacientes sin duplicados', 'Especialidades, médicos, sedes, servicios y tarifas', 'Agendas, cupos, bloqueos y disponibilidad', 'Reserva, reprogramación, confirmación y cancelación', 'Registro de ventas y transacciones pagadas', 'Órdenes de laboratorio (puente hacia Interlab)'] },
        'Radoffice': { rol: 'Resultados de imagenología',
            ops: ['Listado de estudios validados del paciente', 'Visualización y descarga de informes', 'Acceso a imágenes por visor o enlace seguro temporal', 'Verificación de que el paciente es el titular del estudio'] },
        'Interlab': { rol: 'Resultados de laboratorio a través de Medicaltec',
            ops: ['Órdenes y resultados disponibles', 'Visualización y descarga de informes', 'Fechas, exámenes y estados', 'Solo resultados validados y autorizados'] },
        'SBA': { rol: 'Facturación electrónica',
            ops: ['Captura y validación de NIT/CI y razón social', 'Emisión solo con el pago confirmado', 'Facturas de las empresas de Medical y de los médicos', 'Vínculo factura–paciente–pago–servicio y regularización'] },
        'Banco / Pasarela': { rol: 'Cobros con QR y tarjeta (opcional)',
            ops: ['QR por transacción con vencimiento', 'Confirmación por webhook autenticado y consulta de respaldo', 'Estados pendiente, confirmado, rechazado y vencido', 'Conciliación y reporte de diferencias'] },
        'WhatsApp': { rol: 'Bots y notificaciones',
            ops: ['Consulta de disponibilidad y gestión de citas', 'Confirmaciones, recordatorios y avisos de cambios', 'Avisos de resultados, pagos y facturas', 'Validación de identidad y enlaces seguros al portal'] },
    },

    // [fase, quincena inicio, quincena fin] — 2 quincenas por mes
    gantt: [
        ['Relevamiento y diseño funcional / UX', 1, 3],
        ['Arquitectura e instalación base', 3, 4],
        ['Integración Medicaltec', 4, 9],
        ['Portal de pacientes', 5, 11],
        ['Portal de médicos y administración', 7, 12],
        ['Radoffice e Interlab', 8, 10],
        ['Pagos QR y facturación SBA', 9, 12],
        ['Bots de WhatsApp', 9, 13],
        ['Ajustes y validación con MedicalCenter', 12, 14],
        ['Puesta en producción', 14, 15],
        ['Capacitación TI y acompañamiento', 15, 16],
    ],

    equipo: [
        ['Jefe de proyecto / Analista', 'Relevamiento, planificación y coordinación con MedicalCenter y terceros.'],
        ['Arquitecto de software', 'Arquitectura, integraciones críticas y calidad técnica.'],
        ['2 Desarrolladores backend', 'API, conectores, pagos, facturación y bots.'],
        ['Desarrollador frontend', 'Portales web responsive y PWA.'],
        ['Diseñador UX/UI', 'Prototipos, sistema de diseño y accesibilidad.'],
        ['Ingeniero DevOps', 'Instalación en Ubuntu y configuración del servidor.'],
    ],

    capacitacion: [
        ['Instalación, despliegue y recuperación', 8],
        ['Arquitectura, código fuente e integraciones', 8],
        ['Administración funcional del portal', 4],
        ['Bots de WhatsApp, pagos y facturación', 4],
        ['Seguridad y mantenimiento', 2],
    ],

    sla: [
        ['Crítica', 'Portal caído, pagos o citas no se registran', '1 hora · 24/7', 'Contingencia en 4 h, solución en 24 h'],
        ['Alta', 'Una función principal falla para varios usuarios', '4 horas', '2 días hábiles'],
        ['Media', 'Falla con alternativa de uso', '1 día hábil', '5 días hábiles'],
        ['Baja', 'Consultas y ajustes menores de textos', '2 días hábiles', 'Siguiente versión planificada'],
    ],

    cumplimiento: [
        ['1', 'Portal llave en mano, HTML5, responsive, sobre Ubuntu', 'ok', 'Cumple.'],
        ['2', 'Responsabilidad integral del proveedor', 'ok', 'TI de MedicalCenter solo aporta conocimiento y accesos.'],
        ['3.1', 'Registro, identidad, roles y recuperación de acceso', 'ok', 'Validación con CI y código por WhatsApp/correo contra datos de Medicaltec.'],
        ['3.2', 'Autogestión de citas', 'dep', 'Depende de que Medicaltec exponga servicios de reserva y cancelación; si no existen, se coordinan con su proveedor.'],
        ['3.3', 'Agendas médicas sin sobreasignación', 'ok', 'Reserva temporal del cupo y confirmación en Medicaltec.'],
        ['3.4', 'Módulo administrativo', 'ok', 'Cumple.'],
        ['4', 'Integración con Medicaltec por servicios autorizados', 'dep', 'Sin escritura directa en la base de datos. Se entrega la matriz de operaciones.'],
        ['5', 'Integración con Radoffice', 'dep', 'El visor de imágenes depende de la capacidad de Radoffice; hay un visor propio opcional.'],
        ['6', 'Integración con Interlab a través de Medicaltec', 'dep', 'Depende de la disponibilidad de resultados vía Medicaltec.'],
        ['7', 'Bots de WhatsApp', 'dep', 'Sobre la cuenta de WhatsApp Business de MedicalCenter; plantillas sujetas a aprobación de Meta.'],
        ['8', 'Pagos mediante QR', 'dep', 'Requiere convenio y API del banco o pasarela que elija MedicalCenter.'],
        ['9', 'Facturación electrónica con SBA', 'dep', 'Depende de los servicios de emisión de SBA. Solo se factura con el pago confirmado.'],
        ['10', 'Interfaz HTML5, responsive y accesible', 'ok', 'Matriz de compatibilidad aprobada antes del desarrollo.'],
        ['11', 'Infraestructura e instalación en Ubuntu', 'dep', 'Según el datacenter de MedicalCenter. El monitoreo y los respaldos usan las herramientas existentes de MedicalCenter.'],
        ['12', 'Seguridad del servidor, la aplicación y la red', 'ok', 'Configuración de seguridad documentada.'],
        ['13', 'Código fuente y derechos de mantenimiento', 'ok', 'Cesión de derechos sobre lo desarrollado; repositorio en el GIT de MedicalCenter.'],
        ['14', 'Documentación y capacitación', 'dep', 'Documentación completa en español; la capacitación se dirige al personal de TI.'],
        ['15', 'Criterios de aceptación (1 a 15)', 'ok', 'Se verifican uno a uno con acta firmada.'],
        ['16', 'Garantía y soporte', 'ok', '6 meses de garantía y planes posteriores opcionales.'],
    ],

    supuestos: [
        'MedicalCenter provee servidores, dominio, IP pública y accesos VPN/SSH en un plazo máximo de 10 días hábiles desde la firma.',
        'Medicaltec, Radoffice y SBA disponen de servicios web, o su proveedor puede habilitarlos, para las operaciones requeridas.',
        'La oferta incluye la coordinación con esos proveedores y una partida para adecuar interfaces. Si un proveedor cotiza un monto mayor, se declara antes de ejecutar.',
        'MedicalCenter provee la cuenta de WhatsApp Business verificada en Meta Business Manager.',
        'MedicalCenter gestiona el convenio con el banco o la pasarela de pagos y habilita sus credenciales.',
        'Un referente funcional por área valida los entregables en un máximo de 3 días hábiles.',
    ],

    exclusiones: [
        'Costos, licencias o comisiones de terceros (Meta, banco/pasarela), que se pagan directamente al proveedor del servicio.',
        'Hardware, servidores y licencias de sistema operativo.',
        'Monitoreo, observabilidad y respaldos, que se realizan con la infraestructura del datacenter de MedicalCenter.',
        'Capacitación a usuarios finales (médicos, recepción, caja); el personal de TI capacitado la replica.',
        'Cambios internos a Medicaltec, Radoffice, Interlab o SBA más allá de la partida de adecuaciones.',
        'Aplicaciones nativas en tiendas; el portal funciona como PWA.',
        'Funcionalidades fuera del alcance aprobado, que se cotizan por horas.',
    ],

    precios: [
        ['Relevamiento, diseño funcional, arquitectura y UX/UI', 12000],
        ['Portal de pacientes', 29000, 'Registro, identidad, citas, historial y perfil'],
        ['Portal de médicos', 15000, 'Agenda, bloqueos, cupos y estados'],
        ['Módulo administrativo', 18000, 'Roles, parámetros, transacciones, auditoría y conciliación'],
        ['Integración Medicaltec', 21000, 'Conectores, reintentos, concurrencia y matriz de operaciones'],
        ['Integración Radoffice', 8000, 'Estudios, informes y enlaces seguros'],
        ['Integración Interlab vía Medicaltec', 7000],
        ['Pagos QR', 14000, 'Banco/pasarela, estados y conciliación'],
        ['Facturación electrónica SBA', 10000],
        ['Bots de WhatsApp', 19000, 'Flujos de citas, notificaciones y validación'],
        ['Adecuaciones de interfaces con proveedores de terceros', 9000],
        ['Instalación y configuración en Ubuntu', 11000],
        ['Puesta en producción y acompañamiento inicial', 9000],
        ['Documentación, capacitación TI y entrega del código fuente', 5000],
    ],

    opcionales: [
        ['Pagos con tarjeta de crédito/débito', 'Integración con pasarela, 3-D Secure y conciliación.', 12000],
        ['Visor de imágenes médicas propio', 'Si Radoffice no dispone de visor (OHIF, código abierto).', 11000],
        ['Asistente con IA en WhatsApp', 'Respuestas en lenguaje natural sobre servicios, horarios y preparación de estudios.', 15000],
    ],

    hitos: [
        [30, 'Firma de contrato', 'Anticipo'],
        [20, 'Aprobación del diseño funcional y UX', 'Mes 2'],
        [20, 'Portales e integración Medicaltec en pruebas', 'Mes 5'],
        [20, 'Aceptación y puesta en producción', 'Mes 7'],
        [10, 'Cierre del acompañamiento', 'Mes 8'],
    ],

    planes: [
        { nombre: 'Esencial', precio: 2250, horas: 20, items: ['Actualizaciones de seguridad', 'Soporte en horario hábil', 'Críticos: respuesta en 4 h'] },
        { nombre: 'Profesional', precio: 3750, horas: 40, destacado: true, items: ['Todo lo del plan Esencial', 'Críticos 24/7: respuesta en 1 h', 'Informe mensual', 'Ajustes evolutivos menores'] },
        { nombre: 'Integral', precio: 6000, horas: 70, items: ['Todo lo del plan Profesional', 'Guardia técnica dedicada', 'Mejoras evolutivas planificadas'] },
    ],
    horaExtra: 140,

    terceros: [
        ['Mensajes de WhatsApp', 'Meta', 'Por mensaje de plantilla según la tarifa vigente de Meta; los mensajes de servicio dentro de 24 h no tienen costo.'],
        ['Cobro con QR', 'Banco elegido', 'Comisión por transacción según convenio (usualmente 0 %–1,5 %).'],
        ['Cobro con tarjeta (opcional)', 'Pasarela de pagos', 'Comisión por transacción según convenio (usualmente 3 %–4,5 %).'],
        ['Certificado SSL', 'Let\'s Encrypt', 'Sin costo, con renovación automática.'],
    ],
};

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const bs = (n) => 'Bs ' + n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const bs0 = (n) => 'Bs ' + Math.round(n).toLocaleString('es-BO');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const html = (sel, str) => { $(sel).innerHTML = str; };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const P = PROPUESTA;
const base = P.precios.reduce((a, r) => a + r[1], 0);

/* ---------- datos enlazados ---------- */
const binds = { numero: P.numero, fecha: P.fecha, validez: P.validez, proveedor: P.proveedor, contacto: P.contacto, meses: P.meses, garantia: P.garantiaMeses };
$$('[data-bind]').forEach((el) => { el.textContent = binds[el.dataset.bind]; });

/* ---------- contadores animados ---------- */
const counts = { total: base, meses: P.meses, garantia: P.garantiaMeses, codigo: 100 };
function countUp(el) {
    const target = counts[el.dataset.count], money = el.hasAttribute('data-money');
    const fmt = (v) => (money ? bs0(v) : Math.round(v));
    if (reduced) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(target * e);
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ---------- alcance ---------- */
html('#scope-grid', P.alcance.map(([t, d], i) =>
    `<div class="scope__item reveal" style="--d:${i * 40}ms"><span>${String(i + 1).padStart(2, '0')}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></div>`).join(''));

/* ---------- demo del portal ---------- */
const demo = {
    paciente: { path: '/inicio', user: 'María Rojas', role: 'Paciente', nav: ['Inicio', 'Mis citas', 'Resultados', 'Pagos y facturas', 'Mi perfil'] },
    medico: { path: '/agenda', user: 'Dr. R. Salvatierra', role: 'Neurología', nav: ['Agenda', 'Bloqueos', 'Pacientes del día', 'Mis facturas'] },
    admin: { path: '/admin/transacciones', user: 'Admin. Portal', role: 'Administrador', nav: ['Transacciones', 'Usuarios y roles', 'Parámetros', 'Conciliación', 'Auditoría'] },
    pago: { path: '/pagos/MC-2026-004812', user: 'María Rojas', role: 'Paciente', nav: ['Inicio', 'Mis citas', 'Resultados', 'Pagos y facturas', 'Mi perfil'], active: 3 },
};
const tabs = $$('.demo__tabs [role=tab]');
function showTab(key) {
    const d = demo[key];
    tabs.forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === key));
    $$('.panel').forEach((p) => p.classList.toggle('is-on', p.dataset.panel === key));
    $('#demo-path').textContent = d.path;
    $('#demo-user').textContent = d.user;
    $('#demo-role').textContent = d.role;
    $('.app__user i').textContent = d.user.replace(/^(Dr\.|Admin\.)\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    html('#demo-nav', d.nav.map((n, i) => `<a class="${i === (d.active || 0) ? 'on' : ''}">${n}</a>`).join(''));
    moveInk();
}
function moveInk() {
    const on = tabs.find((t) => t.getAttribute('aria-selected') === 'true'), ink = $('.demo__ink');
    if (on) { ink.style.width = on.offsetWidth + 'px'; ink.style.transform = `translateX(${on.offsetLeft}px)`; }
}
tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
$('.demo__tabs').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (n) { const t = tabs[(i + n + tabs.length) % tabs.length]; t.focus(); showTab(t.dataset.tab); }
});
$$('[data-goto]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.goto)));
addEventListener('resize', moveInk);
showTab('paciente');

// pago simulado
let qrSecs = 899;
setInterval(() => {
    qrSecs = qrSecs > 0 ? qrSecs - 1 : 899;
    $('#qr-timer').textContent = `${Math.floor(qrSecs / 60)}:${String(qrSecs % 60).padStart(2, '0')}`;
}, 1000);
$('#pay-sim').addEventListener('click', (e) => {
    const steps = $$('#pay-steps li'), btn = e.currentTarget;
    btn.disabled = true;
    steps.forEach((s, i) => { s.className = i === 0 ? 'done' : ''; });
    steps[1].className = 'now';
    [1, 2, 3].forEach((i, k) => setTimeout(() => {
        steps[i].className = 'done';
        if (steps[i + 1]) steps[i + 1].className = 'now';
        if (i === 3) { btn.textContent = 'Reiniciar'; btn.disabled = false; btn.onclick = () => { steps.forEach((s, j) => { s.className = j === 0 ? 'done' : j === 1 ? 'now' : ''; }); btn.textContent = 'Simular pago'; btn.onclick = null; }; }
    }, 900 * (k + 1)));
});

/* ---------- arquitectura interactiva ---------- */
function showSys(name) {
    const s = P.integraciones[name];
    $$('.node--btn').forEach((b) => b.classList.toggle('is-on', b.dataset.sys === name));
    html('#sys-detail', `<div class="sysdetail__head"><h3>${esc(name)}</h3><p>${esc(s.rol)}</p></div>
        <ul>${s.ops.map((o, i) => `<li style="--d:${i * 60}ms">${esc(o)}</li>`).join('')}</ul>`);
}
$$('.node--btn').forEach((b) => b.addEventListener('click', () => showSys(b.dataset.sys)));
showSys('Medicaltec');

html('#stack', P.stack.map(([a, b, c], i) =>
    `<div class="stack__item reveal" style="--d:${i * 50}ms"><small>${esc(a)}</small><b>${esc(b)}</b><span>${esc(c)}</span></div>`).join(''));

/* ---------- cronograma ---------- */
const Q = P.meses * 2;
html('#gantt',
    `<div class="gantt__scale" style="--q:${Q}"><span></span>${Array.from({ length: P.meses }, (_, i) => `<span>Mes ${i + 1}</span>`).join('')}</div>` +
    P.gantt.map(([t, a, b], i) =>
        `<div class="gantt__row"><p>${esc(t)}</p><div class="gantt__track" style="--q:${Q}">
         <i style="grid-column:${a} / ${b + 1};--d:${i * 70}ms" data-tip="Mes ${Math.ceil(a / 2)} – Mes ${Math.ceil(b / 2)}"></i></div></div>`).join(''));

html('#team', P.equipo.map(([r, d], i) =>
    `<div class="team__item reveal" style="--d:${i * 50}ms"><span class="avatar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0"/></svg></span><div><h4>${esc(r)}</h4><p>${esc(d)}</p></div></div>`).join(''));

/* ---------- capacitación ---------- */
const hmax = Math.max(...P.capacitacion.map((c) => c[1]));
const htot = P.capacitacion.reduce((a, c) => a + c[1], 0);
html('#training', P.capacitacion.map(([t, h]) =>
    `<div class="tr"><div class="tr__top"><span>${esc(t)}</span><b>${h} h</b></div><div class="tr__bar"><i style="--w:${(h / hmax) * 100}%"></i></div></div>`).join('') +
    `<div class="tr tr--sum"><span>Total</span><b>${htot} horas</b></div>`);

/* ---------- SLA ---------- */
html('#sla', P.sla.map(([a, b, c, d], i) =>
    `<article class="sla__item sla--${i} reveal" style="--d:${i * 60}ms"><span class="sla__sev">${esc(a)}</span><p>${esc(b)}</p>
     <dl><div><dt>Respuesta</dt><dd>${esc(c)}</dd></div><div><dt>Solución</dt><dd>${esc(d)}</dd></div></dl></article>`).join(''));

/* ---------- cumplimiento con filtro ---------- */
html('#compliance', P.cumplimiento.map(([n, r, s, o]) =>
    `<div class="comp__row" data-s="${s}"><span class="comp__n">${esc(n)}</span><b>${esc(r)}</b>
     <span class="pill ${s === 'ok' ? 'pill--ok' : 'pill--wait'}">${s === 'ok' ? 'Cumple' : 'Con dependencia'}</span><p>${esc(o)}</p></div>`).join(''));
$('#c-all').textContent = P.cumplimiento.length;
$('#c-ok').textContent = P.cumplimiento.filter((c) => c[2] === 'ok').length;
$('#c-dep').textContent = P.cumplimiento.filter((c) => c[2] === 'dep').length;
$$('.chip').forEach((c) => c.addEventListener('click', () => {
    $$('.chip').forEach((x) => x.classList.toggle('is-on', x === c));
    $$('.comp__row').forEach((r) => { r.hidden = c.dataset.filter !== 'all' && r.dataset.s !== c.dataset.filter; });
}));

html('#assumptions', P.supuestos.map((t) => `<li>${esc(t)}</li>`).join(''));
html('#exclusions', P.exclusiones.map((t) => `<li>${esc(t)}</li>`).join(''));

/* ---------- propuesta económica interactiva ---------- */
const pmax = Math.max(...P.precios.map((p) => p[1]));
html('#price-lines', P.precios.map(([t, v, d], i) =>
    `<div class="line"><span class="line__n">${String(i + 1).padStart(2, '0')}</span>
     <div class="line__txt"><b>${esc(t)}</b>${d ? `<small>${esc(d)}</small>` : ''}<i class="line__bar" style="--w:${(v / pmax) * 100}%"></i></div>
     <span class="line__v">${bs0(v)}</span></div>`).join(''));

html('#optionals', P.opcionales.map(([t, d, v], i) =>
    `<label class="opt"><input type="checkbox" data-opt="${i}"><span class="switch" aria-hidden="true"></span>
     <div><b>${esc(t)}</b><small>${esc(d)}</small></div><span class="opt__v">+ ${bs0(v)}</span></label>`).join(''));

let shown = base;
function animateTo(el, from, to) {
    if (reduced) { el.textContent = bs(to); return; }
    const t0 = performance.now();
    const step = (t) => {
        const k = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - k, 3);
        el.textContent = bs(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
function recalc() {
    const sel = $$('[data-opt]').filter((c) => c.checked).map((c) => P.opcionales[c.dataset.opt]);
    const total = base + sel.reduce((a, o) => a + o[2], 0);
    animateTo($('#sum-total'), shown, total); shown = total;
    $('#sum-note').textContent = sel.length ? `Base ${bs0(base)} + ${sel.length} opcional${sel.length > 1 ? 'es' : ''}` : 'Alcance base llave en mano';
    const iva = total * P.iva, it = total * P.it;
    $('#t-net').textContent = bs(total - iva - it);
    $('#t-iva').textContent = bs(iva);
    $('#t-it').textContent = bs(it);
    html('#milestones', P.hitos.map(([pct, t, w]) =>
        `<div class="ms__item"><div class="ms__pct" style="--p:${pct}">${pct}%</div><div><b>${esc(t)}</b><small>${esc(w)} · ${bs0(total * pct / 100)}</small></div></div>`).join(''));
}
$$('[data-opt]').forEach((c) => c.addEventListener('change', recalc));
$('#sum-total').textContent = bs(base);
recalc();

html('#plans', P.planes.map((p, i) =>
    `<article class="plan${p.destacado ? ' plan--hi' : ''} reveal" style="--d:${i * 80}ms">${p.destacado ? '<span class="plan__badge">Recomendado</span>' : ''}
     <h4>${esc(p.nombre)}</h4><p class="plan__price">${bs0(p.precio)}<small> /mes</small></p>
     <p class="plan__hours">${p.horas} horas de soporte o desarrollo</p>
     <ul>${p.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join(''));
$('#extra-hour').textContent = `Hora de desarrollo adicional: ${bs0(P.horaExtra)}, impuestos incluidos. Contratos de soporte con vigencia mínima de 6 meses y precios fijos durante los primeros 12 meses.`;

html('#third', P.terceros.map(([a, b, c]) =>
    `<div class="third__item"><b>${esc(a)}</b><span class="tag">${esc(b)}</span><p>${esc(c)}</p></div>`).join(''));

/* ---------- chat animado de WhatsApp ---------- */
const chat = [
    ['in', 'Hola María 👋 Te recordamos tu cita de <b>Neurología</b> mañana a las <b>09:30</b>.'],
    ['btns', '<span>✅ Confirmar</span><span>🔁 Reprogramar</span>'],
    ['out', 'Confirmar'],
    ['in', '¡Listo! Tu cita quedó <b>confirmada</b> en el sistema.'],
    ['in', '🧪 Tu resultado de <b>Hemograma</b> ya está disponible.<br><u>Ver en el portal seguro</u>'],
    ['out', 'Gracias 🙌'],
];
async function playChat() {
    const box = $('#wa-chat'), status = $('#wa-status');
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    if (reduced) { box.innerHTML = chat.map(([c, t]) => `<p class="${c}">${t}</p>`).join(''); return; }
    for (;;) {
        box.innerHTML = '';
        for (const [cls, txt] of chat) {
            if (cls === 'in') {
                status.textContent = 'escribiendo…';
                const typing = document.createElement('p');
                typing.className = 'in typing'; typing.innerHTML = '<i></i><i></i><i></i>';
                box.appendChild(typing);
                await wait(1100);
                typing.remove();
                status.textContent = 'en línea';
            } else await wait(cls === 'out' ? 900 : 300);
            const p = document.createElement('p');
            p.className = cls; p.innerHTML = txt;
            box.appendChild(p);
            box.scrollTop = box.scrollHeight;
        }
        await wait(4500);
    }
}
playChat();

/* ---------- apariciones al hacer scroll ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll?.('[data-count]').forEach(countUp);
    io.unobserve(e.target);
}), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal, .gantt, .training, .lines').forEach((el) => io.observe(el));

/* ---------- progreso y barra superior ---------- */
addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#progress').style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight)})`;
    $('#topbar').classList.toggle('is-solid', h.scrollTop > 40);
}, { passive: true });

addEventListener('beforeprint', () => {
    $$('.reveal').forEach((el) => el.classList.add('in'));
    $$('[data-count]').forEach((el) => { const v = counts[el.dataset.count]; el.textContent = el.hasAttribute('data-money') ? bs0(v) : v; });
});
