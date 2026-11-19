// One place for every business detail. Change here, rebuild, done.
export const site = {
  name: 'Homeward',
  legalName: 'Homeward Home Watch LLC', // placeholder until the LLC is registered
  descriptor: 'Home Watch & Estate Services',
  url: 'https://www.homewardla.com', // placeholder domain; used for canonical URLs and sitemap
  phone: '(323) 333-3967',
  phoneE164: '+13233333967',
  email: '9138282@gmail.com', // replace with the company email later
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
    es: { cadence: '2 visitas al mes', features: ['2 visitas al mes', 'Revisión completa por dentro y por fuera', 'Informe con fotos el mismo día', 'Control de intrusos y okupas', 'Árboles y código municipal', 'Custodia de llaves y emergencias'] },
    pitch: 'For homes that are used part of the year and need a reliable second set of eyes.',
    features: ['2 visits a month', 'Full inside and outside check', 'Photo report the same day', 'Squatter and break-in check', 'Trees and city-code watch', 'Key holding and emergency line'],
  },
  {
    id: 'signature', name: 'Signature', price: 349, cadence: 'Every week', featured: true,
    es: { cadence: 'Cada semana', features: ['Visita cada semana', 'Todo lo del plan Essential', 'Revisión tras tormentas e incendios', 'Casa con aspecto habitado', '1 hora de acceso a proveedores al mes', 'Respuesta prioritaria'] },
    pitch: 'Our most chosen plan. A real person in your home every single week.',
    features: ['A visit every week', 'Everything in Essential', 'Storm and wildfire event checks', 'Lived-in look: lights, blinds, flyers, bins', '1 hour of vendor access a month', 'Priority emergency response'],
  },
  {
    id: 'estate', name: 'Estate', price: 690, cadence: 'Twice a week',
    es: { cadence: 'Dos veces por semana', features: ['Dos visitas por semana', 'Gerente personal de la casa', 'Preparación de llegada y salida', 'Revisión trimestral del estado', '3 horas de conserjería al mes', 'Todo lo del plan Signature'] },
    pitch: 'For estates and large properties that need one person running everything.',
    features: ['Two visits every week', 'Your own house manager', 'Arrival and departure preparation', 'Quarterly condition review', '3 concierge hours a month', 'Everything in Signature'],
  },
];

// Extras: monthly ones appear in the plan builder, the rest are per use.
export const addons = [
  { id: 'mail', name: 'Mail collection, scanning & forwarding', es: 'Correo: recogida, escaneo y reenvío', price: 49, unit: '/mo' },
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
