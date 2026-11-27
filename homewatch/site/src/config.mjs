// One place for every business detail. Change here, rebuild, done.
export const site = {
  name: 'Mansionly',
  legalName: 'Mansionly LLC', // placeholder until the LLC is registered
  descriptor: 'Home Watch & Estate Services',
  slogan: 'Kept as if you never left.',
  sloganEs: 'Cuidada como si nunca se hubiera ido.',
  promise: 'An empty house cannot call you. We can, and we will.',
  promiseEs: 'Una casa vacía no puede llamarle. Nosotros sí, y lo haremos.',
  url: 'https://mansionly.co', // placeholder domain; used for canonical URLs and sitemap
  phone: '(323) 333-3967',
  phoneE164: '+13233333967',
  email: 'support@mansionly.co',
  address: {
    street: '1351 N Crescent Heights Blvd',
    city: 'West Hollywood',
    region: 'CA',
    zip: '90046',
    country: 'US',
  },
  geo: { lat: 34.0956, lng: -118.3657 },
  hours: 'Mo-Sa 08:00-19:00',
  hoursText: 'Mon–Sat, 8 am – 7 pm · 24/7 emergency line for clients',
  coverage: 'All of Southern California, from Montecito to La Jolla and Palm Springs',
  dreLicense: 'DRE #00000000', // the in-house agent's license number; California requires it on real-estate advertising
  // Integrations. Leave empty until connected; the site falls back safely.
  supabaseUrl: '',
  supabaseAnonKey: '',
  stripe: { essential: '', signature: '', estate: '' }, // Stripe Payment Link URLs
  gaId: '',
};

export const plans = [
  {
    id: 'essential', name: 'Essential', price: 189, cadence: '2 visits a month',
    es: { cadence: '2 visitas al mes', features: ['2 visitas exteriores al mes', 'Cada puerta, ventana y reja revisada', 'Medidor de agua: fugas ocultas', 'Informe con fotos el mismo día', 'Señales de okupas y robos', 'Volantes y paquetes retirados'] },
    pitch: 'For homes that are used part of the year and need a reliable second set of eyes.',
    features: ['2 exterior visits a month', 'Every door, window and gate checked', 'Water meter read for hidden leaks', 'Photo report the same day', 'Squatter and break-in signs', 'Flyers and packages removed'],
  },
  {
    id: 'signature', name: 'Signature', price: 349, cadence: 'Every week', featured: true,
    es: { cadence: 'Cada semana', features: ['Visita exterior cada semana', 'Revisión interior 2 veces al mes, con su llave', 'Revisión tras tormentas e incendios', 'Custodia de llaves y línea 24/7', '1 hora de acceso a proveedores al mes', 'Respuesta prioritaria'] },
    pitch: 'Our most chosen plan. Eyes on the property every week, and inside twice a month.',
    features: ['An exterior visit every week', 'Interior check twice a month, with your key', 'Storm and wildfire event checks', 'Key holding and 24/7 emergency line', '1 hour of vendor access a month', 'Priority emergency response'],
  },
  {
    id: 'estate', name: 'Estate', price: 690, cadence: 'Twice a week',
    es: { cadence: 'Dos veces por semana', features: ['Dos visitas por semana', 'Interior en cada visita', 'Gerente personal de la casa', 'Preparación de llegada y salida', '3 horas de conserjería al mes', 'Todo lo del plan Signature'] },
    pitch: 'For estates and large properties that need one person running everything.',
    features: ['Two visits every week', 'Interior on every visit', 'Your own house manager', 'Arrival and departure preparation', '3 concierge hours a month', 'Everything in Signature'],
  },
];

// Extras: monthly ones appear in the plan builder, the rest are per use.
export const addons = [
  { id: 'mail', name: 'Mail collection, scanning & forwarding', es: 'Correo: recogida, escaneo y reenvío', price: 49, unit: '/mo' },
  { id: 'code', name: 'Trees & city-code watch', es: 'Árboles y código municipal', price: 29, unit: '/mo' },
  { id: 'inside', name: 'Interior check with your key', es: 'Revisión interior con su llave', price: 119, unit: '/mo' },
  { id: 'pool', name: 'Pool & garden crew coordination', es: 'Coordinación de piscina y jardín', price: 39, unit: '/mo' },
  { id: 'listing', name: 'Vacant listing care (show-ready)', es: 'Casa en venta lista para mostrar', price: 249, unit: '/mo' },
  { id: 'visit', name: 'Extra visit on request', es: 'Visita extra a pedido', price: 99, unit: 'per visit' },
  { id: 'vendor', name: 'Let a vendor in', es: 'Abrir a un proveedor', price: 85, unit: 'per hour' },
  { id: 'event', name: 'After-storm or fire check', es: 'Revisión tras tormenta o incendio', price: 95, unit: 'per visit' },
  { id: 'arrival', name: 'Arrival preparation', es: 'Preparación de llegada', price: 175, unit: 'per arrival' },
];

export const offer = {
  title: 'The Founding 100',
  text: 'Our first 100 clients lock their monthly rate for 24 months and get the first month at half price.',
  es: 'Nuestros primeros 100 clientes fijan su tarifa por 24 meses y pagan la mitad el primer mes.',
};

// Build-your-own: pick single services; 3 or more items take 10% off the monthly total.
export const mix = {
  discountAt: 3, discount: 0.10,
  items: [
    { id: 'squat', price: 129, en: ['Squatter & break-in watch', 'Weekly exterior check, every lock, gate and window'], es: ['Vigilancia contra okupas y robos', 'Revisión exterior semanal, cerraduras, portones y ventanas'] },
    { id: 'inside', price: 119, en: ['Interior check, twice a month', 'With your key: taps, toilets, ceilings, AC and fridge'], es: ['Revisión interior, dos veces al mes', 'Con su llave: llaves de agua, inodoros, techos, aire y refrigerador'] },
    { id: 'mail', price: 49, en: ['Mail & packages', 'Collected, scanned and forwarded'], es: ['Correo y paquetes', 'Recogido, escaneado y reenviado'] },
    { id: 'poolfull', group: 'pool', price: 219, en: ['Weekly pool service by our team', 'Chemicals included, skim, brush, vacuum, baskets, filter check'], es: ['Servicio semanal de piscina', 'Químicos incluidos, limpieza de superficie, cepillado, aspirado, canastas y filtro'] },
    { id: 'poolsup', group: 'pool', price: 39, en: ['Supervise your pool company', 'We check their work, the water and the equipment every visit'], es: ['Supervisión de su empresa de piscina', 'Revisamos su trabajo, el agua y el equipo en cada visita'] },
    { id: 'lawn', price: 189, en: ['Weekly gardener', 'Mow, edge, blow, hedges and beds'], es: ['Jardinero semanal', 'Corte, bordes, soplado, setos y canteros'] },
    { id: 'clean', price: 280, en: ['Monthly cleaning', 'Homes up to 3,000 sq ft; larger homes quoted'], es: ['Limpieza mensual', 'Casas de hasta 3,000 pies²; casas más grandes con presupuesto'] },
    { id: 'code', price: 29, en: ['City code & fire-clearance watch', 'Brush, branches over sidewalks, dead lawn'], es: ['Normas de la ciudad y despeje contra incendios', 'Maleza, ramas sobre la acera, césped seco'] },
    { id: 'keys', price: 49, en: ['Key holding & 24/7 response', 'We go when the alarm or a neighbor calls'], es: ['Custodia de llaves y respuesta 24/7', 'Vamos cuando suena la alarma o llama un vecino'] },
  ],
};
