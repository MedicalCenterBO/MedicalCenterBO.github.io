/* =========================================================
   Generación del PDF de la propuesta con jsPDF (vectorial, sin capturas).
   Usa los datos de PROPUESTA (index.js) y los textos de cada sección del HTML.
   ========================================================= */

const C = {
    green: [0, 159, 72], green600: [0, 134, 61], green200: [143, 227, 182], dark: [11, 59, 46],
    navy: [18, 38, 58], ink: [28, 43, 39], muted: [95, 111, 106], line: [227, 232, 229],
    mint: [232, 245, 238], tint: [245, 248, 246], amber: [168, 106, 18], amberBg: [253, 243, 225], white: [255, 255, 255],
};

// Fuentes estándar de PDF: solo Latin-1. Normaliza caracteres fuera de ese rango.
const clean = (s, keepLines = false) => String(s)
    .replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, '...')
    .replace(keepLines ? /[ \t\u00A0\u202F]+/g : /\s+/g, ' ')
    .replace(/[^\n\x20-\xFF]/g, '').trim();
const textOf = (sel) => clean(document.querySelector(sel)?.textContent || '');

async function loadImage(src) {
    try {
        const blob = await (await fetch(src)).blob();
        return await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); });
    } catch { return null; }
}

async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const W = 210, H = 297, M = 18, CW = W - 2 * M, TOP = 30, BOTTOM = H - 20;
    let y = TOP;

    const [logo, logoWhite] = await Promise.all([loadImage('assets/logo.png'), loadImage('assets/logo-white.png')]);

    /* ---------- helpers ---------- */
    const color = (fn, c) => doc[fn](c[0], c[1], c[2]);
    const font = (style = 'normal', size = 10, c = C.ink, family = 'helvetica') => { doc.setFont(family, style); doc.setFontSize(size); color('setTextColor', c); };
    const newPage = () => { doc.addPage(); y = TOP; };
    const ensure = (h) => { if (y + h > BOTTOM) newPage(); };

    function h2(num, title) {
        ensure(30);
        if (y > TOP) y += 6;
        color('setFillColor', C.mint); color('setDrawColor', [211, 236, 222]);
        doc.roundedRect(M, y - 5, 12, 7, 3.5, 3.5, 'FD');
        font('normal', 9, C.green, 'times'); doc.text(num, M + 6, y - 0.4, { align: 'center' });
        font('normal', 18, C.navy, 'times'); doc.text(clean(title), M + 16, y + 0.6);
        y += 9;
    }
    function h3(title) {
        ensure(14); y += 3;
        font('bold', 11, C.navy); doc.text(clean(title), M, y); y += 6;
    }
    function para(text, { size = 10, c = C.ink, gap = 3, x = M, width = CW } = {}) {
        font('normal', size, c);
        const lh = size * 0.5;
        doc.splitTextToSize(clean(text), width).forEach((line) => { ensure(lh); doc.text(line, x, y); y += lh; });
        y += gap;
    }
    function bullets(list, { mark = 'dot' } = {}) {
        font('normal', 10, C.ink);
        list.forEach((item) => {
            const lines = doc.splitTextToSize(clean(item), CW - 7);
            ensure(lines.length * 5);
            if (mark === 'x') {
                color('setDrawColor', C.muted); doc.setLineWidth(0.35);
                doc.line(M + 0.6, y - 2.8, M + 2.8, y - 0.6); doc.line(M + 2.8, y - 2.8, M + 0.6, y - 0.6);
            } else {
                color('setFillColor', C.green); doc.circle(M + 1.7, y - 1.3, 0.9, 'F');
            }
            lines.forEach((l) => { doc.text(l, M + 7, y); y += 5; });
            y += 0.8;
        });
        y += 2;
    }
    function table(head, body, opts = {}) {
        doc.autoTable({
            startY: y, head: [head.map(clean)], body: body.map((r) => r.map((c) => (typeof c === 'object' ? c : clean(c, true)))),
            margin: { left: M, right: M, top: TOP, bottom: 22 },
            theme: 'plain', rowPageBreak: 'avoid', showFoot: 'lastPage',
            styles: { font: 'helvetica', fontSize: 8.8, cellPadding: { top: 2.4, bottom: 2.4, left: 3, right: 3 }, textColor: C.ink, lineColor: C.line, lineWidth: { bottom: 0.2 }, valign: 'top' },
            headStyles: { fillColor: C.dark, textColor: C.white, fontStyle: 'bold', fontSize: 8, lineWidth: 0 },
            alternateRowStyles: { fillColor: [250, 252, 251] },
            ...opts,
        });
        y = doc.lastAutoTable.finalY + 6;
    }

    /* ---------- portada ---------- */
    color('setFillColor', C.dark); doc.rect(0, 0, W, H, 'F');
    doc.setGState(new doc.GState({ opacity: 0.18 }));
    color('setFillColor', C.green); doc.circle(W + 10, -10, 110, 'F');
    color('setFillColor', [43, 120, 190]); doc.circle(-30, H + 20, 90, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    if (logoWhite) doc.addImage(logoWhite, 'PNG', M, 22, 56, 21);
    else { font('bold', 16, C.white); doc.text('Clínica MedicalCenter', M, 34); }

    font('bold', 8.5, C.green200); doc.text('PROPUESTA TÉCNICA Y ECONÓMICA  ·  MODALIDAD LLAVE EN MANO', M, 86);
    font('normal', 32, C.white, 'times');
    let cy = 102;
    doc.splitTextToSize('Portal de Autogestión para pacientes y médicos', CW - 10).forEach((l) => { doc.text(l, M, cy); cy += 13; });
    font('italic', 32, C.green200, 'times'); doc.text('con bots de WhatsApp', M, cy); cy += 12;
    font('normal', 11, [195, 216, 206]);
    doc.splitTextToSize(textOf('.hero .lead'), CW - 20).forEach((l) => { doc.text(l, M, cy); cy += 5.6; });

    // metadatos
    cy += 10;
    color('setDrawColor', [60, 100, 88]); doc.setLineWidth(0.2); doc.line(M, cy, W - M, cy); cy += 8;
    [['Cliente', 'Clínica MedicalCenter'], ['Propuesta Nº', P.numero], ['Fecha', P.fecha], ['Validez', P.validez]].forEach(([k, v], i) => {
        const x = M + i * (CW / 4);
        font('bold', 7, [134, 171, 155]); doc.text(k.toUpperCase(), x, cy);
        font('bold', 9.5, C.white); doc.text(doc.splitTextToSize(clean(v), CW / 4 - 4), x, cy + 5);
    });

    // tarjeta de inversión
    const total = seleccion();
    cy += 22;
    doc.setGState(new doc.GState({ opacity: 0.08 })); color('setFillColor', C.white);
    doc.roundedRect(M, cy, CW, 58, 5, 5, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    color('setDrawColor', [70, 110, 98]); doc.roundedRect(M, cy, CW, 58, 5, 5, 'S');
    font('bold', 7.5, [143, 179, 163]); doc.text('INVERSIÓN TOTAL LLAVE EN MANO', M + 10, cy + 12);
    font('normal', 30, C.white, 'times'); doc.text(bs(total.total), M + 10, cy + 26);
    font('normal', 9, [169, 196, 184]);
    doc.text(`${total.bots.length} bot(s) de WhatsApp${total.llamadas ? ' · bot de llamadas IA' : ''}${total.crm ? ' · CRM' : ''}${total.opcionales.length ? ` · ${total.opcionales.length} opcional(es)` : ''} · Impuestos de ley incluidos (IVA 13 % e IT 3 %)`, M + 10, cy + 33);
    [[`${P.meses} meses`, 'de implementación'], [`${P.cuotas.length} cuotas`, 'mensuales con avances'], [`${P.garantiaMeses} meses`, 'de garantía']].forEach(([a, b], i) => {
        const x = M + 10 + i * 52;
        font('bold', 15, C.green200); doc.text(a, x, cy + 46);
        font('normal', 8, [184, 207, 197]); doc.text(b, x, cy + 51);
    });

    font('bold', 7.5, [134, 171, 155]); doc.text('PRESENTADO POR', M, H - 30);
    font('normal', 14, C.white, 'times'); doc.text(clean(P.proveedor), M, H - 23);
    font('normal', 9, [169, 196, 184]); if (P.contacto) doc.text(clean(P.contacto), M, H - 17.5);

    /* ---------- 01 resumen ---------- */
    newPage();
    h2('01', 'Resumen ejecutivo');
    para(textOf('#resumen .sec__sub'));
    table(['Módulo', 'Descripción'],
        [...document.querySelectorAll('#resumen .pillar')].map((p) => [textOf2(p, 'h3'), textOf2(p, 'p')]),
        { columnStyles: { 0: { cellWidth: 38, fontStyle: 'bold', textColor: C.navy } } });
    // principio rector
    const pr = doc.splitTextToSize(textOf('.principle p'), CW - 14);
    ensure(pr.length * 5 + 14);
    color('setFillColor', C.mint); doc.roundedRect(M, y - 2, CW, pr.length * 5 + 11, 3, 3, 'F');
    color('setFillColor', C.green); doc.rect(M, y - 2, 1.4, pr.length * 5 + 11, 'F');
    font('bold', 7.5, C.green600); doc.text('PRINCIPIO RECTOR', M + 7, y + 3.5);
    font('normal', 9.8, C.dark); pr.forEach((l, i) => doc.text(l, M + 7, y + 9 + i * 5));
    y += pr.length * 5 + 16;

    /* ---------- 02 alcance ---------- */
    h2('02', 'Comprensión del alcance');
    para(textOf('#alcance .sec__sub'));
    table(['#', 'Componente', 'Descripción'], P.alcance.map(([t, d], i) => [String(i + 1).padStart(2, '0'), t, d]),
        { columnStyles: { 0: { cellWidth: 11, textColor: C.green, fontStyle: 'bold' }, 1: { cellWidth: 52, fontStyle: 'bold', textColor: C.navy } } });

    /* ---------- 03 portal ---------- */
    h2('03', 'Experiencia del portal');
    para(textOf('#portal .sec__sub').replace('Explore las vistas principales; e', 'E'));
    table(['Vista', 'Funciones principales'], [
        ['Paciente', 'Próxima cita con estado, reprogramación y cancelación; resultados de laboratorio e imagenología con descarga; pagos pendientes con QR; historial de citas, facturas y perfil.'],
        ['Médico', 'Agenda por día, semana y mes; cupos disponibles; estados de citas (confirmada, pendiente, pagada); bloqueos por ausencias, vacaciones y juntas.'],
        ['Administración', 'Transacciones confirmadas, pendientes y fallidas; reproceso autorizado; usuarios y roles; parámetros; conciliación de pagos y facturas; auditoría.'],
        ['Pago QR', 'Servicio, importe, moneda y referencia antes de pagar; QR con vencimiento; estados en línea: QR generado, confirmación del banco, registro en Medicaltec y factura SBA.'],
        ['WhatsApp', 'Recordatorios con botones de confirmar o reprogramar, avisos de resultados y pagos, y enlaces seguros al portal.'],
    ], { columnStyles: { 0: { cellWidth: 32, fontStyle: 'bold', textColor: C.navy } } });
    h3('Principios de diseño');
    bullets([...document.querySelectorAll('.design-notes .ticks li')].map((li) => li.textContent));
    // paleta
    ensure(22);
    [['#009F48', C.green, 'Verde MedicalCenter'], ['#0B3B2E', C.dark, 'Verde profundo'], ['#12263A', C.navy, 'Azul clínico'], ['#E8F5EE', C.mint, 'Menta']].forEach(([hex, c, name], i) => {
        const x = M + i * (CW / 4);
        color('setFillColor', c); color('setDrawColor', C.line); doc.roundedRect(x, y, CW / 4 - 4, 10, 2, 2, 'FD');
        font('bold', 8, C.navy); doc.text(name, x, y + 15);
        font('normal', 7.5, C.muted); doc.text(hex, x, y + 19);
    });
    y += 26;

    /* ---------- 04 arquitectura ---------- */
    h2('04', 'Arquitectura e integraciones');
    para(textOf('#arquitectura .sec__sub').replace(/\s*Seleccione un sistema.*$/, ''));
    drawArchitecture();
    table(['Sistema', 'Rol', 'Operaciones'],
        Object.entries(P.integraciones).map(([k, v]) => [k, v.rol, v.ops.map((o) => '- ' + o).join('\n')]),
        { columnStyles: { 0: { cellWidth: 30, fontStyle: 'bold', textColor: C.navy }, 1: { cellWidth: 44, textColor: C.muted } } });
    h3('Tecnologías');
    table(['Capa', 'Tecnología', 'Licencia'], P.stack,
        { columnStyles: { 0: { cellWidth: 44, fontStyle: 'bold', textColor: C.navy }, 2: { cellWidth: 36, textColor: C.green600 } } });
    para(textOf('#arquitectura .muted-light'), { size: 8.5, c: C.muted });

    /* ---------- 05 bots ---------- */
    h2('05', 'Bots de WhatsApp y llamadas con IA');
    para(textOf('#bots .sec__sub').replace(/\s*Elija los bots.*$/, ''));
    h3(`Bots de WhatsApp · precio fijo de ${bs(P.bots.precio)} por bot`);
    const elegidos = new Set(total.bots.map((b) => b[0]));
    table(['Bot', 'Qué hace', 'Precio', 'Incluido'], P.bots.tipos.map(([t, d]) => [t, d, bs(P.bots.precio), elegidos.has(t) ? 'Sí' : 'Opcional']), {
        columnStyles: { 0: { cellWidth: 42, fontStyle: 'bold', textColor: C.navy }, 2: { cellWidth: 27, halign: 'right' }, 3: { cellWidth: 20, fontStyle: 'bold' } },
        didParseCell: (d) => {
            if (d.section === 'head' && d.column.index === 2) d.cell.styles.halign = 'right';
            if (d.section === 'body' && d.column.index === 3) d.cell.styles.textColor = d.cell.raw === 'Sí' ? C.green600 : C.muted;
        },
    });
    h3(`Bot de llamadas con IA · ${bs(P.llamadas.precio)}${total.llamadas ? ' (incluido)' : ' (opcional)'}`);
    para(P.llamadas.descripcion);
    bullets(P.llamadas.funciones);
    para('Requiere un número telefónico o troncal SIP de MedicalCenter y servicios externos de voz e IA cobrados por minuto, declarados como dependencia externa.', { size: 8.5, c: C.muted });

    /* ---------- 06 CRM ---------- */
    h2('06', 'CRM de pacientes y ventas');
    para(P.crm.queEs);
    h3('¿Por qué MedicalCenter lo necesita?');
    table(['Problema actual', 'Detalle'], P.crm.porQue, { columnStyles: { 0: { cellWidth: 48, fontStyle: 'bold', textColor: C.amber } } });
    h3('Cómo funciona');
    table(['#', 'Etapa', 'Qué ocurre'], P.crm.pasos.map(([t, d], i) => [String(i + 1), t, d]), {
        columnStyles: { 0: { cellWidth: 12, fontStyle: 'bold', textColor: C.green, halign: 'center' }, 1: { cellWidth: 40, fontStyle: 'bold', textColor: C.navy } },
    });
    h3('Pipelines y embudos de ventas parametrizables');
    drawPipelines();
    h3('Funcionalidades');
    table(['Funcionalidad', 'Detalle'], P.crm.funciones, { columnStyles: { 0: { cellWidth: 52, fontStyle: 'bold', textColor: C.navy } } });
    ensure(26);
    color('setFillColor', C.dark); doc.roundedRect(M, y - 2, CW, 22, 3, 3, 'F');
    font('bold', 7.5, C.green200); doc.text(total.crm ? 'INCLUIDO EN ESTA PROPUESTA' : 'MÓDULO OPCIONAL', M + 8, y + 4.5);
    font('normal', 9.5, C.white);
    doc.text(doc.splitTextToSize('Instalado en los servidores de MedicalCenter, sin costo por usuario ni licencias mensuales, con código fuente incluido.', CW - 70), M + 8, y + 10.5);
    font('normal', 18, C.white, 'times'); doc.text(bs(P.crm.precio), W - M - 8, y + 10, { align: 'right' });
    font('normal', 7.5, [159, 189, 176]); doc.text('pago único, impuestos incluidos', W - M - 8, y + 15, { align: 'right' });
    y += 28;

    /* ---------- 07 infraestructura ---------- */
    h2('07', 'Recursos de infraestructura');
    ensure(20);
    color('setFillColor', C.dark); doc.roundedRect(M, y - 2, CW, 16, 3, 3, 'F');
    font('normal', 13, C.white, 'times'); doc.text(textOf('.infra__big p'), M + 8, y + 7.8);
    y += 22;
    bullets([...document.querySelectorAll('#infraestructura .ticks li')].map((li) => li.textContent));

    /* ---------- 06 cronograma ---------- */
    h2('08', 'Cronograma');
    para(textOf('#cronograma .sec__sub'));
    drawGantt();

    /* ---------- 07 documentación ---------- */
    h2('09', 'Documentación y capacitación');
    h3('Documentación en español');
    bullets([...document.querySelectorAll('#documentacion .card:first-child li')].map((li) => li.textContent));
    h3('Capacitación al personal de TI');
    const htot = P.capacitacion.reduce((a, c) => a + c[1], 0);
    table(['Sesión', 'Horas'], P.capacitacion.map(([t, h]) => [t, String(h)]), {
        columnStyles: { 1: { cellWidth: 22, halign: 'right' } },
        foot: [['Total', `${htot} horas`]],
        footStyles: { fillColor: C.mint, textColor: C.navy, fontStyle: 'bold', halign: 'left' },
        didParseCell: (d) => { if (d.section === 'foot' && d.column.index === 1) d.cell.styles.halign = 'right'; if (d.section === 'head' && d.column.index === 1) d.cell.styles.halign = 'right'; },
    });
    para('Sesiones presenciales o virtuales, grabadas, con materiales entregados a MedicalCenter.', { size: 8.5, c: C.muted });

    /* ---------- 08 garantía ---------- */
    h2('10', 'Garantía y soporte');
    para(textOf('#garantia .sec__sub'));
    const sevColors = [[180, 35, 24], [224, 166, 74], [47, 111, 202], [154, 165, 161]];
    table(['Criticidad', 'Ejemplo', 'Respuesta', 'Solución / contingencia'], P.sla, {
        columnStyles: { 0: { cellWidth: 24, fontStyle: 'bold' }, 2: { cellWidth: 30 } },
        didParseCell: (d) => { if (d.section === 'body' && d.column.index === 0) d.cell.styles.textColor = sevColors[d.row.index]; },
    });
    para(textOf('#garantia > .wrap > p.small'), { size: 8.5, c: C.muted });

    /* ---------- 09 cumplimiento ---------- */
    h2('11', 'Matriz de cumplimiento');
    para(textOf('#cumplimiento .sec__sub'));
    table(['Req.', 'Requisito', 'Estado', 'Observación / dependencia'],
        P.cumplimiento.map(([n, r, s, o]) => [n, r, s === 'ok' ? 'Cumple' : 'Con dependencia', o]), {
            columnStyles: { 0: { cellWidth: 12, textColor: C.green600, fontStyle: 'bold' }, 1: { cellWidth: 52, textColor: C.navy }, 2: { cellWidth: 27, fontStyle: 'bold' } },
            didParseCell: (d) => {
                if (d.section === 'body' && d.column.index === 2) d.cell.styles.textColor = d.cell.raw === 'Cumple' ? C.green600 : C.amber;
            },
        });

    /* ---------- 10 supuestos ---------- */
    h2('12', 'Dependencias, supuestos y exclusiones');
    h3('Dependencias y supuestos');
    bullets(P.supuestos);
    h3('Exclusiones y limitaciones');
    bullets(P.exclusiones, { mark: 'x' });

    /* ---------- 11 económica ---------- */
    h2('13', 'Propuesta económica');
    para(textOf('#economica .sec__sub').replace(/\s*Elija los bots.*$/, ''));
    const iva = total.total * P.iva, it = total.total * P.it;
    const foot = [
        ['', 'Importe neto sin impuestos', bs(total.total - iva - it)],
        ['', 'IVA (13 %) incluido', bs(iva)],
        ['', 'IT (3 %) incluido', bs(it)],
        ['', 'TOTAL LLAVE EN MANO (impuestos incluidos)', bs(total.total)],
    ];
    const rows = P.precios.map(([t, v, d], i) => [String(i + 1).padStart(2, '0'), d ? `${t}\n${d}` : t, bs(v)]);
    total.bots.forEach((b) => rows.push([String(rows.length + 1).padStart(2, '0'), `Bot de WhatsApp: ${b[0]}\nPrecio fijo por bot`, bs(P.bots.precio)]));
    if (total.crm) rows.push([String(rows.length + 1).padStart(2, '0'), 'CRM de pacientes y ventas\nPipelines, arrastrar y soltar, chat de WhatsApp en tiempo real, IA y derivación humana', bs(P.crm.precio)]);
    if (total.llamadas) rows.push([String(rows.length + 1).padStart(2, '0'), 'Bot de llamadas con IA\nAgente de voz para confirmaciones, recordatorios y atención 24/7', bs(P.llamadas.precio)]);
    total.opcionales.forEach((o) => rows.push(['+', `${o[0]} (opcional)\n${o[1]}`, bs(o[2])]));
    table(['#', 'Componente', 'Importe'], rows, {
        columnStyles: { 0: { cellWidth: 11, textColor: C.muted }, 2: { cellWidth: 34, halign: 'right', fontStyle: 'bold', textColor: C.navy } },
        foot,
        footStyles: { fillColor: C.white, textColor: C.muted, fontStyle: 'normal', fontSize: 8.8 },
        didParseCell: (d) => {
            if (d.section === 'head' && d.column.index === 2) d.cell.styles.halign = 'right';
            if (d.section === 'foot' && d.column.index === 2) d.cell.styles.halign = 'right';
            if (d.section === 'foot' && d.row.index === 3) { d.cell.styles.fillColor = C.dark; d.cell.styles.textColor = C.white; d.cell.styles.fontStyle = 'bold'; d.cell.styles.fontSize = 10.5; }
        },
        willDrawCell: (d) => {
            // la segunda línea del componente se dibuja en gris después del fondo de la celda
            if (d.section === 'body' && d.column.index === 1 && d.cell.text.length > 1) { d.cell.lines2 = d.cell.text; d.cell.text = []; }
        },
        didDrawCell: (d) => {
            if (!d.cell.lines2) return;
            const [first, ...rest] = d.cell.lines2;
            doc.setFont('helvetica', 'bold'); color('setTextColor', C.navy); doc.setFontSize(8.8);
            doc.text(first, d.cell.x + 3, d.cell.y + 5.4);
            doc.setFont('helvetica', 'normal'); color('setTextColor', C.muted); doc.setFontSize(8);
            doc.text(rest, d.cell.x + 3, d.cell.y + 9.4);
        },
    });

    if (P.opcionales.length) h3('Componentes opcionales');
    if (P.opcionales.length) table(['Componente', 'Detalle', 'Importe'], P.opcionales.map(([a, b, c]) => [a, b, bs(c)]), {
        columnStyles: { 0: { cellWidth: 52, fontStyle: 'bold', textColor: C.navy }, 2: { cellWidth: 30, halign: 'right' } },
        didParseCell: (d) => { if (d.section === 'head' && d.column.index === 2) d.cell.styles.halign = 'right'; },
    });

    h3(`Plan de pagos: ${P.cuotas.length} cuotas mensuales con avances`);
    para(textOf('.cuotas__intro'), { size: 9.5 });
    const montos = cuotas(total.total);
    table(['Cuota', 'Avance demostrado', 'Avance', 'Importe'], P.cuotas.map(([t, pct], i) => [`Mes ${i + 1}`, t, `${pct} %`, bs(montos[i])]), {
        columnStyles: { 0: { cellWidth: 18, fontStyle: 'bold', textColor: C.green }, 2: { cellWidth: 18, halign: 'right', textColor: C.green600, fontStyle: 'bold' }, 3: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: C.navy } },
        bodyStyles: { minCellHeight: 11 },
        foot: [['', 'Total', '', bs(total.total)]],
        footStyles: { fillColor: C.mint, textColor: C.navy, fontStyle: 'bold' },
        didParseCell: (d) => { if ((d.section === 'head' || d.section === 'foot') && d.column.index >= 2) d.cell.styles.halign = 'right'; },
        didDrawCell: (d) => {
            // barra de avance bajo el porcentaje
            if (d.section === 'body' && d.column.index === 2) {
                const pct = P.cuotas[d.row.index][1], w = d.cell.width - 6, bx = d.cell.x + 3, by = d.cell.y + d.cell.height - 3;
                color('setFillColor', C.line); doc.roundedRect(bx, by, w, 1.2, 0.6, 0.6, 'F');
                color('setFillColor', C.green); doc.roundedRect(bx, by, w * pct / 100, 1.2, 0.6, 0.6, 'F');
            }
        },
    });

    h3('Soporte y mantenimiento posterior a la garantía');
    table(['Plan', 'Mensual', 'Horas', 'Incluye'], P.planes.map((p) => [p.nombre + (p.destacado ? ' (recomendado)' : ''), bs(p.precio), `${p.horas} h`, p.items.join(' · ')]), {
        columnStyles: { 0: { cellWidth: 38, fontStyle: 'bold', textColor: C.navy }, 1: { cellWidth: 28 }, 2: { cellWidth: 16 } },
    });
    para(document.getElementById('extra-hour').textContent, { size: 8.5, c: C.muted });

    h3('Costos de terceros (pagados directamente por MedicalCenter)');
    table(['Concepto', 'Proveedor', 'Detalle'], P.terceros, { columnStyles: { 0: { cellWidth: 44, fontStyle: 'bold', textColor: C.navy }, 1: { cellWidth: 34 } } });

    /* ---------- firma ---------- */
    ensure(42); y += 6;
    color('setFillColor', C.dark); doc.roundedRect(M, y, CW, 34, 4, 4, 'F');
    font('bold', 7.5, C.green200); doc.text('PRESENTADO POR', M + 10, y + 11);
    font('normal', 15, C.white, 'times'); doc.text(clean(P.proveedor), M + 10, y + 19);
    font('normal', 9, [169, 196, 184]); if (P.contacto) doc.text(clean(P.contacto), M + 10, y + 25);
    color('setDrawColor', [120, 160, 145]); doc.line(W - M - 70, y + 22, W - M - 10, y + 22);
    font('normal', 8, [169, 196, 184]); doc.text('Firma y sello', W - M - 40, y + 27, { align: 'center' });

    /* ---------- encabezado y pie ---------- */
    const n = doc.getNumberOfPages();
    for (let i = 2; i <= n; i++) {
        doc.setPage(i);
        if (logo) doc.addImage(logo, 'PNG', M, 9, 30, 11.2);
        font('normal', 8, C.muted);
        doc.text(`Propuesta ${P.numero} · Portal de Autogestión y Bots WhatsApp`, W - M, 15.5, { align: 'right' });
        color('setDrawColor', C.line); doc.setLineWidth(0.2); doc.line(M, 22, W - M, 22);
        doc.line(M, H - 14, W - M, H - 14);
        font('normal', 7.5, C.muted);
        doc.text('Documento confidencial preparado exclusivamente para Clínica MedicalCenter', M, H - 9);
        doc.text(`Página ${i} de ${n}`, W - M, H - 9, { align: 'right' });
    }

    doc.save(`Propuesta-MedicalCenter-${P.numero}.pdf`);

    /* ---------- dibujos vectoriales ---------- */
    function drawArchitecture() {
        const h = 62; ensure(h + 4);
        const x0 = M, top = y;
        color('setFillColor', C.tint); color('setDrawColor', C.line); doc.roundedRect(x0, top, CW, h, 3, 3, 'FD');
        const box = (x, yy, w, hh, title, sub, fill = C.white, tc = C.navy) => {
            color('setFillColor', fill); color('setDrawColor', C.line); doc.roundedRect(x, yy, w, hh, 1.6, 1.6, 'FD');
            font('bold', 7.5, tc); doc.text(title, x + 2.5, yy + 4.2);
            if (sub) { font('normal', 6.3, tc === C.white ? [215, 245, 229] : C.muted); doc.text(sub, x + 2.5, yy + 7.6); }
        };
        const label = (x, yy, t) => { font('bold', 6, C.muted); doc.text(t, x, yy); };
        // canales
        label(x0 + 5, top + 7, 'CANALES');
        ['Portal Pacientes|Web · PWA', 'Portal Médicos|Web · PWA', 'Administración|Red interna / VPN', 'Bots WhatsApp|WhatsApp Cloud API', 'Bot de llamadas IA|Voz · opcional']
            .forEach((s, i) => { const [a, b] = s.split('|'); box(x0 + 5, top + 10 + i * 9.6, 40, 8.4, a, b); });
        // núcleo
        const cx = x0 + 60;
        color('setFillColor', C.mint); color('setDrawColor', [159, 210, 181]); doc.setLineDashPattern([1, 1], 0);
        doc.roundedRect(cx, top + 5, 54, 52, 2.5, 2.5, 'FD'); doc.setLineDashPattern([], 0);
        label(cx + 3, top + 10, 'SERVIDOR MEDICALCENTER · UBUNTU');
        box(cx + 3, top + 13, 48, 10, 'Nginx · HTTPS', 'TLS 1.3 · límite de peticiones');
        box(cx + 3, top + 26, 48, 12, 'API / Orquestador', 'Java o Python · Roles · Reglas · Auditoría', C.dark, C.white);
        box(cx + 3, top + 41, 23, 11, 'Reintentos', 'En la aplicación');
        box(cx + 28, top + 41, 23, 11, 'PostgreSQL', 'Datos propios');
        // sistemas
        const sx = x0 + CW - 50;
        label(sx, top + 7, 'SISTEMAS INTEGRADOS');
        ['Medicaltec|Pacientes · agendas · ventas', 'Radoffice|Imagenología', 'Interlab|Laboratorio (vía Medicaltec)', 'SBA|Facturación electrónica', 'Banco|Pagos con QR']
            .forEach((s, i) => { const [a, b] = s.split('|'); box(sx, top + 10 + i * 9.6, 45, 8.4, a, b); });
        // flechas
        color('setDrawColor', C.green); color('setFillColor', C.green); doc.setLineWidth(0.5);
        [[x0 + 46, cx - 1], [cx + 55, sx - 1]].forEach(([a, b]) => {
            doc.line(a, top + 32, b - 2, top + 32);
            doc.triangle(b - 2.5, top + 30.6, b - 2.5, top + 33.4, b, top + 32, 'F');
        });
        doc.setLineWidth(0.2);
        y = top + h + 6;
    }

    function drawPipelines() {
        const names = Object.keys(P.crm.pipelines), rowH = 15;
        ensure(names.length * rowH + 4);
        names.forEach((name, r) => {
            const stages = P.crm.pipelines[name], top = y + r * rowH;
            font('bold', 8.5, C.navy); doc.text(name, M, top + 6.5);
            const x0 = M + 26, w = (CW - 26) / stages.length;
            stages.forEach((st, i) => {
                const x = x0 + i * w, last = i === stages.length - 1;
                color('setFillColor', last ? C.green : i === 0 ? C.mint : [238, 243, 240]);
                // flecha de etapa
                doc.lines([[w - 3, 0], [3, 5], [-3, 5], [-(w - 3), 0], [3, -5]], x, top + 1, [1, 1], 'F', true);
                font('bold', 6.8, last ? C.white : C.navy);
                const lines = doc.splitTextToSize(st, w - 7);
                doc.text(lines, x + w / 2 + 1, top + 6 - (lines.length - 1) * 1.4, { align: 'center', baseline: 'middle' });
            });
        });
        y += names.length * rowH + 2;
        para('Cada pipeline se configura desde el CRM: nombre, etapas, colores, responsables y reglas de asignación. Las oportunidades se mueven entre etapas arrastrándolas.', { size: 8.5, c: C.muted });
    }

    function drawGantt() {
        const rows = P.gantt, Q = P.meses * 2, labelW = 62, rowH = 6.6;
        const tw = CW - labelW, qw = tw / Q, h = 10 + rows.length * rowH;
        ensure(h + 4);
        const top = y, tx = M + labelW;
        // escala
        for (let m = 0; m < P.meses; m++) {
            const x = tx + m * 2 * qw;
            color('setFillColor', m % 2 ? C.white : C.tint); doc.rect(x, top, 2 * qw, h, 'F');
            font('bold', 7, C.muted); doc.text(`Mes ${m + 1}`, x + qw, top + 4.5, { align: 'center' });
        }
        color('setDrawColor', C.line); doc.line(M, top + 7, M + CW, top + 7);
        rows.forEach(([t, a, b], i) => {
            const ry = top + 10 + i * rowH;
            font('normal', 8, C.ink); doc.text(clean(t), M, ry + 3.4);
            const last = i >= rows.length - 2;
            color('setFillColor', last ? C.navy : C.green);
            doc.roundedRect(tx + (a - 1) * qw + 0.4, ry, (b - a + 1) * qw - 0.8, 4.6, 1.4, 1.4, 'F');
        });
        y = top + h + 6;
    }
}

function textOf2(root, sel) { return clean(root.querySelector(sel)?.textContent || ''); }


document.getElementById('btn-pdf').addEventListener('click', async (e) => {
    const btn = e.currentTarget, label = btn.querySelector('span');
    if (!window.jspdf) { label.textContent = 'Sin conexión'; return; }
    btn.disabled = true; label.textContent = 'Generando…';
    try { await generarPDF(); label.textContent = 'PDF'; }
    catch (err) { console.error(err); label.textContent = 'Error'; }
    finally { btn.disabled = false; setTimeout(() => { label.textContent = 'PDF'; }, 2500); }
});
