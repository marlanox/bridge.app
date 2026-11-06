// THE THREE — Fine Jewelry. Everything that changes per launch lives here.
// Edit, then run:  node src/build.mjs
export default {
  name: 'The Three',
  line: 'Fine Jewelry',
  url: 'https://thethree.jewelry',        // check availability: thethree.jewelry / thethreejewelry.com
  email: 'studio@thethree.jewelry',
  instagram: '@thethree.jewelry',
  instagramUrl: 'https://www.instagram.com/thethree.jewelry/',
  // The clothing house. Put the real address here and the footer link appears.
  clothingUrl: '',                          // e.g. 'https://thethree.la'
  clothingName: 'The Three · Raw Couture',
  city: 'West Hollywood',
  region: 'CA',
  // Studio is online-only for now: no public address, worldwide delivery.
  formEndpoint: '',                         // Formspree / Basin endpoint so requests arrive by email
  // Stripe Payment Links for the 50% deposit, one per piece slug. Empty = "Request" form only.
  deposit: { 'no-i': '', 'no-ii': '', 'no-iii': '', 'no-iv': '' },
  // The Vault backend (Supabase Edge Function URL, see ../vault/README.md). Empty = demonstration mode.
  vaultApi: '',
  founder: { name: 'Marla Nox', since: 2011, labels: ['Revenge', '8 Billion People', 'The Three'] },
  lengths: [[45, 0], [50, 0], [55, 0], [60, 150], [70, 300]],          // [cm, surcharge $]
  memory: [['', 'None', 0], ['hair', 'A lock of hair, sealed in glass', 560], ['tear', 'A tear on paper, sealed in resin', 450]],
  leadTime: '3–4 weeks',
  vaultMaxDays: 365
};
