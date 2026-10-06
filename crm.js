/* =========================================================
   CRM de pacientes y ventas — contenido y demo interactiva
   (tablero con arrastrar y soltar, ficha con chat en vivo, notas e IA/derivación humana)
   Usa utilidades y datos definidos en index.js.
   ========================================================= */

const CRM = P.crm;

/* ---------- contenido de la sección ---------- */
$('#crm-que').textContent = CRM.queEs;
$('#crm-price').textContent = bs0(CRM.precio);

const PAIN_ICONS = [
    '<path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z"/><path d="M9 10h.01M15 10h.01M9.5 14.5c1.5-1 3.5-1 5 0"/>',
    '<path d="M3 4h18l-7 9v6l-4 2v-8L3 4z"/>',
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h5"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
];
html('#crm-pains', CRM.porQue.map(([t, d], i) =>
    `<article class="pain reveal" style="--d:${i * 70}ms"><span class="pain__ico"><svg viewBox="0 0 24 24" aria-hidden="true">${PAIN_ICONS[i % PAIN_ICONS.length]}</svg></span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join(''));

html('#crm-flow', CRM.pasos.map(([t, d], i) =>
    `<li class="flow__step${i === 0 ? ' is-on' : ''}" tabindex="0" data-step="${i}"><span class="flow__n">${i + 1}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join(''));
const steps = $$('.flow__step');
let stepTimer, stepIdx = 0;
const setStep = (i) => { stepIdx = i; steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-done', k < i); }); };
const autoStep = () => { clearInterval(stepTimer); if (!reduced) stepTimer = setInterval(() => setStep((stepIdx + 1) % steps.length), 2600); };
steps.forEach((s) => {
    const go = () => { setStep(+s.dataset.step); autoStep(); };
    s.addEventListener('click', go);
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
autoStep();

const FEAT_ICONS = [
    '<path d="M3 5h18M6 12h12M10 19h4"/>',
    '<path d="M5 9l-2 3 2 3M19 9l2 3-2 3M9 5l3-2 3 2M9 19l3 2 3-2M12 3v18M3 12h18"/>',
    '<path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z"/>',
    '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M2 13v2M22 13v2"/>',
    '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
];
html('#crm-feats', CRM.funciones.map(([t, d], i) =>
    `<article class="feat reveal" style="--d:${i * 60}ms"><span class="feat__ico"><svg viewBox="0 0 24 24" aria-hidden="true">${FEAT_ICONS[i % FEAT_ICONS.length]}</svg></span><div><h4>${esc(t)}</h4><p>${esc(d)}</p></div></article>`).join(''));

/* ---------- datos de la demo ---------- */
// c: canal (wa, call, portal) · s: etapa · who: 'ia' o nombre del asesor
const DEALS = {
    'Consultas': [
        { n: 'Carla Méndez', i: 'Consulta de Neurología', v: 350, c: 'wa', s: 0, who: 'ia', t: 'hace 2 min' },
        { n: 'Valeria Suárez', i: 'Tomografía de cráneo', v: 1400, c: 'wa', s: 0, who: 'ia', t: 'hace 9 min' },
        { n: 'Jorge Rivero', i: 'Resonancia magnética', v: 1800, c: 'wa', s: 1, who: 'ia', t: 'hace 25 min' },
        { n: 'Lucía Fernández', i: 'Consulta de Cardiología', v: 300, c: 'call', s: 1, who: 'ia', t: 'hace 1 h' },
        { n: 'Marco Antelo', i: 'Paquete de laboratorio', v: 650, c: 'portal', s: 2, who: 'Ana', t: 'hace 2 h' },
        { n: 'Sofía Pinto', i: 'Ecografía y consulta', v: 520, c: 'wa', s: 3, who: 'Luis', t: 'ayer' },
        { n: 'Diego Rojas', i: 'Consulta de Pediatría', v: 250, c: 'wa', s: 4, who: 'Ana', t: 'ayer' },
    ],
    'Cirugías': [
        { n: 'Roberto Vargas', i: 'Cirugía de columna', v: 38000, c: 'wa', s: 0, who: 'ia', t: 'hace 15 min' },
        { n: 'Patricia Justiniano', i: 'Colecistectomía', v: 14500, c: 'call', s: 1, who: 'Luis', t: 'hace 3 h' },
        { n: 'Andrés Salazar', i: 'Artroscopía de rodilla', v: 21000, c: 'wa', s: 2, who: 'Ana', t: 'ayer' },
        { n: 'Mónica Ribera', i: 'Cirugía de hernia', v: 12800, c: 'portal', s: 3, who: 'Luis', t: 'hace 2 días' },
        { n: 'Fernando Ortiz', i: 'Neurocirugía programada', v: 52000, c: 'wa', s: 4, who: 'Ana', t: 'hace 3 días' },
    ],
    'Empresas': [
        { n: 'Agroindustrias del Oriente', i: 'Chequeos ejecutivos (40 personas)', v: 48000, c: 'call', s: 0, who: 'Luis', t: 'hoy' },
        { n: 'Transportes Chiquitanos', i: 'Exámenes preocupacionales', v: 22000, c: 'wa', s: 1, who: 'Ana', t: 'ayer' },
        { n: 'Colegio San Martín', i: 'Convenio de atención', v: 18000, c: 'portal', s: 2, who: 'Luis', t: 'hace 2 días' },
        { n: 'Banco Regional', i: 'Chequeos anuales', v: 65000, c: 'wa', s: 3, who: 'Ana', t: 'hace 4 días' },
    ],
};
const CHANNEL = { wa: 'WhatsApp', call: 'Llamada', portal: 'Portal' };
const CH_ICON = {
    wa: '<path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z"/>',
    call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
    portal: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/>',
};
let id = 0;
Object.values(DEALS).forEach((list) => list.forEach((d) => {
    d.id = ++id;
    d.tel = '+591 7' + String(1000000 + ((d.id * 7919) % 8999999)).slice(0, 7);
    d.notes = [{ t: d.s > 1 ? 'Paciente pidió que la llamen por la tarde.' : 'Contacto creado automáticamente desde ' + CHANNEL[d.c] + '.', who: d.s > 1 ? d.who : 'Sistema', when: d.t }];
    d.chat = seedChat(d);
    d.handoffDone = false;
}));

function first(n) { return n.split(' ')[0]; }
function initials(n) { return n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(); }

function seedChat(d) {
    const msgs = [
        { from: 'lead', t: `Hola, quería información sobre ${d.i.toLowerCase()}.` },
        { from: 'ia', t: `¡Hola ${first(d.n)}! 😊 Con gusto. El valor referencial es ${bs0(d.v)}. ¿Desea que le busque un horario?` },
    ];
    if (d.s >= 1) msgs.push({ from: 'lead', t: '¿Tienen disponibilidad esta semana?' }, { from: 'ia', t: 'Tengo el jueves a las 09:30 o el viernes a las 15:00. ¿Cuál le acomoda mejor?' });
    if (d.who !== 'ia') msgs.push({ from: 'sys', t: `Conversación tomada por ${d.who} (asesor)` }, { from: 'agent', t: `Hola ${first(d.n)}, soy ${d.who}. Le ayudo con los detalles.` });
    return msgs;
}

/* ---------- tablero ---------- */
let pipe = 'Consultas';
const board = $('#crm-board');

html('#crm-pipes', Object.keys(CRM.pipelines).map((k) =>
    `<button role="tab" aria-selected="${k === pipe}" data-pipe="${esc(k)}">${esc(k)}</button>`).join(''));
$$('#crm-pipes button').forEach((b) => b.addEventListener('click', () => {
    pipe = b.dataset.pipe;
    $$('#crm-pipes button').forEach((x) => x.setAttribute('aria-selected', x === b));
    closeDrawer();
    render(true);
$$('#crm .reveal:not(.in)').forEach((el) => io.observe(el));
}));

function render(animate = false) {
    const stages = CRM.pipelines[pipe], deals = DEALS[pipe];
    board.style.setProperty('--cols', stages.length);
    board.innerHTML = stages.map((st, si) => {
        const list = deals.filter((d) => d.s === si);
        const sum = list.reduce((a, d) => a + d.v, 0);
        return `<div class="kcol${si === stages.length - 1 ? ' kcol--won' : ''}" data-stage="${si}">
            <header class="kcol__head"><span class="kcol__dot" style="--h:${150 - si * 22}"></span><b>${esc(st)}</b><span class="kcol__n">${list.length}</span><small>${bs0(sum)}</small></header>
            <div class="kcol__list">${list.map((d, k) => card(d, animate ? k : -1)).join('') || '<p class="kcol__empty">Suelte aquí</p>'}</div>
        </div>`;
    }).join('');
    $$('.kcard', board).forEach(bindCard);
    stats();
}

function card(d, k) {
    const ia = d.who === 'ia';
    return `<article class="kcard${k >= 0 ? ' kcard--in' : ''}" style="--k:${Math.max(k, 0)}" data-id="${d.id}" tabindex="0" aria-label="${esc(d.n)}, ${esc(d.i)}">
        <div class="kcard__top"><span class="kcard__av">${initials(d.n)}</span><div><b>${esc(d.n)}</b><small>${esc(d.i)}</small></div></div>
        <div class="kcard__foot">
            <span class="kcard__ch kcard__ch--${d.c}" title="${CHANNEL[d.c]}"><svg viewBox="0 0 24 24" aria-hidden="true">${CH_ICON[d.c]}</svg></span>
            <span class="kcard__who${ia ? ' kcard__who--ia' : ''}">${ia ? 'IA' : esc(d.who)}</span>
            <span class="kcard__v">${bs0(d.v)}</span>
        </div>
        <small class="kcard__t">${esc(d.t)}</small>
    </article>`;
}

function stats() {
    const stages = CRM.pipelines[pipe], deals = DEALS[pipe], last = stages.length - 1;
    const total = deals.reduce((a, d) => a + d.v, 0);
    const won = deals.filter((d) => d.s === last).length;
    $('#crm-value').textContent = bs0(total);
    $('#crm-conv').textContent = Math.round((won / deals.length) * 100) + ' %';
    html('#crm-funnel', `<p class="crm__funnel-t">Embudo de conversión</p>` + stages.map((st, si) => {
        const reached = deals.filter((d) => d.s >= si).length, pct = (reached / deals.length) * 100;
        return `<div class="fbar"><span>${esc(st)}</span><div class="fbar__track"><i style="width:${pct}%"></i></div><b>${reached}</b></div>`;
    }).join(''));
}

/* ---------- arrastrar y soltar (mouse, táctil y teclado) ---------- */
let drag = null;
function bindCard(el) {
    el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const touch = e.pointerType !== 'mouse';
        drag = { el, id: +el.dataset.id, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, active: false, touch, timer: null, pid: e.pointerId };
        if (touch) drag.timer = setTimeout(() => startDrag(), 260);
    });
    el.addEventListener('keydown', (e) => {
        const d = findDeal(+el.dataset.id), last = CRM.pipelines[pipe].length - 1;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(d); }
        if (e.key === 'ArrowRight' && d.s < last) { moveDeal(d, d.s + 1); focusCard(d.id); }
        if (e.key === 'ArrowLeft' && d.s > 0) { moveDeal(d, d.s - 1); focusCard(d.id); }
    });
}
const focusCard = (i) => $(`.kcard[data-id="${i}"]`, board)?.focus();

function startDrag() {
    if (!drag) return;
    drag.active = true;
    const r = drag.el.getBoundingClientRect();
    drag.dx = drag.x - r.left; drag.dy = drag.y - r.top;
    drag.ghost = drag.el.cloneNode(true);
    drag.ghost.classList.add('kcard--ghost');
    drag.ghost.style.width = r.width + 'px';
    document.body.appendChild(drag.ghost);
    drag.el.classList.add('kcard--placeholder');
    document.body.classList.add('is-dragging');
    moveGhost();
    if (navigator.vibrate && drag.touch) navigator.vibrate(15);
}
function moveGhost() {
    drag.ghost.style.transform = `translate(${drag.x - drag.dx}px, ${drag.y - drag.dy}px) rotate(3deg)`;
    const col = document.elementFromPoint(drag.x, drag.y)?.closest('.kcol');
    $$('.kcol', board).forEach((c) => c.classList.toggle('is-over', c === col));
    // desplazamiento horizontal automático del tablero
    const br = board.getBoundingClientRect();
    if (drag.x > br.right - 40) board.scrollLeft += 12;
    else if (drag.x < br.left + 40) board.scrollLeft -= 12;
}
addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.x = e.clientX; drag.y = e.clientY;
    const moved = Math.hypot(drag.x - drag.x0, drag.y - drag.y0);
    if (!drag.active) {
        if (drag.touch) { if (moved > 8) { clearTimeout(drag.timer); drag = null; } return; }
        if (moved > 5) startDrag(); else return;
    }
    moveGhost();
});
addEventListener('touchmove', (e) => { if (drag?.active) e.preventDefault(); }, { passive: false });
addEventListener('pointerup', (e) => {
    if (!drag) return;
    clearTimeout(drag.timer);
    const d = findDeal(drag.id);
    if (drag.active) {
        const col = document.elementFromPoint(e.clientX, e.clientY)?.closest('.kcol');
        drag.ghost.remove();
        document.body.classList.remove('is-dragging');
        $$('.kcol', board).forEach((c) => c.classList.remove('is-over'));
        if (col && +col.dataset.stage !== d.s) moveDeal(d, +col.dataset.stage);
        else drag.el.classList.remove('kcard--placeholder');
    } else {
        openDrawer(d);
    }
    drag = null;
});
addEventListener('pointercancel', () => {
    if (!drag) return;
    clearTimeout(drag.timer);
    drag.ghost?.remove();
    document.body.classList.remove('is-dragging');
    drag.el.classList.remove('kcard--placeholder');
    drag = null;
});

