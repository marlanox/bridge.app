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
    es: { cadence: '2 visitas al mes' },
    pitch: 'For homes that are lived in part of the year and need a reliable second set of eyes.',
    features: ['Two scheduled visits a month', '34-point exterior and interior check', 'Photo report within 2 hours', 'Private client portal', 'Key holding included'],
  },
  {
    id: 'signature', name: 'Signature', price: 349, cadence: 'Every week', featured: true,
    es: { cadence: 'Cada semana' },
    pitch: 'Our most chosen plan. A real person in your home every single week.',
    features: ['Weekly visits, 52 a year', 'Mail collected, scanned and forwarded', 'Squatter, trespass and code-violation watch', 'Vendor access, 2 hours a month included', 'Weather and wildfire event checks', 'Everything in Essential'],
  },
  {
    id: 'estate', name: 'Estate', price: 690, cadence: 'Twice a week',
    es: { cadence: 'Dos veces por semana' },
    pitch: 'For large properties, estates in probate and owners who want one person to run everything.',
    features: ['Two visits every week', 'A dedicated house manager', 'Arrival and departure preparation', '6 concierge hours a month', 'Quarterly home condition review', 'Everything in Signature'],
  },
];

export const addons = [
  { id: 'mail', name: 'Mail scanning for Essential', price: 29, unit: '/mo' },
  { id: 'pool', name: 'Pool & garden crew coordination', price: 39, unit: '/mo' },
  { id: 'arrival', name: 'Arrival preparation', price: 175, unit: 'per arrival' },
  { id: 'event', name: 'Storm, quake or fire event check', price: 95, unit: 'per visit' },
  { id: 'vendor', name: 'Extra vendor access hour', price: 85, unit: 'per hour' },
  { id: 'listing', name: 'Vacant listing care (show-ready)', price: 249, unit: '/mo' },
];

export const offer = {
  title: 'The Founding 100',
  text: 'Our first 100 clients lock their monthly rate for 24 months and get the first month at half price.',
  es: 'Nuestros primeros 100 clientes fijan su tarifa por 24 meses y pagan la mitad el primer mes.',
};
