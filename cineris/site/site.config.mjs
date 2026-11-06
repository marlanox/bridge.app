// ORDO CINERIS — everything that changes per launch lives here.
// Edit, then run:  node src/build.mjs
export default {
  name: 'Ordo Cineris',
  short: 'Cineris',
  tagline: 'The Order of Ash',
  // Final domain. Used in canonical URLs, sitemap and structured data.
  url: 'https://www.ordocineris.com',
  email: 'atelier@ordocineris.com',
  instagram: '@ordocineris',
  instagramUrl: 'https://www.instagram.com/ordocineris/',
  phone: '', // e.g. '+1 323 000 0000' once the line exists
  // The atelier. Put the real street number here once the lease is signed.
  address: {
    street: 'Melrose Avenue',
    city: 'Los Angeles',
    region: 'CA',
    zip: '90046',
    country: 'US',
    lat: 34.0838, // Melrose Ave between Fairfax and La Brea
    lng: -118.3533
  },
  hours: 'By appointment only. Tuesday to Saturday, 12:00 to 19:00.',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melrose+Avenue+Los+Angeles+CA+90046',
  // Paste a Formspree / Basin / Netlify Forms endpoint to receive requests by email.
  // Empty = the site drafts the request for the visitor to copy and send.
  formEndpoint: '',
  burning: {
    numeral: 'I',
    title: 'The Unopened Note',
    chains: 10,
    status: 'Applications open' // change to e.g. '3 of 10 remain' — keep it true
  },
  priceFrom: 1800
};