function findDeal(i) { return DEALS[pipe].find((d) => d.id === i); }
function moveDeal(d, s) {
    const stages = CRM.pipelines[pipe];
    d.s = s; d.t = 'ahora';
    d.notes.unshift({ t: `Movida a «${stages[s]}».`, who: d.who === 'ia' ? 'Asesor' : d.who, when: 'ahora' });
    render();
    const el = $(`.kcard[data-id="${d.id}"]`, board);
    el?.classList.add('kcard--drop');
    if (s === stages.length - 1) toast(`🎉 ${first(d.n)}: ${stages[s].toLowerCase()} · ${bs0(d.v)}`);
    if (openId === d.id) fillDrawer(d);
}

let toastT;
function toast(msg) {
    const t = $('#crm-toast');
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
}

/* ---------- ficha de la oportunidad ---------- */
const drawer = $('#crm-drawer');
let openId = null, liveT = [];

function openDrawer(d) {
    openId = d.id;
    fillDrawer(d);
    drawer.classList.add('is-on');
    drawer.setAttribute('aria-hidden', 'false');
    $('#d-close').focus({ preventScroll: true });
    scheduleLive(d);
}
function closeDrawer() {
    openId = null;
    drawer.classList.remove('is-on');
    drawer.setAttribute('aria-hidden', 'true');
    liveT.forEach(clearTimeout); liveT = [];
}
$('#d-close').addEventListener('click', closeDrawer);
drawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

