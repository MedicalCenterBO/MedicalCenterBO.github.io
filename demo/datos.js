/* =========================================================
   Demo · datos compartidos — Clínica MedicalCenter
   Catálogo de médicos y servicios, fechas, reloj de la demo y la base de
   citas ficticia (localStorage) que usan el flujo del paciente y el panel.
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bs = (n) => 'Bs ' + n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- fechas y horas ---------- */
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DIAS_L = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const pad = (n) => String(n).padStart(2, '0');
const dkey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return dkey(d); };
const dow = (k) => parse(k).getDay();
const monday = (k) => addDays(k, -((dow(k) + 6) % 7));
const fmtDay = (k) => { const d = parse(k); return `${DIAS[d.getDay()]} ${pad(d.getDate())} ${MESES[d.getMonth()]}`; };
const fmtLong = (k) => { const d = parse(k); return `${DIAS_L[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
const hm = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

// "Hoy" de la demo: si es domingo se usa el lunes. Fuera del horario de atención
// se simula un reloj desde las 10:30 para que la sala de espera tenga movimiento.
const REAL = new Date();
let TODAY = dkey(REAL);
if (dow(TODAY) === 0) TODAY = addDays(TODAY, 1);
const realMin = REAL.getHours() * 60 + REAL.getMinutes();
const SIMULADO = TODAY !== dkey(REAL) || realMin < 8 * 60 || realMin > 19 * 60;
const CLOCK0 = SIMULADO ? 10 * 60 + 30 : realMin;
const LOADED = Date.now();
const nowMin = () => Math.min(CLOCK0 + Math.floor((Date.now() - LOADED) / 60000), 23 * 60 + 59);
const stamp = () => `${fmtDay(TODAY)} · ${hm(nowMin())}`;

/* ---------- catálogo ---------- */
const MEDICOS = [
    { id: 'sal', n: 'Dr. Ricardo Salvatierra', esp: 'Neurología', c: '#6d5bd0', cons: '204', dur: 30, hor: { 1: ['08:00', '12:00'], 2: ['15:00', '18:00'], 3: ['08:00', '12:00'], 5: ['08:00', '12:00'] } },
    { id: 'men', n: 'Dra. Carla Méndez', esp: 'Pediatría', c: '#d9732f', cons: '105', dur: 30, hor: { 1: ['08:00', '13:00'], 2: ['08:00', '13:00'], 3: ['08:00', '13:00'], 4: ['08:00', '13:00'], 5: ['08:00', '13:00'], 6: ['08:00', '12:00'] } },
    { id: 'ane', n: 'Dr. Jorge Áñez', esp: 'Medicina general', c: '#2f80c9', cons: '101', dur: 20, hor: { 1: ['08:00', '16:00'], 2: ['08:00', '16:00'], 3: ['08:00', '16:00'], 4: ['08:00', '16:00'], 5: ['08:00', '16:00'] } },
    { id: 'art', n: 'Dra. Lucía Arteaga', esp: 'Ginecología', c: '#c2478f', cons: '302', dur: 30, hor: { 2: ['09:00', '13:00'], 3: ['15:00', '19:00'], 4: ['09:00', '13:00'], 6: ['08:00', '11:00'] } },
    { id: 'riv', n: 'Dr. Marcelo Rivero', esp: 'Cardiología', c: '#d14343', cons: '210', dur: 30, hor: { 1: ['15:00', '19:00'], 2: ['15:00', '19:00'], 3: ['15:00', '19:00'], 4: ['15:00', '19:00'], 5: ['15:00', '19:00'] } },
    { id: 'jus', n: 'Dra. Paola Justiniano', esp: 'Traumatología', c: '#13897c', cons: '108', dur: 30, hor: { 1: ['10:00', '14:00'], 2: ['10:00', '14:00'], 3: ['10:00', '14:00'], 4: ['10:00', '14:00'], 6: ['09:00', '12:00'] } },
];
const MED = Object.fromEntries(MEDICOS.map((m) => [m.id, m]));
const ESPECIALIDADES = [...new Set(MEDICOS.map((m) => m.esp))];
const SERVICIOS = {
    'Neurología': [['Consulta de neurología', 250], ['Electroencefalograma', 350], ['Electromiografía', 420]],
    'Pediatría': [['Consulta de pediatría', 200], ['Control del niño sano', 180], ['Vacunación', 120]],
    'Medicina general': [['Consulta general', 150], ['Certificado médico', 100]],
    'Ginecología': [['Consulta de ginecología', 250], ['Papanicolaou', 180], ['Ecografía obstétrica', 300]],
    'Cardiología': [['Consulta de cardiología', 300], ['Electrocardiograma', 200], ['Ecocardiograma', 450]],
    'Traumatología': [['Consulta de traumatología', 250], ['Infiltración', 350], ['Control post operatorio', 150]],
};
const ESTADOS = {
    reservada: ['Reservada', 'Pago QR pendiente'],
    confirmada: ['Confirmada', 'Pagada, por llegar'],
    espera: ['En espera', 'El paciente ya llegó'],
    consulta: ['En consulta', 'Con el médico'],
    atendida: ['Atendida', 'Consulta finalizada'],
    ausente: ['No asistió', 'No se presentó'],
    cancelada: ['Cancelada', 'Libera el horario'],
};
const ACTIVAS = ['reservada', 'confirmada', 'espera', 'consulta', 'atendida', 'ausente'];
const CANALES = { wa: 'WhatsApp', portal: 'Portal web', totem: 'Tótem', recepcion: 'Recepción', llamada: 'Llamada IA' };
const NOMBRES = ['María Rojas', 'Juan Pérez', 'Ana Suárez', 'Luis Vaca', 'Valeria Suárez', 'Jorge Rivero', 'Lucía Fernández', 'Marco Antelo', 'Sofía Pinto',
    'Rosa Gutiérrez', 'Diego Rojas', 'Roberto Vargas', 'Camila Ortiz', 'Fernando Chávez', 'Gabriela Mercado', 'Andrés Soliz', 'Patricia Aguilera', 'Daniel Cuéllar',
    'Natalia Saucedo', 'Mauricio Paz', 'Carolina Ribera', 'Héctor Montaño', 'Verónica Roca', 'Pablo Guzmán', 'Daniela Arias', 'Ricardo Peña', 'Lorena Égüez',
    'Álvaro Landívar', 'Silvia Moreno', 'Esteban Toledo', 'Mónica Zabala', 'Iván Céspedes', 'Paola Barba', 'Sergio Hurtado', 'Liliana Rocha', 'Óscar Melgar'];

/* ---------- datos (generados con semilla para que se repitan en el día) ---------- */
const KEY = 'mc-gestion-citas-v2';
let db;

function rngFrom(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}

function generate() {
    const r = rngFrom(TODAY);
    const pick = (a) => a[Math.floor(r() * a.length)];
    const pacs = NOMBRES.map((n, i) => ({ id: 'p' + i, cod: 'MC-' + (10200 + i * 13), n, tel: String(70000000 + Math.floor(r() * 9999999)).replace(/^7/, r() < .3 ? '6' : '7'), ci: String(4000000 + Math.floor(r() * 6000000)) }));
    const citas = [];
    let seq = 1000;
    const now = nowMin();
    const start = addDays(monday(TODAY), -7);
    for (let i = 0; i < 21; i++) {
        const k = addDays(start, i);
        for (const m of MEDICOS) {
            const h = m.hor[dow(k)];
            if (!h) continue;
            let enConsulta = false;
            for (let t = toMin(h[0]); t + m.dur <= toMin(h[1]); t += m.dur) {
                if (r() > .62) continue;
                const x = r();
                let estado, pago = true;
                const pasada = k < TODAY || (k === TODAY && t + m.dur <= now);
                const ahora = k === TODAY && t <= now && now < t + m.dur;
                if (pasada) estado = x < .82 ? 'atendida' : x < .9 ? 'ausente' : 'cancelada';
                else if (ahora && !enConsulta) { estado = 'consulta'; enConsulta = true; }
                else if (k === TODAY && t - now <= 40) estado = x < .85 ? 'espera' : 'confirmada';
                else estado = x < .72 ? 'confirmada' : x < .93 ? 'reservada' : 'cancelada';
                if (estado === 'reservada' || (estado === 'cancelada' && x > .5) || (estado === 'ausente' && x > .86)) pago = false;
                const canal = (() => { const y = r(); return y < .45 ? 'wa' : y < .65 ? 'portal' : y < .75 ? 'totem' : y < .9 ? 'recepcion' : 'llamada'; })();
                const svcs = SERVICIOS[m.esp];
                const svc = r() < .7 ? 0 : Math.floor(r() * svcs.length);
                const creada = addDays(k, -1 - Math.floor(r() * 6));
                const c = { id: 'C-' + (++seq), pac: pick(pacs).id, med: m.id, fecha: k, hora: t, svc, estado, pago, canal, hist: [] };
                c.hist.push([`${fmtDay(creada)} · ${hm(8 * 60 + Math.floor(r() * 600))}`, `Agendada por ${CANALES[canal]}`]);
                if (pago) c.hist.push([`${fmtDay(creada)}`, canal === 'recepcion' ? 'Pago en caja registrado' : 'Pago QR confirmado por el banco']);
                else if (estado === 'reservada') c.hist.push([`${fmtDay(creada)}`, 'QR de pago enviado por WhatsApp']);
                if (['espera', 'consulta', 'atendida'].includes(estado)) { c.lleg = Math.max(t - 5 - Math.floor(r() * 20), 7 * 60); if (k === TODAY) c.lleg = Math.min(c.lleg, now - 2 - Math.floor(r() * 15)); c.hist.push([`${fmtDay(k)} · ${hm(c.lleg)}`, 'Llegada registrada en recepción']); }
                if (estado === 'consulta') c.hist.push([`${fmtDay(k)} · ${hm(t)}`, 'Consulta iniciada']);
                if (estado === 'atendida') c.hist.push([`${fmtDay(k)} · ${hm(t + m.dur)}`, 'Consulta finalizada']);
                if (estado === 'ausente') c.hist.push([`${fmtDay(k)} · ${hm(t + 15)}`, 'Marcada como no asistió']);
                if (estado === 'cancelada') { c.motivo = pick(['El paciente lo solicitó', 'Pago QR vencido', 'El médico no estará disponible']); c.hist.push([`${fmtDay(addDays(creada, 1))}`, 'Cancelada · ' + c.motivo]); }
                citas.push(c);
            }
        }
    }
    return { day: TODAY, seq, pacs, citas };
}

function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.day === TODAY && Array.isArray(s.citas)) return s; } catch (e) { /* sin almacenamiento */ }
    return generate();
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ } };
db = load();
save();

const PAC = () => Object.fromEntries(db.pacs.map((p) => [p.id, p]));
let pacIdx = PAC();
const svcOf = (c) => SERVICIOS[MED[c.med].esp][c.svc];
const fin = (c) => c.hora + MED[c.med].dur;


/* ---------- horarios ---------- */
const ini = (n) => n.replace(/^Dr(a)?\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2);
function slotsDe(m, k) {
    const h = m.hor[dow(k)];
    if (!h) return [];
    const out = [];
    for (let t = toMin(h[0]); t + m.dur <= toMin(h[1]); t += m.dur) out.push(t);
    return out;
}
const ocupado = (medId, k, t, salvo) => db.citas.some((c) => c.med === medId && c.fecha === k && c.hora === t && c.estado !== 'cancelada' && c.id !== salvo);
const libre = (k, t) => k > TODAY || (k === TODAY && t >= nowMin());
const nuevoCodigo = () => 'MC-' + (10200 + db.pacs.length * 13);
