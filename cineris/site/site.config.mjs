// MARLA KNOX — everything that changes per launch lives here.
// Edit, then run:  node src/build.mjs
export default {
  name: 'Withheld',
  url: 'https://withheld.house',          // check availability: withheld.house / withheldhouse.com
  email: 'studio@withheld.house',
  instagram: '@withheld.house',
  instagramUrl: 'https://www.instagram.com/withheld.house/',
  city: 'West Hollywood',
  region: 'CA',
  // Studio is online-only for now: no public address, worldwide delivery.
  formEndpoint: '',                         // Formspree / Basin endpoint so requests arrive by email
  founder: { name: 'Marla Nox', since: 2011, labels: ['Revenge', '8 Billion People', 'The Three'] },
  // Options offered on every piece
  lengths: [[45, 0], [50, 0], [55, 0], [60, 150], [70, 300]],          // [cm, surcharge $]
  memory: [['', 'None', 0], ['hair', 'A lock of hair, sealed in glass', 560], ['tear', 'A tear on paper, sealed in resin', 450]],
  vaultMaxDays: 365
};