function fillDrawer(d) {
    const stages = CRM.pipelines[pipe];
    $('#d-avatar').textContent = initials(d.n);
    $('#d-name').textContent = d.n;
    $('#d-interest').textContent = d.i;
    $('#d-stage').textContent = stages[d.s];
    $('#d-value').textContent = bs0(d.v);
    html('#d-contact', [
        ['Teléfono', d.tel], ['Canal', CHANNEL[d.c]], ['Pipeline', pipe],
        ['Paciente en Medicaltec', d.s >= 2 ? 'Vinculado' : 'Por vincular'], ['Responsable', d.who === 'ia' ? 'Asistente IA' : d.who],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join(''));
    renderNotes(d);
    renderChat(d);
}

function renderNotes(d) {
    html('#d-notes', d.notes.map((n) => `<li><p>${esc(n.t)}</p><small>${esc(n.who)} · ${esc(n.when)}</small></li>`).join(''));
}
$('#d-note-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#d-note').value.trim(), d = openId && findDeal(openId);
    if (!v || !d) return;
    d.notes.unshift({ t: v, who: 'Usted', when: 'ahora' });
    $('#d-note').value = '';
    renderNotes(d);
});

function renderChat(d) {
    const ia = d.who === 'ia';
    $('#d-handoff').classList.toggle('is-human', !ia);
    $('#d-mode').innerHTML = ia ? '<i class="mode-dot"></i> Atendido por <b>IA</b>' : `<i class="mode-dot"></i> Atendido por <b>${esc(d.who)}</b> (asesor)`;
    $('#d-take').textContent = ia ? 'Tomar conversación' : 'Devolver a la IA';
    const input = $('#d-input');
    input.disabled = ia;
    input.placeholder = ia ? 'La IA está atendiendo · tome la conversación para escribir' : `Escribir a ${first(d.n)}…`;
    html('#d-chat', d.chat.map(msg).join(''));
    scrollChat();
}
const LABEL = { lead: '', ia: 'IA', agent: 'Asesor' };
function msg(m) {
    if (m.from === 'sys') return `<p class="cm cm--sys">${esc(m.t)}</p>`;
    if (m.from === 'typing') return `<p class="cm cm--in cm--typing"><i></i><i></i><i></i></p>`;
    const out = m.from !== 'lead';
    return `<p class="cm ${out ? 'cm--out' : 'cm--in'}${m.from === 'ia' ? ' cm--ia' : ''}">${LABEL[m.from] ? `<span class="cm__tag">${LABEL[m.from]}</span>` : ''}${esc(m.t)}</p>`;
}
const scrollChat = () => { const c = $('#d-chat'); c.scrollTop = c.scrollHeight; };
function push(d, m) {
    d.chat.push(m);
    if (openId === d.id) { $('#d-chat').insertAdjacentHTML('beforeend', msg(m)); scrollChat(); }
}
function typing(d, ms, then) {
    if (openId !== d.id) return then();
    $('#d-chat').insertAdjacentHTML('beforeend', msg({ from: 'typing' })); scrollChat();
    liveT.push(setTimeout(() => { $('#d-chat .cm--typing')?.remove(); then(); }, ms));
}

