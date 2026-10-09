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
        ['Frontend', 'Portales de pacientes, médicos y administración, 100 % responsive y adaptados a tótems táctiles.'],
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
        ['Relevamiento y diseño UX del agendamiento y los tótems', 1, 2],
        ['Arquitectura e instalación base', 1, 2],
        ['Agendamiento sin registro y tótems táctiles', 2, 5],
        ['Integración Medicaltec', 2, 9],
        ['Relevamiento y diseño funcional / UX del resto del portal', 3, 5],
        ['Portal de pacientes: citas, resultados, pagos e historial', 5, 11],
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
        ['3.1', 'Registro, identidad, roles y recuperación de acceso', 'ok', 'Agendamiento sin registro: identificación por número de teléfono contra la base de Medicaltec o registro rápido con nombre y teléfono. Usuario y contraseña para consultar el calendario de citas.'],
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
        'Hardware (incluidos los tótems táctiles), servidores y licencias de sistema operativo.',
        'Monitoreo, observabilidad y respaldos, que se realizan con la infraestructura del datacenter de MedicalCenter.',
        'Capacitación a usuarios finales (médicos, recepción, caja); el personal de TI capacitado la replica.',
        'Adecuaciones o cambios internos en Medicaltec, Radoffice, Interlab o SBA, que se cotizan por separado si fueran necesarios.',
        'Pagos con tarjeta de crédito o débito.',
        'Aplicaciones nativas en tiendas; el portal funciona como PWA.',
        'Funcionalidades fuera del alcance aprobado, que se cotizan por horas.',
    ],

    // [componente, importe, descripción, a dónde lleva "Ver", grupo de la lista de selección]
    precios: [
        ['Portal de pacientes', 18000, 'Agendamiento sin registro desde cualquier dispositivo y tótems táctiles, identificación por teléfono, pago QR, calendario de citas con usuario y contraseña, resultados e historial', { ir: '#portal', tab: 'paciente' }, 'Portal de autogestión'],
        ['Portal de médicos', 15000, 'Ingreso con usuario y contraseña; calendario de citas por día, semana y mes; bloqueos, cupos y estados', { ir: '#portal', tab: 'medico' }, 'Portal de autogestión'],
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
            ['Atención integral', 'Un solo bot con agendamiento de citas, resultados, pagos y facturación, atención e información y agenda para médicos.', 'cal', true],
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

    // 12 cuotas mensuales iguales: las primeras se pagan contra la demostración del avance
    // del mes durante la implementación (meses); las restantes, con el portal en producción.
    // [entregable demostrado, avance acumulado del proyecto en %]
    cuotas: [
        ['Relevamiento y prototipos navegables del agendamiento sin registro y los tótems táctiles; instalación base en los servidores de MedicalCenter.', 12],
        ['Agendamiento sin registro en pruebas, también en el tótem: especialidad o médico, horarios activos, identificación por teléfono y registro rápido contra Medicaltec.', 25],
        ['Conexión con Medicaltec: agendas y registro de citas en ambiente de pruebas; diseño UX del resto del portal aprobado.', 38],
        ['Calendario de citas con usuario y contraseña para pacientes, historial y perfil funcionando en pruebas.', 50],
        ['Portal de médicos y administración; resultados de Radoffice e Interlab visibles.', 63],
        ['Pagos QR, facturación SBA y primeros bots de WhatsApp operando en pruebas.', 75],
        ['Bots completos y bot de llamadas (si aplica), ajustes y validación con MedicalCenter.', 88],
        ['Puesta en producción, capacitación TI y entrega del código fuente y la documentación.', 100],
        ['Portal en producción: operación estable y soporte de garantía.', 100],
        ['Portal en producción: operación estable y soporte de garantía.', 100],
        ['Portal en producción: operación estable y soporte de garantía.', 100],
        ['Portal en producción: operación estable y soporte de garantía.', 100],
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
const binds = { numero: P.numero, fecha: P.fecha, validez: P.validez, proveedor: P.proveedor, contacto: P.contacto, meses: P.meses, cuotas: P.cuotas.length, garantia: P.garantiaMeses };
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
    paciente: { path: '/agendar', user: 'Tótem Recepción', role: 'Sin registro', nav: ['Inicio', 'Agendar cita', 'Mis citas', 'Ingresar'] },
    cuenta: { path: '/mis-citas', user: 'María Rojas', role: 'Paciente', nav: ['Mis citas', 'Resultados', 'Pagos y facturas', 'Mi perfil'] },
    medico: { path: '/agenda', user: 'Dr. R. Salvatierra', role: 'Neurología', nav: ['Agenda', 'Bloqueos', 'Pacientes del día', 'Mis facturas'] },
    admin: { path: '/admin/transacciones', user: 'Admin. Portal', role: 'Administrador', nav: ['Transacciones', 'Usuarios y roles', 'Parámetros', 'Conciliación', 'Auditoría'] },
    pago: { path: '/agendar/pago', user: 'María Rojas', role: 'Paciente', nav: ['Agendar cita', 'Especialidades', 'Médicos', 'Ingresar'] },
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

/* ---------- agendar cita sin registro: recorrido guiado (datos de ejemplo) ---------- */
const BK = {
    especialidades: ['Medicina general', 'Pediatría', 'Ginecología', 'Neurología', 'Cardiología', 'Traumatología', 'Imagenología', 'Laboratorio'],
    medicos: [
        ['Dr. Ricardo Salvatierra', 'Neurología'],
        ['Dra. Carla Méndez', 'Pediatría'],
        ['Dr. Jorge Áñez', 'Medicina general'],
        ['Dra. Lucía Arteaga', 'Ginecología'],
        ['Dr. Marcelo Rivero', 'Cardiología'],
        ['Dra. Paola Justiniano', 'Traumatología'],
    ],
    dias: [['Vie', '09', []], ['Sáb', '10', []], ['Lun', '12', [['6', '09:15'], ['7', '09:30'], ['8', '09:45'], ['9', '10:00']]], ['Mar', '13', [['3', '08:30'], ['4', '08:45']]]],
    servicios: [['Consulta médica', 250], ['Electroencefalograma', 350], ['Electromiografía', 420], ['Doppler transcraneal', 380]],
    pasos: ['Inicio', 'Cómo agendar', 'Especialidades', 'Médicos', 'Horarios', 'Servicios', 'Teléfono', 'Orden', 'Confirmar', 'Pago QR'],
};
const bk = { paso: 0, esp: null, fromEsp: false, med: 0, dia: 0, ficha: null, svc: new Set([0]), conocido: true, pagado: false };
const ini = (n) => n.replace(/^Dr(a)?\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2);
const chev = '<i class="bk__chev" aria-hidden="true">›</i>';
const bkTotal = () => [...bk.svc].reduce((a, i) => a + BK.servicios[i][1], 0);
const bkMed = () => BK.medicos[bk.med];
const bkFicha = () => BK.dias[bk.dia][2].find((f) => f[0] === bk.ficha);

const BK_VISTAS = [
    // 1 · inicio
    () => `<div class="bk__user"><i>?</i><div><b>Sin usuario</b><a data-bk="ingresar">Iniciar sesión →</a></div></div>
        <div class="bk__hero"><p>¿Necesita un médico?</p><button class="bk__btn" data-bk="go" data-to="1">Reservar ficha</button></div>
        <p class="bk__h">Servicios</p>
        <div class="bk__icons"><span><i>🧪</i>Laboratorio</span><span><i>🩻</i>Imagenología</span><span><i>📄</i>Resultados</span></div>
        <p class="bk__h">Sedes</p>
        <div class="bk__item bk__item--static"><b>Sede Cristo Redentor</b><small>Av. Cristo Redentor · Santa Cruz de la Sierra</small></div>`,
    // 2 · cómo agendar
    () => `<p class="bk__lead">Para reservar su ficha puede elegir el método que le sea más cómodo:</p>
        <button class="bk__item" data-bk="go" data-to="2"><b>Especialidades</b>${chev}</button>
        <button class="bk__item" data-bk="medicos"><b>Médicos</b>${chev}</button>`,
    // 3 · especialidades
    () => `<div class="bk__search">🔍 Buscar especialidad…</div>
        ${BK.especialidades.map((e) => `<button class="bk__item" data-bk="esp" data-v="${esc(e)}"><b>${esc(e)}</b>${chev}</button>`).join('')}`,
    // 4 · médicos
    () => {
        const l = BK.medicos.map((m, i) => [m, i]).filter(([m]) => !bk.esp || m[1] === bk.esp);
        return `<div class="bk__search">🔍 Buscar médico…${bk.esp ? ` <span class="pill pill--ok">${esc(bk.esp)}</span>` : ''}</div>
        ${l.map(([[n, e], i]) => `<button class="bk__item bk__doc" data-bk="med" data-v="${i}"><i>${ini(n)}</i><span><b>${esc(n)}</b><small>${esc(e)}</small></span>${chev}</button>`).join('')}`;
    },
    // 5 · horarios
    () => {
        const [n, e] = bkMed(), fichas = BK.dias[bk.dia][2];
        return `<div class="bk__doc bk__doc--head"><i>${ini(n)}</i><span><b>${esc(n)}</b><small>${esc(e)}</small></span></div>
        <p class="bk__h">Horario normal de atención</p>
        <div class="bk__hours">${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((d) => `<span><b>${d}</b>08:00 a 12:00</span>`).join('')}</div>
        <p class="bk__h">Fechas disponibles</p>
        <div class="bk__days">${BK.dias.map(([d, n], i) => `<button class="${i === bk.dia ? 'on' : ''}" data-bk="dia" data-v="${i}"><small>${d}</small><b>${n}</b></button>`).join('')}</div>
        <p class="bk__h">Seleccione su ficha</p>
        ${fichas.length ? `<div class="bk__fichas">${fichas.map(([f, h]) => `<button class="${bk.ficha === f ? 'on' : ''}" data-bk="ficha" data-v="${f}"><small>Ficha</small><b>${f}</b><span>🕘 ${h}</span></button>`).join('')}</div>`
        : '<div class="bk__empty">No hay fichas habilitadas para esta fecha. Elija otra fecha.</div>'}`;
    },
    // 6 · servicios
    () => `<div class="bk__search">🔍 Buscar servicio…</div>
        ${BK.servicios.map(([t, v], i) => `<label class="bk__svc"><input type="checkbox" data-bk="svc" data-v="${i}"${bk.svc.has(i) ? ' checked' : ''}><b>${esc(t)}</b><span>${bs0(v)}</span></label>`).join('')}
        <div class="bk__foot"><div><small>${bk.svc.size} servicio(s)</small><b>${bs(bkTotal())}</b></div><button class="bk__btn" data-bk="go" data-to="6"${bk.svc.size ? '' : ' disabled'}>Solicitar</button></div>`,
    // 7 · teléfono
    () => `<div class="bk__notice">Para reservar ingrese su número de celular. No necesita crear una cuenta.</div>
        <label class="bk__field"><span>Número de celular</span><input value="${bk.conocido ? '71234567' : '76543210'}" inputmode="tel"></label>
        ${bk.conocido
        ? '<div class="bk__found">✓ Encontramos su registro: <b>María Rojas</b></div>'
        : '<label class="bk__field"><span>Nombre completo</span><input placeholder="Nombre y apellidos"></label><div class="bk__found bk__found--new">Número nuevo: lo registramos con su nombre y teléfono.</div>'}
        <button class="bk__btn bk__btn--wide" data-bk="go" data-to="7">Continuar</button>
        <p class="bk__alt"><a data-bk="nuevo">${bk.conocido ? 'Probar con un número nuevo' : 'Probar con un número registrado'}</a> · <a data-bk="ingresar">Ingresar con usuario y contraseña</a></p>`,
    // 8 · orden
    () => {
        const [n, e] = bkMed(), [d, num] = BK.dias[bk.dia], f = bkFicha();
        return `<p class="bk__h">Paciente</p>
        <div class="bk__doc bk__doc--head"><i>${bk.conocido ? 'MR' : 'NP'}</i><span><b>${bk.conocido ? 'María Rojas' : 'Nuevo paciente'}</b><small>Cel. ${bk.conocido ? '71234567' : '76543210'}</small></span></div>
        <p class="bk__h">Cita programada</p>
        <div class="bk__doc bk__doc--head"><i>${ini(n)}</i><span><b>${esc(n)}</b><small>${esc(e)}</small></span><em>${d} ${num} oct<br>${f[1]}</em></div>
        <p class="bk__h">Datos de facturación</p>
        <div class="bk__grid2"><label class="bk__field"><span>NIT / CI</span><input value="1234567"></label><label class="bk__field"><span>Razón social</span><input value="${bk.conocido ? 'Rojas' : ''}"></label></div>
        <label class="bk__field"><span>Correo para la factura</span><input value="${bk.conocido ? 'maria.rojas@correo.com' : ''}" placeholder="correo@ejemplo.com"></label>
        <button class="bk__btn bk__btn--wide" data-bk="go" data-to="8">Continuar</button>`;
    },
    // 9 · confirmar
    () => {
        const [n, e] = bkMed(), [d, num] = BK.dias[bk.dia], f = bkFicha();
        return `<div class="bk__ticket"><div class="bk__ticket-doc"><i>${ini(n)}</i><b>${esc(n)}</b><small>${esc(e)}</small></div>
        <ul><li>👤 ${bk.conocido ? 'María Rojas' : 'Nuevo paciente'}</li><li>📅 ${d} ${num} de octubre</li><li>🕘 ${f[1]}</li><li>🏥 Sede Cristo Redentor</li></ul>
        <div class="bk__ticket-tot"><b>Ficha ${f[0]}</b><small>Total</small><strong>${bs(bkTotal())}</strong></div></div>
        <div class="bk__warn">Revise los datos del paciente y de la ficha antes de pagar.</div>
        <div class="bk__tip">Preséntese 15 minutos antes de su cita.</div>
        <button class="bk__btn bk__btn--wide" data-bk="go" data-to="9">Pagar con QR</button>`;
    },
    // 10 · pago QR
    () => bk.pagado
        ? `<div class="bk__done"><i>✓</i><b>Cita agendada</b><p>Ficha ${bkFicha()[0]} · ${BK.dias[bk.dia][0]} ${BK.dias[bk.dia][1]} oct · ${bkFicha()[1]}<br>La factura llega por correo y la confirmación por WhatsApp.</p>
            <button class="bk__btn" data-bk="reset">Agendar otra cita</button></div>`
        : `<p class="bk__lead bk__lead--c">Para completar la reserva de su ficha, pague ${bs(bkTotal())} escaneando el código QR.</p>
        <div class="bk__qr"><div class="qr" aria-hidden="true"></div><small>Vence en 15 minutos · Ref. MC-2026-004812</small></div>
        <div class="bk__qrbtns"><button class="mini">Descargar</button><button class="mini">Compartir</button></div>
        <button class="bk__btn bk__btn--wide" data-bk="pagar">Ya realicé el pago</button>`,
];

function bkRender() {
    const n = BK.pasos.length;
    html('#bk', `<div class="bk__bar">${bk.paso ? '<button class="bk__back" data-bk="back" aria-label="Atrás">‹</button>' : ''}<b>${BK.pasos[bk.paso]}</b><small>Agendar sin registro</small></div>
        <div class="bk__prog"><i style="width:${((bk.paso + 1) / n) * 100}%"></i></div>
        <div class="bk__body">${BK_VISTAS[bk.paso]()}</div>`);
}
$('#bk').addEventListener('click', (e) => {
    const t = e.target.closest('[data-bk]');
    if (!t || t.dataset.bk === 'svc') return;
    const v = t.dataset.v, go = (p) => { bk.paso = p; };
    ({
        go: () => go(+t.dataset.to),
        back: () => go(bk.paso === 3 && !bk.fromEsp ? 1 : bk.paso - 1),
        medicos: () => { bk.esp = null; bk.fromEsp = false; go(3); },
        esp: () => { bk.esp = v; bk.fromEsp = true; go(3); },
        med: () => { bk.med = +v; bk.dia = 0; bk.ficha = null; go(4); },
        dia: () => { bk.dia = +v; bk.ficha = null; },
        ficha: () => { bk.ficha = v; go(5); },
        nuevo: () => { bk.conocido = !bk.conocido; },
        ingresar: () => showTab('cuenta'),
        pagar: () => { bk.pagado = true; },
        reset: () => { Object.assign(bk, { paso: 0, esp: null, fromEsp: false, med: 0, dia: 0, ficha: null, svc: new Set([0]), conocido: true, pagado: false }); },
    })[t.dataset.bk]?.();
    if (t.dataset.bk !== 'ingresar') bkRender();
});
$('#bk').addEventListener('change', (e) => {
    const t = e.target.closest('[data-bk=svc]');
    if (!t) return;
    t.checked ? bk.svc.add(+t.dataset.v) : bk.svc.delete(+t.dataset.v);
    bkRender();
});
bkRender();

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
     <b>${esc(t)}</b><small>${esc(d)}</small></article>`).join(''));
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

/* ---------- chat animado de WhatsApp: el agente IA atiende como una persona ---------- */
// ['in'|'out', texto] · ['show', id de tarjeta flotante]
const chat = [
    ['out', 'Hola buenas noches, mi mamá está con dolores de cabeza muy fuertes desde hace una semana 😟'],
    ['in', 'Buenas noches 🙏 Lamento mucho lo de su mamá. Por lo que me cuenta, lo mejor es que la vea un <b>neurólogo</b>. ¿Ella ya se atendió antes con nosotros? Si me pasa su CI, reviso su ficha.'],
    ['out', 'sí, es Rosa Gutiérrez, CI 3214567'],
    ['in', 'Listo, encontré a doña Rosa ✅ Su última consulta fue con el <b>Dr. Salvatierra</b> en marzo. ¿Prefieren que la vea él de nuevo? El jueves 8 tiene libre a las <b>9:00</b> o a las <b>11:00</b>.'],
    ['out', 'a esas horas no puedo, trabajo 😕 habrá algo en la tarde?'],
    ['in', 'Entiendo, sin problema 😊 El jueves en la tarde ya está lleno, pero el <b>viernes 9 a las 15:00</b> le queda un espacio. ¿Les sirve?'],
    ['out', 'perfecto, el viernes'],
    ['in', 'Agendado 🗓️ <b>Viernes 9 de octubre, 15:00</b> con el Dr. Salvatierra. La consulta es Bs 350; si quiere le paso el QR y así llegan directo, sin hacer fila en caja.'],
    ['out', 'dale, pásame'],
    ['in', '<span class="wa-qr" aria-hidden="true"></span>Aquí está. Y una recomendación: si el dolor empeora de golpe, tiene vómitos o le cuesta hablar, vengan a <b>Emergencias</b> de inmediato, atendemos las 24 horas 🚑'],
    ['show', 'fc-pago'],
    ['in', 'Recibí el pago ✅ Le envié la factura por aquí. El jueves le escribo para recordarle la cita. ¡Que se mejore pronto doña Rosa! 💚'],
    ['show', 'fc-cita'],
    ['out', 'muchas gracias, muy amable 🙏'],
];
async function playChat() {
    const box = $('#wa-chat'), status = $('#wa-status');
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const add = (cls, htmlTxt) => {
        const p = document.createElement('p');
        p.className = cls; p.innerHTML = htmlTxt;
        box.appendChild(p);
        box.scrollTo({ top: box.scrollHeight, behavior: reduced ? 'instant' : 'smooth' });
        return p;
    };
    const largo = (t) => t.replace(/<[^>]+>/g, '').length;
    const fcs = $$('.float-card');
    if (reduced) {
        chat.forEach(([c, t]) => { if (c !== 'show') add(c, t); });
        fcs.forEach((f) => f.classList.add('is-on'));
        return;
    }
    for (;;) {
        box.innerHTML = '';
        fcs.forEach((f) => f.classList.remove('is-on'));
        await wait(700);
        for (const [cls, txt] of chat) {
            if (cls === 'show') { await wait(600); $('#' + txt).classList.add('is-on'); continue; }
            if (cls === 'in') {
                // el agente "escribe" un tiempo proporcional al largo de su respuesta
                status.textContent = 'escribiendo…';
                const typing = add('in typing', '<i></i><i></i><i></i>');
                await wait(Math.min(2600, 900 + largo(txt) * 11));
                typing.remove();
                status.textContent = 'en línea';
                add('in', txt);
                await wait(Math.min(2400, 700 + largo(txt) * 10)); // tiempo de lectura del paciente
            } else {
                await wait(Math.min(1800, 500 + largo(txt) * 25)); // el paciente escribe
                add('out', txt);
                await wait(300);
            }
        }
        await wait(6000);
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
