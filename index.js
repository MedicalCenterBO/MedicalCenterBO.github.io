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
        ['Bots WhatsApp y de voz', 'Bots de WhatsApp con precio fijo por bot y bot de llamadas con IA opcional.'],
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
        ['IA conversacional (bots)', 'API de OpenAI', 'Servicio por consumo'],
        ['Bot de llamadas IA (opcional)', 'Telefonía SIP + reconocimiento de voz, modelo de IA y voz sintética en español', 'Servicios por consumo'],
    ],

    integraciones: {
        'Medicaltec': { rol: 'Fuente principal de pacientes, agendas y ventas',
            ops: ['Búsqueda y vinculación de pacientes sin duplicados', 'Especialidades, médicos, sedes, servicios y tarifas', 'Agendas, cupos, bloqueos y disponibilidad', 'Reserva, reprogramación, confirmación y cancelación', 'Registro de ventas y transacciones pagadas', 'Órdenes de laboratorio (puente hacia Interlab)'] },
        'Radoffice': { rol: 'Resultados de imagenología',
            ops: ['Consulta HTTP a Radoffice que devuelve el enlace del estudio', 'Informe e imágenes mostrados en un visor embebido (iframe) dentro del portal', 'Solo estudios validados y habilitados para entrega', 'Verificación de que el paciente es el titular del estudio'] },
        'Interlab': { rol: 'Resultados de laboratorio a través de Medicaltec',
            ops: ['Órdenes y resultados disponibles', 'Visualización y descarga de informes', 'Fechas, exámenes y estados', 'Solo resultados validados y autorizados'] },
        'SBA': { rol: 'Facturación electrónica',
            ops: ['Captura y validación de NIT/CI y razón social', 'Emisión solo con el pago confirmado', 'Facturas de las empresas de Medical y de los médicos', 'Vínculo factura–paciente–pago–servicio y regularización'] },
        'Banco / Pasarela': { rol: 'Cobros con QR',
            ops: ['QR por transacción con vencimiento', 'Confirmación por webhook autenticado y consulta de respaldo', 'Estados pendiente, confirmado, rechazado y vencido', 'Conciliación y reporte de diferencias'] },
        'WhatsApp': { rol: 'Bots y notificaciones',
            ops: ['Consulta de disponibilidad y gestión de citas', 'Confirmaciones, recordatorios y avisos de cambios', 'Avisos de resultados, pagos y facturas', 'Validación de identidad y enlaces seguros al portal'] },
        'Llamadas IA': { rol: 'Agente de voz con inteligencia artificial (opcional)',
            ops: ['Llamadas salientes de confirmación y recordatorio', 'Atención de llamadas entrantes 24/7', 'Reserva y reprogramación en Medicaltec', 'Derivación a un operador y transcripción de cada llamada'] },
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
        ['Bots de WhatsApp y de llamadas', 9, 13],
        ['CRM (si se contrata)', 10, 14],
        ['Ajustes y validación con MedicalCenter', 12, 14],
        ['Puesta en producción', 14, 15],
        ['Capacitación TI y acompañamiento', 15, 16],
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
        ['5', 'Integración con Radoffice', 'dep', 'Radoffice devuelve por HTTP el enlace del estudio, que el portal muestra en un visor embebido.'],
        ['6', 'Integración con Interlab a través de Medicaltec', 'dep', 'Depende de la disponibilidad de resultados vía Medicaltec.'],
        ['7', 'Bots de WhatsApp', 'dep', 'Sobre la cuenta de WhatsApp Business de MedicalCenter; plantillas sujetas a aprobación de Meta.'],
        ['8', 'Pagos mediante QR', 'dep', 'Pago con QR. Requiere convenio y API del banco que elija MedicalCenter. El pago con tarjeta no está incluido.'],
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
        'La oferta incluye la coordinación con esos proveedores. Si alguno requiere adecuaciones con costo, se cotizan por separado antes de ejecutar.',
        'MedicalCenter habilita una cuenta de la API de OpenAI para los bots de WhatsApp. Solo se envía la información necesaria para cada conversación, sin datos clínicos innecesarios.',
        'MedicalCenter provee la cuenta de WhatsApp Business verificada en Meta Business Manager.',
        'MedicalCenter gestiona el convenio con el banco o la pasarela de pagos y habilita sus credenciales.',
        'Un referente funcional por área valida los entregables en un máximo de 3 días hábiles.',
        'Si se contrata el bot de llamadas, MedicalCenter provee el número telefónico o troncal SIP y autoriza el uso de servicios externos de voz e IA.',
    ],

    exclusiones: [
        'Costos, licencias o comisiones de terceros (Meta, OpenAI, banco), que se pagan directamente al proveedor del servicio.',
        'Hardware, servidores y licencias de sistema operativo.',
        'Monitoreo, observabilidad y respaldos, que se realizan con la infraestructura del datacenter de MedicalCenter.',
        'Capacitación a usuarios finales (médicos, recepción, caja); el personal de TI capacitado la replica.',
        'Adecuaciones o cambios internos en Medicaltec, Radoffice, Interlab o SBA, que se cotizan por separado si fueran necesarios.',
        'Pagos con tarjeta de crédito o débito.',
        'Aplicaciones nativas en tiendas; el portal funciona como PWA.',
        'Funcionalidades fuera del alcance aprobado, que se cotizan por horas.',
    ],

    // [componente, importe, descripción, a dónde lleva "Ver", grupo de la lista de selección]
    precios: [
        ['Portal de pacientes', 18000, 'Registro, identidad, citas, resultados, pagos, historial y perfil', { ir: '#portal', tab: 'paciente' }, 'Portal de autogestión'],
        ['Portal de médicos', 15000, 'Agenda por día, semana y mes; bloqueos, cupos y estados', { ir: '#portal', tab: 'medico' }, 'Portal de autogestión'],
        ['Módulo administrativo', 18000, 'Usuarios y roles, parámetros, transacciones, reprocesos, auditoría y conciliación', { ir: '#portal', tab: 'admin' }, 'Portal de autogestión'],
        ['Integración Medicaltec', 17000, 'Conectores, reintentos, concurrencia y matriz de operaciones', { ir: '#arquitectura', sys: 'Medicaltec' }, 'Integraciones'],
        ['Integración Radoffice', 4000, 'Consulta HTTP que devuelve el enlace del estudio, mostrado en un visor embebido', { ir: '#arquitectura', sys: 'Radoffice' }, 'Integraciones'],
        ['Integración Interlab vía Medicaltec', 7000, 'Órdenes y resultados de laboratorio con descarga de informes', { ir: '#arquitectura', sys: 'Interlab', req: 'p3' }, 'Integraciones'],
        ['Pagos QR', 10000, 'QR por transacción, confirmación del banco, estados y conciliación', { ir: '#portal', tab: 'pago' }, 'Integraciones'],
        ['Facturación electrónica SBA', 10000, 'Emisión de la factura con el pago confirmado y regularización', { ir: '#arquitectura', sys: 'SBA' }, 'Integraciones'],
        ['Plataforma de WhatsApp', 9000, 'Conexión Cloud API, IA conversacional (OpenAI), validación de identidad, notificaciones y enlaces seguros', { ir: '#bots' }, 'WhatsApp, voz e IA'],
        ['Instalación y configuración en Ubuntu', 11000, 'Servidor, HTTPS, configuración de seguridad e inicio automático de servicios', { ir: '#infraestructura' }, 'Instalación y entrega'],
        ['Puesta en producción y acompañamiento inicial', 9000, 'Salida a producción controlada y acompañamiento posterior', { ir: '#cronograma' }, 'Instalación y entrega'],
        ['Documentación, capacitación TI y entrega del código fuente', 5000, 'Manuales en español, 26 horas de capacitación al personal de TI y repositorio completo', { ir: '#documentacion' }, 'Instalación y entrega'],
    ],

    // Precio fijo por cada bot de WhatsApp. [nombre, descripción, icono, incluido por defecto]
    bots: {
        precio: 10000,
        tipos: [
            ['Agendamiento de citas', 'Consulta disponibilidad y reserva, reprograma o cancela citas en Medicaltec.', 'cal', true],
            ['Resultados', 'Consulta de resultados de laboratorio e imagenología con validación de identidad y enlace seguro.', 'lab', false],
            ['Pagos y facturación', 'Envía el QR de pago, confirma el cobro y entrega la factura electrónica.', 'pay', false],
            ['Atención e información', 'Especialidades, médicos, sedes, horarios y preparación de estudios, con derivación a un operador.', 'info', false],
            ['Agenda para médicos', 'El médico consulta su agenda del día, bloquea horarios y recibe avisos de cambios.', 'doc', false],
            ['Encuestas de satisfacción', 'Encuesta breve después de la atención, con resultados en el módulo administrativo.', 'star', false],
        ],
    },

    llamadas: {
        precio: 25000,
        descripcion: 'Un agente de voz que llama y atiende a los pacientes en español natural, conectado a las mismas agendas de Medicaltec que el portal y los bots de WhatsApp.',
        funciones: [
            'Llamadas salientes para confirmar y recordar citas.',
            'Atención de llamadas entrantes 24/7: disponibilidad, reserva y reprogramación.',
            'Validación de identidad antes de dar información sensible.',
            'Derivación a un operador humano cuando el paciente lo pide.',
            'Grabación, transcripción y resumen de cada llamada en el módulo administrativo.',
        ],
    },

    opcionales: [],

    // CRM de pacientes y ventas (módulo ofrecido como opcional)
    crm: {
        precio: 45000,
        queEs: 'Un CRM (gestión de la relación con pacientes) reúne en un solo lugar a cada persona que escribe por WhatsApp, llama o consulta en el portal, y convierte cada consulta en una oportunidad con dueño, etapa, valor y seguimiento hasta que se transforma en una cita, un estudio o una cirugía agendada.',
        porQue: [
            ['Consultas que se pierden', 'Hoy las conversaciones de WhatsApp quedan dispersas en celulares y chats individuales, sin seguimiento ni historial compartido.'],
            ['Sin visibilidad del embudo', 'No se sabe cuántas personas consultaron, cuántas recibieron precio y cuántas terminaron agendando.'],
            ['Seguimiento manual', 'Presupuestos de cirugías, chequeos y convenios dependen de la memoria de cada asesor.'],
            ['Respuesta lenta fuera de horario', 'Un paciente que escribe de noche espera hasta el día siguiente y muchas veces se va con otra clínica.'],
        ],
        pasos: [
            ['Llega el contacto', 'Un paciente escribe por WhatsApp, llama o deja sus datos en el portal. Se crea la oportunidad automáticamente.'],
            ['Atiende la IA', 'El asistente responde al instante, informa precios y horarios, califica el interés y agenda si el paciente lo desea.'],
            ['Derivación humana', 'Si el paciente prefiere hablar con una persona, o la IA lo considera necesario, la conversación pasa a un asesor con todo el historial.'],
            ['Seguimiento en el embudo', 'El asesor arrastra la oportunidad por las etapas, agrega notas y responde por WhatsApp desde la misma ficha.'],
            ['Cierre', 'La cita, el estudio o la cirugía quedan registrados en Medicaltec y el CRM mide la conversión por canal y por asesor.'],
        ],
        funciones: [
            ['Pipelines parametrizables', 'Embudos ilimitados (consultas, cirugías, chequeos, convenios con empresas) con etapas, colores y reglas propias.'],
            ['Arrastrar y soltar', 'Las oportunidades se mueven entre etapas arrastrándolas; el valor de cada etapa se recalcula al instante.'],
            ['Chat de WhatsApp en tiempo real', 'Cada oportunidad muestra la conversación en vivo y permite responder desde el CRM.'],
            ['Atención por IA y derivación humana', 'La IA atiende 24/7 y, con un clic o a pedido del paciente, un asesor toma la conversación.'],
            ['Notas y ficha de contacto', 'Notas internas, datos de contacto, paciente vinculado en Medicaltec e historial de citas.'],
            ['Asignación y reportes', 'Reparto de oportunidades por asesor, tareas de seguimiento y reportes de conversión del embudo.'],
            ['Calendario de citas', 'Vista semanal de las citas agendadas en Medicaltec, con filtros por especialidad y médico. La IA lo consulta para responder por cupos y citas.'],
        ],
        calendario: {
            descripcion: 'El CRM incluye un calendario con todas las citas agendadas, sincronizado con Medicaltec. Asesores y recepción lo consultan por semana, especialidad o médico, y el asistente IA lo usa para responder a los pacientes y al personal con información real.',
            puntos: [
                'Citas por día y semana, con estado: confirmada, pendiente o atendida.',
                'Filtros por especialidad y médico, y búsqueda por paciente.',
                'Detalle de cada cita con el canal por el que se agendó (WhatsApp, llamada o portal).',
                'La IA responde preguntas como "¿qué cupos hay el jueves en Neurología?" o "¿cuál es la próxima cita de un paciente?".',
                'La IA solo consulta la información; reservar o cambiar citas sigue las reglas y permisos de Medicaltec.',
            ],
        },
        pipelines: {
            'Consultas': ['Nuevo', 'Atendido por IA', 'Con asesor', 'Cotizado', 'Agendado'],
            'Cirugías': ['Interesado', 'Evaluación médica', 'Presupuesto enviado', 'Negociación', 'Programada'],
            'Empresas': ['Prospecto', 'Contactado', 'Propuesta', 'Negociación', 'Convenio firmado'],
        },
    },

    // Una cuota igual por mes, pagada contra la demostración del avance del mes.
    // [entregable demostrado, avance acumulado del proyecto en %]
    cuotas: [
        ['Relevamiento concluido, prototipos navegables y matriz de operaciones de integración.', 12],
        ['Diseño UX aprobado, arquitectura e instalación base en los servidores de MedicalCenter.', 25],
        ['Conexión con Medicaltec: pacientes, agendas y registro de citas en ambiente de pruebas.', 38],
        ['Portal de pacientes: registro, identidad y reserva de citas funcionando en pruebas.', 50],
        ['Portal de médicos y administración; resultados de Radoffice e Interlab visibles.', 63],
        ['Pagos QR, facturación SBA y primeros bots de WhatsApp operando en pruebas.', 75],
        ['Bots completos y bot de llamadas (si aplica), ajustes y validación con MedicalCenter.', 88],
        ['Puesta en producción, capacitación TI y entrega del código fuente y la documentación.', 100],
    ],

    planes: [
        { nombre: 'Esencial', precio: 2250, horas: 20, items: ['Actualizaciones de seguridad', 'Soporte en horario hábil', 'Críticos: respuesta en 4 h'] },
        { nombre: 'Profesional', precio: 3750, horas: 40, destacado: true, items: ['Todo lo del plan Esencial', 'Críticos 24/7: respuesta en 1 h', 'Informe mensual', 'Ajustes evolutivos menores'] },
        { nombre: 'Integral', precio: 6000, horas: 70, items: ['Todo lo del plan Profesional', 'Guardia técnica dedicada', 'Mejoras evolutivas planificadas'] },
    ],
    horaExtra: 140,

    terceros: [
        ['IA conversacional de los bots de WhatsApp', 'API de OpenAI', 'Costo por consumo (tokens) según la tarifa vigente de OpenAI. Se usa para entender y responder mensajes en lenguaje natural.'],
        ['Mensajes de WhatsApp', 'Meta', 'Por mensaje de plantilla según la tarifa vigente de Meta; los mensajes de servicio dentro de 24 h no tienen costo.'],
        ['Cobro con QR', 'Banco elegido', 'Comisión por transacción según convenio (usualmente 0 %–1,5 %).'],
        ['Llamadas con IA (si se contrata)', 'Operador telefónico y servicios de voz e IA', 'Costo por minuto según consumo: telefonía, reconocimiento y síntesis de voz, y modelo de IA.'],
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
// importes de las cuotas mensuales: iguales, la última absorbe el redondeo
function cuotas(total) {
    const n = P.cuotas.length, c = Math.round((total / n) * 100) / 100;
    return P.cuotas.map((_, i) => (i < n - 1 ? c : Math.round((total - c * (n - 1)) * 100) / 100));
}

// lista de selección: cada ítem con su clave, importe, destino de "Ver", grupo y si viene marcado
const ITEMS = [
    ...P.precios.map(([t, v, d, ver, g], i) => ({ key: 'p' + i, tipo: 'base', t, v, d, ver, g, on: true })),
    ...P.bots.tipos.map(([t, d, , on], i) => ({ key: 'b' + i, tipo: 'bot', t: 'Bot de WhatsApp: ' + t, nombre: t, v: P.bots.precio, d, ver: { ir: '#bots', bot: i, req: 'p8' }, g: 'WhatsApp, voz e IA', on })),
    { key: 'voz', tipo: 'voz', t: 'Bot de llamadas con IA', v: P.llamadas.precio, d: 'Agente de voz para confirmaciones, recordatorios y atención 24/7', ver: { ir: '.voice' }, g: 'WhatsApp, voz e IA', on: false },
    { key: 'crm', tipo: 'crm', t: 'CRM de pacientes y ventas', v: P.crm.precio, d: 'Pipelines, arrastrar y soltar, chat de WhatsApp en tiempo real, calendario de citas consultable por la IA y derivación humana', ver: { ir: '#crm', req: 'p8' }, g: 'CRM', on: false },
];
const totalInicial = ITEMS.filter((i) => i.on).reduce((a, i) => a + i.v, 0);

// selección vigente (la usan la lista, el total y el PDF)
function seleccion() {
    const on = new Set($$('[data-item]').filter((c) => c.checked).map((c) => c.dataset.item));
    const items = ITEMS.filter((i) => on.has(i.key));
    return {
        items,
        bots: items.filter((i) => i.tipo === 'bot').map((i) => P.bots.tipos[+i.key.slice(1)]),
        llamadas: on.has('voz'),
        crm: on.has('crm'),
        opcionales: [],
        total: items.reduce((a, i) => a + i.v, 0),
    };
}

/* ---------- datos enlazados ---------- */
const binds = { numero: P.numero, fecha: P.fecha, validez: P.validez, proveedor: P.proveedor, contacto: P.contacto, meses: P.meses, garantia: P.garantiaMeses };
$$('[data-bind]').forEach((el) => { el.textContent = binds[el.dataset.bind]; });

/* ---------- contadores animados ---------- */
const counts = { total: totalInicial, meses: P.meses, garantia: P.garantiaMeses, codigo: 100 };
function countUp(el) {
    const target = counts[el.dataset.count], money = el.hasAttribute('data-money');
    const fmt = (v) => (money ? bs0(v) : Math.round(v));
    if (reduced) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
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

/* ---------- bots de WhatsApp y llamadas con IA ---------- */
const ICONS = {
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7 15h10"/>',
    pay: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v1M14 20h1M18 18h3v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    doc: '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0"/><path d="M17 3v4M15 5h4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;

$('#bot-unit').textContent = bs0(P.bots.precio);
html('#bot-grid', P.bots.tipos.map(([t, d, ico], i) =>
    `<article class="botc" id="bot-${i}">
     <span class="botc__top"><span class="botc__ico">${svg(ico)}</span></span>
     <b>${esc(t)}</b><small>${esc(d)}</small><span class="botc__price">${bs0(P.bots.precio)}</span></article>`).join(''));
$('#voice-desc').textContent = P.llamadas.descripcion;
$('#voice-price').textContent = bs0(P.llamadas.precio);
html('#voice-list', P.llamadas.funciones.map((f) => `<li>${esc(f)}</li>`).join(''));
html('.wave', Array.from({ length: 32 }, (_, i) => `<i style="--i:${i}"></i>`).join(''));

/* ---------- lista de selección y total ---------- */
const GRUPOS = [...new Set(ITEMS.map((i) => i.g))];
html('#checklist', GRUPOS.map((g) => {
    const list = ITEMS.filter((i) => i.g === g);
    return `<fieldset class="ckgroup"><legend><span>${esc(g)}</span><small data-sub="${esc(g)}"></small></legend>
        ${list.map((i) => `<div class="ck" data-row="${i.key}">
            <label class="ck__main"><input type="checkbox" data-item="${i.key}"${i.on ? ' checked' : ''}><span class="ck__box" aria-hidden="true"></span>
                <span class="ck__txt"><b>${esc(i.t)}</b><small>${esc(i.d)}</small><em class="ck__req" hidden></em></span></label>
            <button class="ck__ver" type="button" data-ver="${i.key}" aria-label="Ver la explicación de ${esc(i.t)}">Ver
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <span class="ck__v">${bs0(i.v)}</span>
        </div>`).join('')}
    </fieldset>`;
}).join(''));

// dependencias: un bot o el CRM necesitan la plataforma de WhatsApp; Interlab necesita Medicaltec
const box = (k) => $(`[data-item="${k}"]`);
function dependencias(changed) {
    ITEMS.forEach((i) => {
        const req = i.ver.req; if (!req) return;
        const need = box(req), me = box(i.key);
        if (changed === me && me.checked && !need.checked) need.checked = true;
        if (changed === need && !need.checked && me.checked) me.checked = false;
    });
    ITEMS.forEach((i) => {
        const req = i.ver.req, note = $(`[data-row="${i.key}"] .ck__req`);
        if (!req) return;
        note.hidden = false;
        note.textContent = 'Requiere: ' + ITEMS.find((x) => x.key === req).t;
    });
}

let shown = totalInicial;
function animateTo(el, from, to) {
    if (reduced) { el.textContent = bs(to); return; }
    const t0 = performance.now();
    const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / 500)), e = 1 - Math.pow(1 - k, 3);
        el.textContent = bs(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    clearTimeout(el._fin); el._fin = setTimeout(() => { el.textContent = bs(to); }, 600);
}
function recalc() {
    const sel = seleccion(), total = sel.total;
    $$('.ck').forEach((r) => r.classList.toggle('is-on', box(r.dataset.row).checked));
    GRUPOS.forEach((g) => {
        const sub = ITEMS.filter((i) => i.g === g && box(i.key).checked).reduce((a, i) => a + i.v, 0);
        $(`[data-sub="${g}"]`).textContent = sub ? bs0(sub) : 'Nada marcado';
    });

    animateTo($('#sum-total'), shown, total); shown = total;
    const parts = [`${sel.bots.length} bot${sel.bots.length === 1 ? '' : 's'} de WhatsApp`];
    if (sel.llamadas) parts.push('bot de llamadas IA');
    if (sel.crm) parts.push('CRM');
    $('#sum-note').textContent = 'Incluye ' + parts.join(' · ');
    $('#sum-count').textContent = `${sel.items.length} de ${ITEMS.length} componentes marcados`;
    const iva = total * P.iva, it = total * P.it;
    $('#t-net').textContent = bs(total - iva - it);
    $('#t-iva').textContent = bs(iva);
    $('#t-it').textContent = bs(it);
    const montos = cuotas(total);
    $('#mt-total').textContent = bs0(total);
    $('#mt-cuota').textContent = `${P.cuotas.length} cuotas de ${bs0(montos[0])}`;
    $('#cuota-n').textContent = `${P.cuotas.length} cuotas mensuales de`;
    $('#cuota-v').textContent = bs(montos[0]);
    html('#cuotas', P.cuotas.map(([t, pct], i) =>
        `<article class="cuota reveal in" style="--p:${pct}"><header><span class="cuota__mes">Mes ${i + 1}</span><b>${bs(montos[i])}</b></header>
         <p>${esc(t)}</p><div class="cuota__bar"><i></i></div><small>Avance del proyecto: <strong>${pct} %</strong></small></article>`).join(''));
}
$$('[data-item]').forEach((c) => c.addEventListener('change', () => { dependencias(c); recalc(); }));
$('#ck-rec').addEventListener('click', () => { ITEMS.forEach((i) => { box(i.key).checked = i.on; }); recalc(); });
$('#ck-all').addEventListener('click', () => { ITEMS.forEach((i) => { box(i.key).checked = true; }); recalc(); });
dependencias();
$('#sum-total').textContent = bs(totalInicial);
recalc();

/* ---------- "Ver": ir a la explicación y volver a la lista ---------- */
const backpill = $('#backpill');
let volverA = null;
function flash(el) {
    if (!el) return;
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 2200);
}
$$('[data-ver]').forEach((b) => b.addEventListener('click', () => {
    const it = ITEMS.find((i) => i.key === b.dataset.ver), v = it.ver;
    if (v.tab) showTab(v.tab);
    if (v.sys) showSys(v.sys);
    const dest = v.bot !== undefined ? $('#bot-' + v.bot) : v.tab ? $('.demo') : v.sys ? $('.arch') : $(v.ir);
    volverA = b.closest('.ck');
    dest.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: v.bot !== undefined || v.ir === '.voice' ? 'center' : 'start' });
    setTimeout(() => flash(v.sys ? $('#sys-detail') : dest), 450);
    backpill.hidden = false;
    requestAnimationFrame(() => backpill.classList.add('is-on'));
}));
backpill.addEventListener('click', () => {
    (volverA || $('#seleccion')).scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    flash(volverA);
    $('[data-item]', volverA || document)?.focus({ preventScroll: true });
    hideBack();
});
function hideBack() { backpill.classList.remove('is-on'); setTimeout(() => { backpill.hidden = true; }, 300); }
// en celular, barra fija con el total mientras se recorre la lista
const mobtotal = $('#mobtotal');
new IntersectionObserver((e) => mobtotal.classList.toggle('is-on', e[0].isIntersecting), { threshold: 0 }).observe($('#seleccion'));
$('#mt-go').addEventListener('click', () => $('.price__sum').scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' }));
// al volver a la lista por cuenta propia, se oculta el botón
new IntersectionObserver((e) => { if (e[0].isIntersecting && !backpill.hidden) hideBack(); }, { threshold: 0.35 }).observe($('#seleccion'));
$$('.go-list').forEach((a) => a.addEventListener('click', () => setTimeout(() => flash($('#seleccion')), 500)));

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
$$('.reveal, .gantt, .training, .lines, .cuotas').forEach((el) => io.observe(el));

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