$('#d-take').addEventListener('click', () => {
    const d = findDeal(openId); if (!d) return;
    if (d.who === 'ia') { d.who = 'Ana'; d.chat.push({ from: 'sys', t: 'Conversación tomada por Ana (asesora)' }); }
    else { d.who = 'ia'; d.chat.push({ from: 'sys', t: 'Conversación devuelta al asistente IA' }); }
    fillDrawer(d); render();
    if (d.who !== 'ia') $('#d-input').focus();
});

$('#d-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = findDeal(openId), v = $('#d-input').value.trim();
    if (!d || !v || d.who === 'ia') return;
    $('#d-input').value = '';
    push(d, { from: 'agent', t: v });
    liveT.push(setTimeout(() => typing(d, 1200, () => push(d, { from: 'lead', t: '¡Perfecto, muchas gracias! 🙌' })), 700));
});

// mensajes en vivo: el paciente pide hablar con una persona y la IA deriva
function scheduleLive(d) {
    liveT.forEach(clearTimeout); liveT = [];
    if (d.handoffDone || d.who !== 'ia') return;
    liveT.push(setTimeout(() => {
        if (openId !== d.id || d.who !== 'ia') return;
        typing(d, 1300, () => {
            push(d, { from: 'lead', t: 'Disculpe, ¿puedo hablar con una persona?' });
            liveT.push(setTimeout(() => typing(d, 1100, () => {
                push(d, { from: 'ia', t: 'Claro que sí. Le comunico con un asesor, en un momento le atiende. 🙋' });
                liveT.push(setTimeout(() => {
                    d.handoffDone = true; d.who = 'Ana';
                    d.chat.push({ from: 'sys', t: 'La IA derivó la conversación a Ana (asesora)' });
                    if (openId === d.id) fillDrawer(d);
                    render();
                    toast(`👩 ${first(d.n)} ahora es atendido por Ana`);
                }, 900));
            }), 500));
        });
    }, 2200));
}

render(true);
$$('#crm .reveal:not(.in)').forEach((el) => io.observe(el));
