// THE THREE — what the key is made of. Used by the constructor (build.html) and the home page.
// One product: a sealed cell in the Vault for one year, and the chain that opens it.
export const BASE = 2500; // cell for one year + chain in your length + one artifact + toggle clasp

export const LINKS = [
  { id: 'cable', name: 'Fine cable', note: '2.4 mm, quiet' },
  { id: 'bali', name: 'Balinese', note: 'granulated by hand' },
  { id: 'forged', name: 'Forged oval', note: '11 mm, hammered' },
  { id: 'byzantine', name: 'Byzantine', note: 'a woven column' },
  { id: 'paperclip', name: 'Long link', note: 'fine, elongated' }
];

export const ARTIFACTS = [
  { id: 'wing', name: 'Wing', note: 'Cast, every feather chased by hand', price: 380, photo: 'wing-detail', pos: '50% 76%' },
  { id: 'cameo', name: 'Cameo', note: 'Carved shell in an 18k gold bezel', price: 420, photo: 'cameo-detail', pos: '50% 50%' },
  { id: 'stone', name: 'Stone in claws', note: 'Natural, held in silver claws', price: 380, photo: 'ruby-crystal-detail', pos: '50% 12%', colors: ['Garnet', 'Rock crystal', 'Black onyx'] },
  { id: 'pearl', name: 'Baroque pearl', note: 'Freshwater, irregular, gold-rimmed', price: 320, photo: 'pearl-detail', pos: '50% 40%' },
  { id: 'horn', name: 'Horn in gold', note: 'Cast horn wrapped in 18k gold', price: 420, photo: 'bone-cameo-detail', pos: '50% 60%' },
  { id: 'gold', name: '18k gold link', note: 'One solid gold link', price: 290, photo: 'gold-ring-detail', pos: '50% 40%' },
  { id: 'bead', name: 'Bali bead', note: 'Granulated silver bead', price: 110, photo: 'toggle-cameo-detail', pos: '50% 26%' }
];

export const KEEP = [
  { id: '', name: 'Nothing', price: 0 },
  { id: 'tear', name: 'A tear', price: 450, note: 'You let a tear fall on paper. Where it lands, the paper changes colour. We seal that paper in clear resin, in a silver bead.' },
  { id: 'hair', name: 'A lock of hair', price: 560, note: 'A lock of hair of the one you love, sealed in clear glass between two silver caps.' }
];

export const CLASPS = [
  { id: 'toggle', name: 'Toggle', price: 0 },
  { id: 'box', name: 'Box clasp', price: 180 }
];

export const LENGTHS = [[45, 0], [50, 0], [55, 0], [60, 150], [70, 300]];

export const IN_CELL = ['A letter', 'A film', 'A photograph', 'A voice', 'A proposal', 'A confession of love', 'A last wish', 'An apology', 'A secret no one else may know'];

export const STEPS = lead => [
  ['Compose', 'Choose the length, the links and up to three artifacts. Add your tear or their hair.'],
  ['Deposit', 'Pay 50%. We issue your cell and its code. Codes exist only with a chain.'],
  ['Seal', 'Put anything in the cell: words, a film, a photograph. Set the timer, up to one year.'],
  ['Made by hand', `We forge the chain and string the rest to your length. ${lead}.`],
  ['Given', 'The balance is paid and the key ships, insured. The code is engraved by the clasp.'],
  ['Opened', 'When the timer ends, the key opens the cell. Not one day before. Not for us.']
];

export const money = n => '$' + Math.round(n).toLocaleString('en-US');

export default [];
