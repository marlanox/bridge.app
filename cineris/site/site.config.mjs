// KEPT — everything that changes per launch lives here.
// Edit, then run:  node src/build.mjs
export default {
  name: 'KEPT',
  tagline: 'Silver for what you keep',
  // Final domain. Used in canonical URLs, sitemap and structured data. Check availability first.
  url: 'https://kept.la',
  email: 'atelier@kept.la',
  instagram: '@kept.la',
  instagramUrl: 'https://www.instagram.com/kept.la/',
  phone: '',
  address: { street: 'Melrose Avenue', city: 'Los Angeles', region: 'CA', zip: '90046', country: 'US', lat: 34.0838, lng: -118.3533 },
  hours: 'By appointment. Tuesday to Saturday.',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melrose+Avenue+Los+Angeles+CA+90046',
  // Formspree / Basin endpoint so requests arrive by email. Empty = visitor copies the request.
  formEndpoint: '',
  edition: { no: '01', title: 'Ash', chains: 10, status: 'Applications open', burned: false }, // set burned: true only after the letter has actually been burned
  priceFrom: 1800,
  // The founder's real history. Fill in name and country; leave '' to omit from the site.
  founder: {
    name: '',            // e.g. 'Anna Ivanova'
    country: '',         // where Revenge was founded in 2011
    since: 2011,
    school: 'Paris',     // fashion design studies in France
    labels: ['Revenge', '8 Million People', 'The Three']
  }
};
