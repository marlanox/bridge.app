import { site, plans, addons, offer } from './config.mjs';
import { services } from './data/services.mjs';
import { audiences } from './data/audiences.mjs';
import { locations, regions, travelRule, travelRuleEs } from './data/locations.mjs';
import { reviews } from './data/reviews.mjs';
import { esc, makeLinker, leadForm, faqBlock, faqSchema } from './layout.mjs';
import { sceneSvg, landSvg } from './scene.mjs';
import { heroArt } from './heroart.mjs';
import { mix } from './config.mjs';

export const checkpoints = {
  en: [
    ['Exterior', ['Roof line, gutters and downspouts', 'Walls, stucco and paint for cracks', 'Windows and screens', 'Fences, gates and latches', 'Exterior lights and timers', 'Drainage and standing water', 'Pests and animal activity']],
    ['Entry & signs of occupancy', ['Every exterior door and lock tested', 'Garage doors and side entries', 'Signs of forced entry', 'Signs someone is living in the home', 'Alarm system status', 'Police authorization letter current']],
    ['Interior', ['Ceilings for water stains', 'Floors around toilets, tubs and sinks', 'Walls and windows for moisture or mold', 'Odors, pests and droppings', 'Smoke and CO detectors', 'Doors and windows locked inside', 'Blinds and lights set to look lived-in']],
    ['Systems', ['Run every tap and flush every toilet', 'Water heater and supply lines', 'HVAC running and thermostat setting', 'Fridge and freezer temperatures', 'Electrical panel and outages', 'Pool and spa equipment', 'Irrigation timer and leaks']],
    ['Lived-in look', ['Flyers and door hangers removed', 'Packages moved out of sight', 'Bins moved on collection day']],
    ['Landscape & city code', ['Branches over sidewalks and roofs', 'Dry brush and fire clearance', 'Lawn and planters cared for', 'City or HOA notices posted']],
  ],
  es: [
    ['Exterior', ['Techo, canaletas y bajantes', 'Paredes y estuco', 'Ventanas y mosquiteros', 'Cercas, rejas y cerrojos', 'Luces exteriores y temporizadores', 'Drenaje y agua estancada', 'Plagas y animales']],
    ['Entradas y ocupación', ['Cada puerta y cerradura', 'Garaje y entradas laterales', 'Señales de entrada forzada', 'Señales de que alguien vive allí', 'Estado de la alarma', 'Carta de autorización policial vigente']],
    ['Interior', ['Techos y manchas de agua', 'Pisos junto a baños y lavabos', 'Humedad y moho', 'Olores y plagas', 'Detectores de humo y CO', 'Puertas y ventanas cerradas', 'Persianas y luces para que parezca habitada']],
    ['Sistemas', ['Abrir llaves y descargar inodoros', 'Calentador y tuberías', 'Aire acondicionado y termostato', 'Temperatura del refrigerador', 'Panel eléctrico', 'Equipo de piscina y spa', 'Riego y fugas']],
    ['Aspecto habitado', ['Volantes retirados', 'Paquetes fuera de la vista', 'Botes de basura en su día']],
    ['Jardín y código municipal', ['Ramas sobre aceras y techos', 'Maleza seca y prevención de incendios', 'Césped y jardineras', 'Avisos de la ciudad o HOA']],
  ],
};

export const generalFaqs = {
  en: [
    ['What exactly is home watch?', 'Scheduled visits to your home while you are away. We inspect the inside and outside, report with photos the same day and act fast if something is wrong.'],
    ['What if I need an extra visit?', 'Ask in the portal or call us. An extra visit on request is $99, for example after a storm warning or before guests arrive.'],
    ['Is mail included?', 'Flyers and packages are always removed so the house does not look empty. Full mail handling (collecting, scanning every envelope and forwarding) is a $49/mo add-on to any plan.'],
    ['How is this different from a property manager?', 'Property managers handle tenants and rent. We look after homes where no one is living, and we never take a percentage of rent.'],
    ['Are you insured?', 'Yes. Mansionly is bonded and insured. We will send a certificate of insurance to you or your insurer.'],
    ['Is there a long contract?', 'No. Plans are month to month. Cancel any time with 30 days’ notice.'],
    ['How do you keep my keys safe?', 'Keys are coded, never labeled with your address, and stored in a locked safe. Every key use is logged in your portal.'],
    ['Which areas do you cover?', 'All of Southern California: Los Angeles, the South Bay, Calabasas, Orange County, Montecito, Palm Springs and San Diego. Standard prices within 30 miles of our West Hollywood office; farther out we add a travel fee, quoted for your home.'],
  ],
  es: [
    ['¿Qué es exactamente la vigilancia de casas?', 'Visitas programadas a su casa mientras usted no está. Revisamos el interior y el exterior, enviamos un informe con fotos el mismo día y actuamos rápido si algo anda mal.'],
    ['¿Y si necesito una visita extra?', 'Pídala en el portal o llámenos. Una visita extra cuesta $99, por ejemplo antes de una tormenta o de que lleguen invitados.'],
    ['¿El correo está incluido?', 'Siempre retiramos volantes y paquetes. El manejo completo del correo (recoger, escanear y reenviar) cuesta $49 al mes en cualquier plan.'],
    ['¿Están asegurados?', 'Sí. Mansionly está afianzada y asegurada. Enviamos el certificado a usted o a su aseguradora.'],
    ['¿Hay contrato a largo plazo?', 'No. Los planes son mes a mes. Puede cancelar con 30 días de aviso.'],
    ['¿Cómo protegen mis llaves?', 'Las llaves se codifican, nunca llevan su dirección y se guardan en una caja fuerte. Cada uso queda registrado.'],
    ['¿Hablan español?', 'Sí. Nuestro equipo trabaja en inglés y en español, y también nuestros informes.'],
    ['¿Qué zonas cubren?', 'Todo el Sur de California. Precios estándar dentro de 30 millas de West Hollywood; más lejos se agrega un cargo de traslado.'],
  ],
};

const icons = [
  '<path d="M3 11.5 12 4l9 7.5M5.5 9.8V20h13V9.8M10 20v-5h4v5"/>',
  '<rect x="3" y="7" width="18" height="13" rx="1"/><circle cx="12" cy="13.5" r="3.6"/><path d="M8.5 7l1.6-2.6h3.8L15.5 7"/>',
  '<rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2.5"/>',
  '<path d="M12 21v-6M12 3.5c-3.6 0-6 2.8-6 5.8 0 3 2.6 5.2 6 5.2s6-2.2 6-5.2c0-3-2.4-5.8-6-5.8zM8 21h8"/>',
  '<path d="M12 3.5c3.8 4.6 6 7.8 6 10.8a6 6 0 0 1-12 0c0-3 2.2-6.2 6-10.8z"/>',
  '<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.4 10.9V16h6.8v-2.1A6 6 0 0 0 12 3z"/>',
];

const tIcons = [
  '<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M8.8 12.2l2.2 2.2 4.4-4.6"/>',
  '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6"/>',
  '<rect x="3" y="7" width="18" height="13" rx="1"/><circle cx="12" cy="13.5" r="3.6"/><path d="M8.5 7l1.6-2.6h3.8L15.5 7"/>',
  '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
];

const T = {
  en: {
    title: 'Home Watch in Los Angeles & Southern California | Weekly Visits & Photo Reports | Mansionly',
    description: 'Premium home watch for empty and second homes across Southern California: Los Angeles, Beverly Hills, Malibu, Orange County, Palm Springs and San Diego. Weekly visits, same-day photo reports. From $189/mo.',
    eyebrow: 'Mansionly Home Watch · Southern California',
    h1: 'While you’re away, we keep watch.',
    lead: 'Weekly visits to your empty home. Every room, lock and system checked, and a photo report on your phone the same day.',
    chips: ['Bonded & insured', 'Background-checked inspectors', 'Photo proof of every visit', 'From $189/mo · no contract'],
    tband: [['Bonded & insured', 'Certificate of insurance on request, sent to you or your insurer.'], ['The same vetted inspector', 'Background-checked, trained on our 34-point visit, every single time.'], ['Proof of every visit', '30 to 40 timestamped, location-tagged photos, the same day.'], ['Keys coded, never labeled', 'Kept in a safe, every use logged. Month to month, no markups.']],
    cta1: 'Book a free walkthrough', cta2: 'See plans', scroll: 'Scroll',
    logHead: ['Tuesday visit', '6:42 pm'],
    log: [['6:42', 'Arrived · alarm disarmed'], ['6:44', 'Doors, locks & windows'], ['6:49', 'Main floor, room by room'], ['6:53', 'Water, AC & fridge'], ['6:58', 'Upstairs & bathrooms'], ['7:06', 'Grounds, trees & gates'], ['7:11', 'Report sent · 38 photos']],
    logFoot: ['Your inspector', 'All clear'],
    trust: [],
    inclEyebrow: 'Every visit includes', inclH: 'Everything an empty home needs. Every single visit.',
    incl: [
      ['Full walk-through, inside and out', 'Every room, every door, the roof line, gates and fences. The same 34-point route every visit, so nothing is skipped.'],
      ['Photo report the same day', '30 to 40 timestamped photos on your phone within two hours. Saved forever, ready for your insurer.'],
      ['Squatters and break-ins', 'Every lock and window tested, and any sign that someone got in or is living there. If something is wrong, we call the police and you right away.'],
      ['Trees, brush and city fines', 'Branches over sidewalks and roofs, dry brush, a dead lawn. We catch it and send a crew before the city sends a notice.'],
      ['Leaks, power, AC and pool', 'We run every tap and check the water heater, fridge, air conditioning and pool equipment. Small problems stay small.'],
      ['A home that looks lived in', 'Flyers and packages removed, lights and blinds adjusted, bins moved. Empty homes attract trouble. Yours will not look empty.'],
    ],
    factsEyebrow: 'Why it matters', factsH: 'An empty home is the most expensive home to own.',
    facts: [
      ['30–60 days', 'Insurance stops being simple', 'Many home policies limit coverage once a house sits vacant this long. Our dated reports prove it was checked.'],
      ['1 week', 'The difference between a repair and a renovation', 'A slow leak found in week one is a plumber. Found in month two, it is new floors, mold and a claim.'],
      ['Months', 'To remove squatters in California', 'Getting someone out through the courts can take months. A weekly visit and a lived-in look keep them from coming in.'],
      ['$0', 'In city fines, if we see it first', 'Overgrown trees, dry brush and code notices bring fines. We spot them early and fix them before the city does.'],
    ],
    plansEyebrow: 'Plans', plansH: 'Choose how often we come.', plansP: 'Every plan includes the full inside-and-outside visit, same-day photo reports, squatter and city-code watch, key holding and a 24/7 emergency line.',
    choose: 'Choose', mostChosen: 'Most chosen', perMonth: '/mo', addH: 'Add only what you need', compare: 'Build your plan and see the exact price',
    trustEyebrow: 'Why owners trust us', trustH: 'You hand us the keys. Here is what you get in return.',
    trustList: [
      ['Bonded & insured', 'A certificate of insurance on request, sent to you or your insurer.'],
      ['Background-checked inspectors', 'Trained on our 34-point visit. The same person visits your home every time.'],
      ['Your keys, coded', 'Never labeled with your address, kept in a safe, every use logged.'],
      ['Proof of every visit', 'Timestamped, location-tagged photos you can check yourself.'],
      ['A real office', site.address.street + ', ' + site.address.city + '. Come and meet us.'],
      ['No long contract', 'Month to month. Cancel with 30 days’ notice.'],
      ['No markups', 'When a vendor is needed, you pay their price, with the receipt.'],
      ['English & Español', 'Our team and our reports, in both languages.'],
    ],
    howEyebrow: 'How it works', howH: 'Up and running within a week.',
    steps: [['Free walkthrough', 'We meet you or your representative at the home, or by video, and learn how it works.'], ['Keys and emergency plan', 'Keys are coded and stored. We agree what to do in an emergency and set the visit schedule.'], ['Visits begin', 'The same inspector, the same 34 checkpoints, a photo report the same day.'], ['Everything in one place', 'Reports, photos, requests and invoices in your private portal.']],
    revEyebrow: 'Clients', revH: 'What our clients say.', sample: 'Sample review',
    checkEyebrow: 'The full checklist', checkH: '34 checkpoints, every visit.', checkP: 'The same list every time, photographed every time. So when something changes, we notice.',
    portalEyebrow: 'Your private portal', portalH: 'Every visit, every photo. On your phone.', portalP: 'See your home’s full history, approve a vendor, request an extra visit or message us from anywhere. Your family, attorney or agent can get their own access.', portalCta: 'Preview the portal',
    portalItems: [['Visit report · all clear', 'Tue, 7:11 pm', ''], ['38 photos added', 'Tue, 7:11 pm', ''], ['Branch over sidewalk', 'Trim booked for Fri', 'warn'], ['Extra visit requested', 'Sat, 10:00 am', '']],
    offerP: 'Refer a friend and you both get one month free.', offerCta: 'Claim a founding spot', referral: 'How referrals work',
    moreEyebrow: 'When you need more', moreH: 'One trusted team for everything else your home needs.', moreP: 'Most clients start with home watch. When they need more, the same people take care of it: vendors, arrivals, mail, preparing and selling the home, and acting on their behalf.', whoLabel: 'Who we work with',
    areasEyebrow: 'Where we work', areasH: 'All of Southern California.',
    faqEyebrow: 'Questions', faqH: 'Straight answers.', allFaq: 'All questions',
    endEyebrow: 'Start here', endH: 'See what we would check at your home.', endP: 'Book a free 30-minute walkthrough. We show you exactly what we look for, and you keep the written risk check even if you do not sign up.',
  },
  es: {
    title: 'Vigilancia de casas en Los Ángeles y el Sur de California | Mansionly',
    description: 'Vigilancia de casas vacías y segundas residencias en Beverly Hills, West Hollywood y Los Ángeles. Visitas semanales e informes con fotos el mismo día. Desde $189/mes.',
    eyebrow: 'Vigilancia de casas · Todo el Sur de California',
    h1: 'Mientras usted no está, nosotros vigilamos.',
    lead: 'Visitas semanales a su casa vacía. Cada habitación, cerradura y sistema revisados, y un informe con fotos en su teléfono el mismo día.',
    chips: ['Afianzados y asegurados', 'Inspectores verificados', 'Prueba de cada visita', 'Desde $189/mes · sin contrato'],
    tband: [['Afianzados y asegurados', 'Certificado de seguro a pedido, para usted o su aseguradora.'], ['El mismo inspector verificado', 'Con verificación de antecedentes y capacitado en 34 puntos.'], ['Prueba de cada visita', 'De 30 a 40 fotos con fecha, hora y ubicación, el mismo día.'], ['Llaves codificadas', 'En caja fuerte, cada uso registrado. Mes a mes, sin recargos.']],
    cta1: 'Reserve una visita gratis', cta2: 'Ver planes', scroll: 'Desplace',
    logHead: ['Visita del martes', '6:42 pm'],
    log: [['6:42', 'Llegada · alarma desactivada'], ['6:44', 'Puertas, cerraduras y ventanas'], ['6:49', 'Planta baja, cuarto por cuarto'], ['6:53', 'Agua, aire y refrigerador'], ['6:58', 'Planta alta y baños'], ['7:06', 'Jardín, árboles y rejas'], ['7:11', 'Informe enviado · 38 fotos']],
    logFoot: ['Su inspector', 'Todo en orden'],
    trust: ['Afianzados y asegurados', 'Informe con fotos el mismo día', 'Inspectores verificados', 'English & Español', 'Oficina en West Hollywood'],
    inclEyebrow: 'Cada visita incluye', inclH: 'Todo lo que una casa vacía necesita. En cada visita.',
    incl: [
      ['Recorrido completo, dentro y fuera', 'Cada habitación, cada puerta, el techo, las rejas y las cercas. La misma ruta de 34 puntos en cada visita.'],
      ['Informe con fotos el mismo día', 'De 30 a 40 fotos con fecha y hora en su teléfono en dos horas. Guardadas para siempre.'],
      ['Okupas y robos', 'Probamos cada cerradura y ventana. Si algo está mal, llamamos a la policía y a usted de inmediato.'],
      ['Árboles, maleza y multas', 'Ramas sobre aceras y techos, maleza seca, césped muerto. Lo resolvemos antes de que llegue el aviso de la ciudad.'],
      ['Fugas, luz, aire y piscina', 'Abrimos cada llave y revisamos calentador, refrigerador, aire acondicionado y piscina.'],
      ['Una casa que parece habitada', 'Retiramos volantes y paquetes, ajustamos luces y persianas. Su casa no parecerá vacía.'],
    ],
    factsEyebrow: 'Por qué importa', factsH: 'Una casa vacía es la casa más cara de mantener.',
    facts: [
      ['30–60 días', 'El seguro deja de ser simple', 'Muchas pólizas limitan la cobertura cuando la casa está vacía tanto tiempo. Nuestros informes prueban que se revisó.'],
      ['1 semana', 'Entre una reparación y una remodelación', 'Una fuga encontrada en la primera semana es un plomero. En el segundo mes, son pisos nuevos y moho.'],
      ['Meses', 'Para sacar okupas en California', 'El proceso judicial puede tardar meses. Una visita semanal evita que entren.'],
      ['$0', 'En multas, si lo vemos primero', 'Árboles, maleza y avisos de código traen multas. Los detectamos antes que la ciudad.'],
    ],
    plansEyebrow: 'Planes', plansH: 'Elija cada cuánto venimos.', plansP: 'Todos los planes incluyen la visita completa, informe con fotos el mismo día, control de okupas y código municipal, custodia de llaves y línea de emergencia 24/7.',
    choose: 'Elegir', mostChosen: 'El más elegido', perMonth: '/mes', addH: 'Agregue solo lo que necesita', compare: 'Arme su plan y vea el precio exacto',
    trustEyebrow: 'Por qué confían en nosotros', trustH: 'Usted nos da las llaves. Esto es lo que recibe.',
    trustList: [
      ['Afianzados y asegurados', 'Certificado de seguro a pedido.'],
      ['Inspectores verificados', 'Capacitados en nuestra visita de 34 puntos. Siempre la misma persona.'],
      ['Llaves codificadas', 'Nunca con su dirección, guardadas en caja fuerte.'],
      ['Prueba de cada visita', 'Fotos con fecha, hora y ubicación.'],
      ['Oficina real', site.address.street + ', ' + site.address.city + '.'],
      ['Sin contrato largo', 'Mes a mes. Cancele con 30 días de aviso.'],
      ['Sin recargos', 'Paga el precio del proveedor, con recibo.'],
      ['English & Español', 'Equipo e informes en ambos idiomas.'],
    ],
    howEyebrow: 'Cómo funciona', howH: 'Listo en una semana.',
    steps: [['Visita gratis', 'Nos reunimos en la casa, o por video, y aprendemos cómo funciona.'], ['Llaves y plan de emergencia', 'Codificamos las llaves y acordamos qué hacer en una emergencia.'], ['Comienzan las visitas', 'El mismo inspector, los mismos 34 puntos, informe el mismo día.'], ['Todo en un lugar', 'Informes, fotos, solicitudes y facturas en su portal.']],
    revEyebrow: 'Clientes', revH: 'Lo que dicen nuestros clientes.', sample: 'Opinión de ejemplo',
    checkEyebrow: 'La lista completa', checkH: '34 puntos en cada visita.', checkP: 'La misma lista cada vez, con fotos cada vez.',
    portalEyebrow: 'Su portal privado', portalH: 'Cada visita, cada foto. En su teléfono.', portalP: 'Vea el historial de su casa, apruebe un proveedor o pida una visita extra desde cualquier lugar.', portalCta: 'Ver el portal',
    portalItems: [['Informe · todo en orden', 'Mar, 7:11 pm', ''], ['38 fotos agregadas', 'Mar, 7:11 pm', ''], ['Rama sobre la acera', 'Poda el viernes', 'warn'], ['Visita extra pedida', 'Sáb, 10:00 am', '']],
    offerP: 'Recomiende a un amigo y ambos reciben un mes gratis.', offerCta: 'Reservar mi lugar', referral: 'Cómo funcionan las referencias',
    moreEyebrow: 'Cuando necesite más', moreH: 'Un solo equipo de confianza para todo lo demás.', moreP: 'La mayoría empieza con la vigilancia. Cuando necesitan más, las mismas personas se encargan: proveedores, llegadas, correo, preparar y vender la casa.', whoLabel: 'Con quién trabajamos',
    areasEyebrow: 'Dónde trabajamos', areasH: 'Todo el Sur de California.',
    faqEyebrow: 'Preguntas', faqH: 'Respuestas directas.', allFaq: 'Todas las preguntas',
    endEyebrow: 'Empiece aquí', endH: 'Vea lo que revisaríamos en su casa.', endP: 'Reserve una visita gratis de 30 minutos. Se queda con el informe de riesgos aunque no contrate.',
  },
};

export function homePage(lang = 'en') {
  const es = lang === 'es';
  const path = es ? 'es/index' : 'index';
  const { link } = makeLinker(path);
  const t = T[lang];
  const tStep = [0.05, 0.16, 0.28, 0.4, 0.52, 0.68, 0.8];
  const log = t.log.map(([time, txt], i) => `<li style="--t:${tStep[i]}"><time>${time}</time><i></i><span>${txt}</span></li>`).join('');
  const incl = t.incl.map(([h, p], i) => `<div class="rv"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg><h3>${h}</h3><p>${p}</p></div>`).join('');
  const facts = t.facts.map(([b, h, p]) => `<div class="rv"><b>${b}</b><h3>${h}</h3><p>${p}</p></div>`).join('');
  const startLink = link(es ? 'es/contacto' : 'get-started');
  const plansHtml = plans.map((p) => `<div class="plan${p.featured ? ' featured' : ''}">${p.featured ? `<span class="badge">${t.mostChosen}</span>` : ''}<h3>${p.name}</h3><p class="small" style="opacity:.8">${es ? p.es.cadence : p.cadence}</p><div class="amt">$${p.price}<small>${t.perMonth}</small></div><ul>${(es ? p.es.features : p.features).map((f) => `<li>${f}</li>`).join('')}</ul><a class="btn${p.featured ? '' : ' line'}" href="${startLink}?plan=${p.id}">${t.choose} ${p.name}</a></div>`).join('');
  const addHtml = addons.filter((a) => ['visit', 'mail', 'vendor', 'event', 'arrival'].includes(a.id)).map((a) => `<div><b>$${a.price}</b><span>${es ? a.es : a.name}</span><small>${a.unit === '/mo' ? (es ? 'al mes' : 'per month') : es ? 'por uso' : a.unit}</small></div>`).join('');
  const trustL = t.trustList.map(([h, p]) => `<div class="rv"><h3>${h}</h3><p>${p}</p></div>`).join('');
  const steps = t.steps.map(([h, p]) => `<li class="rv"><h3>${h}</h3><p class="muted">${p}</p></li>`).join('');
  const revs = reviews.map((r) => `<figure class="rcard rv"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“${esc(es ? r.es : r.en)}”</blockquote><figcaption><span class="av" aria-hidden="true">${r.initials}</span><span><b>${esc(r.name)}</b><small>${esc(r.area)} · ${r.plan}</small></span></figcaption>${r.sample ? `<span class="sample">${t.sample}</span>` : ''}</figure>`).join('');
  const checks = checkpoints[lang].map(([h, items]) => `<div class="rv"><h3>${h} <span>${items.length}</span></h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('');
  const pItems = t.portalItems.map(([a, b, c]) => `<div class="item"><span class="dot ${c}"></span><span>${a}</span><small>${b}</small></div>`).join('');
  const more = services.filter((s) => s.slug !== 'home-watch').map((s) => `<a href="${link(s.slug)}">${esc(s.name)}</a>`).join('');
  const who = audiences.map((a) => `<a href="${link('for/' + a.slug)}">${esc(a.name)}</a>`).join('');
  const areas = regions.map((r) => { const ls = locations.filter((l) => (l.region || 'Los Angeles') === r); return ls.length ? `<div class="region"><p class="eyebrow">${r}</p><ul class="links">${ls.map((l) => `<li><a href="${link('home-watch/' + l.slug)}">${l.name}</a></li>`).join('')}</ul></div>` : ''; }).join('');
  const faqs = generalFaqs[lang];


  const D = es ? {
    eye: 'Mansionly · Más allá de Home Watch', h: 'Cuando la casa necesita más que una visita.',
    p: 'Home Watch es lo que hacemos cada semana. Cuando necesita más, el mismo equipo se encarga a través de tres divisiones, con una sola llamada y las mismas fotos.',
    core: 'Servicio principal', more: 'Ver servicio', price: 'Ver precios',
    hw: ['Home Watch', 'Cuidada como si nunca se hubiera ido.', 'Visitas programadas a su casa vacía. Recorremos 34 puntos dentro y fuera y le enviamos el informe con fotos el mismo día.', [['34', 'puntos en cada visita'], ['2 h', 'informe con fotos'], ['$189', 'desde, al mes']]],
    divs: [['Concierge', 'Un mensaje. Hecho, con fotos.', [['vendor-contractor-access', 'Acceso de proveedores'], ['pre-arrival-preparation', 'Preparación de llegada'], ['renovation-oversight', 'Supervisión de obras']], 'concierge'],
      ['Estates', 'De cuidada a vendida.', [['pre-sale-preparation-staging', 'Preparación y staging'], ['vacant-listing-care', 'Casas en venta vacías'], ['sell-your-home', 'Venta con agente licenciado']], 'sell-your-home'],
      ['Private Office', 'Sus manos en California.', [['power-of-attorney-services', 'Poder notarial'], ['estate-property-care', 'Sucesiones y herencias'], ['insurance-vacancy-inspections', 'Informes para seguros']], 'power-of-attorney-services']],
    trust: t.tband.map((x) => x[0])
  } : {
    eye: 'Mansionly · Beyond home watch', h: 'When the house needs more than a visit.',
    p: 'Home watch is what we do every week. When you need more, the same team handles it through three divisions, with one call and the same photo proof.',
    core: 'Our core service', more: 'Explore', price: 'See pricing',
    hw: ['Home Watch', 'Kept as if you never left.', 'Scheduled visits to your empty home. A 34-point check inside and out, and a photo report on your phone the same day.', [['34', 'points every visit'], ['2 hrs', 'to your photo report'], ['$189', 'from, per month']]],
    divs: [['Concierge', 'One message. Done, with photos.', [['vendor-contractor-access', 'Vendor access'], ['pre-arrival-preparation', 'Arrival preparation'], ['renovation-oversight', 'Renovation oversight']], 'concierge'],
      ['Estates', 'From kept to sold.', [['pre-sale-preparation-staging', 'Pre-sale prep & staging'], ['vacant-listing-care', 'Vacant listing care'], ['sell-your-home', 'Sell with our licensed agent']], 'sell-your-home'],
      ['Private Office', 'Your hands in California.', [['power-of-attorney-services', 'Power of attorney'], ['estate-property-care', 'Estate & probate homes'], ['insurance-vacancy-inspections', 'Insurance-ready reports']], 'power-of-attorney-services']],
    trust: t.tband.map((x) => x[0])
  };
  const lock = (sub) => `<span class="dlock"><span class="wm"><span class="wm-m">m</span>ansionly<span class="wm-m">.</span></span><b>${sub}</b></span>`;
  const divisionsHtml = `<section class="divs" aria-label="${D.eye}"><div class="wrap">
  <div class="divs-head"><span class="eyebrow">${D.eye}</span><h2>${D.h}</h2><p class="lead">${D.p}</p></div>
  <div class="divs-grid">
    <a class="dcore" hidden href="${link('home-watch')}">
      <span class="dnum">01 · ${D.core}</span>${lock(D.hw[0])}
      <p class="dtag">${D.hw[1]}</p><p class="ddesc">${D.hw[2]}</p>
      <div class="dfacts">${D.hw[3].map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>
      <span class="dgo">${D.more} →</span>
    </a>
    ${D.divs.map(([n, tag, subs, main], i) => `<div class="dcard"><span class="dnum">0${i + 2}</span>${lock(n)}<p class="dtag">${tag}</p><ul>${subs.map(([sl, nm]) => `<li><a href="${link(sl)}">${nm}</a></li>`).join('')}</ul><a class="dgo" href="${link(main)}">${D.more} →</a></div>`).join('')}
  </div>
  <p class="eyebrow" style="margin:40px 0 14px">${t.whoLabel}</p>
  <div class="more-svcs">${who}</div>
</div></section>`;
  const trustHtml = `<ul class="dtrust">${D.trust.map((x, i) => `<li><svg viewBox="0 0 24 24" aria-hidden="true">${tIcons[i]}</svg>${x}</li>`).join('')}</ul>`;


  const M = es ? {
    eye: 'Arme su propio plan', h: 'Elija solo lo que necesita.',
    p: 'Marque los servicios que quiere. Con 3 o más, 10% de descuento cada mes. Los trabajos de proveedores se pagan a costo, sin recargo.',
    sub: 'Subtotal', off: 'Descuento por 3+ servicios', tot: 'Su precio', mo: '/mes', none: 'Elija al menos un servicio', cta: 'Pedir este plan',
    more: 'Agregue {n} más para 10% de descuento', yes: '10% de descuento aplicado',
    laterH: 'Y cuando lo necesite, agregue más', laterP: 'Los clientes de cualquier plan tienen 10% de descuento en estos servicios.',
    later: [['sell-your-home', 'Vender con nuestro agente licenciado'], ['vacant-listing-care', 'Open houses mientras usted está lejos'], ['pre-sale-preparation-staging', 'Staging antes de las fotos'], ['pre-sale-preparation-staging', 'Arreglos cosméticos antes de vender'], ['renovation-oversight', 'Supervisión de obras'], ['vendor-contractor-access', 'Nosotros contratamos: jardín, piscina, limpieza, poda']]
  } : {
    eye: 'Build your own', h: 'Pick only what you need.',
    p: 'Tick the services you want. Choose 3 or more and save 10% every month. Vendor work is billed at cost, never marked up.',
    sub: 'Subtotal', off: '3+ services discount', tot: 'Your price', mo: '/mo', none: 'Pick at least one service', cta: 'Request this plan',
    more: 'Add {n} more to save 10%', yes: '10% discount applied',
    laterH: 'And when you need it, add more', laterP: 'Clients on any plan save 10% on all of these.',
    later: [['sell-your-home', 'Sell with our licensed agent'], ['vacant-listing-care', 'Open houses while you are away'], ['pre-sale-preparation-staging', 'Staging before the photos'], ['pre-sale-preparation-staging', 'Cosmetic refresh before a sale'], ['renovation-oversight', 'Oversight of any work on the house'], ['vendor-contractor-access', 'We book it for you: lawn, pool, cleaning, trimming']]
  };
  const mixHtml = `<section class="sec" id="build"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${M.eye}</span><h2>${M.h}</h2><p class="lead">${M.p}</p></div>
  <div class="mix" data-mix data-at="${mix.discountAt}" data-off="${mix.discount}">
    <div class="mix-opts">${mix.items.map((it) => { const [n, d] = es ? it.es : it.en; return `<label class="mopt"><input type="checkbox" name="mix" value="${it.id}" data-price="${it.price}"><span><b>${n}</b><small>${d}</small></span><em>$${it.price}<small>${M.mo}</small></em></label>`; }).join('')}</div>
    <aside class="mix-tot">
      <div class="mrow"><span>${M.sub}</span><span data-sub>$0</span></div>
      <div class="mrow moff"><span>${M.off}</span><span data-off-amt>−$0</span></div>
      <div class="mbig"><span>${M.tot}</span><b><span data-total>$0</span><small>${M.mo}</small></b></div>
      <p class="mhint" data-hint data-none="${M.none}" data-more="${M.more}" data-yes="${M.yes}">${M.none}</p>
      <a class="btn arrow" data-mix-go href="#start">${M.cta}</a>
    </aside>
  </div>
  <div class="later"><h3>${M.laterH}</h3><p class="muted">${M.laterP}</p><div class="more-svcs">${M.later.map(([sl, n]) => `<a href="${link(sl)}">${n}</a>`).join('')}</div></div>
</div></section>`;

  const body = `
<section class="scene" id="top" aria-label="${es ? 'Introducción' : 'Introduction'}">
  <div class="stage">
    <div class="sky"></div><div class="night"></div><div class="stars"></div>
    <div class="land">${landSvg()}<div class="ground"></div></div>
    <div class="wrap copy on-dark">
      <div class="hero-in">
        <span class="eyebrow" style="color:var(--slate)">${t.eyebrow}</span>
        <h1 style="margin-top:18px">${t.h1}</h1>
        <p class="lead">${t.lead}</p>
        <div class="row"><a class="btn arrow" href="#start">${t.cta1}</a><a class="btn line" href="#plans">${t.cta2}</a><a class="tel" href="tel:${site.phoneE164}">${site.phone}</a></div>
        <div class="hero-trust">${t.chips.map((c) => `<span>${c}</span>`).join('')}</div>
      </div>
      <div class="log" aria-label="${es ? 'Ejemplo de registro de visita' : 'Example visit log'}">
        <div class="log-h"><span>${t.logHead[0]}</span><span>${t.logHead[1]}</span></div>
        <ol>${log}</ol>
        <div class="log-f"><span>${t.logFoot[0]}</span><b>${t.logFoot[1]}</b></div>
      </div>
    </div>
    ${heroArt()}
    <span class="cue" aria-hidden="true">${t.scroll}</span>
  </div>
</section>
<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.inclEyebrow}</span><h2>${t.inclH}</h2></div>
  <div class="incl">${incl}</div>
  ${trustHtml}
</div></section>

<section class="sec stone" id="plans"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.plansEyebrow}</span><h2>${t.plansH}</h2><p class="lead">${t.plansP}</p></div>
  <div class="plans rv">${plansHtml}</div>
  <h3 style="margin-top:40px">${t.addH}</h3>
  <div class="addons">${addHtml}</div>
  <p class="member">${es ? 'Con cualquier plan: 10% de descuento en todos los extras y servicios adicionales.' : 'On any plan: 10% off every add-on and extra service.'}</p>
  <p style="margin-top:22px"><a href="${link(es ? 'es/precios' : 'pricing')}">${t.compare} →</a></p>
</div></section>

${mixHtml}

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.howEyebrow}</span><h2>${t.howH}</h2></div>
  <ol class="steps">${steps}</ol>
</div></section>

<section class="sec stone"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.checkEyebrow}</span><h2>${t.checkH}</h2><p class="lead">${t.checkP}</p></div>
  <div class="checks">${checks}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.factsEyebrow}</span><h2>${t.factsH}</h2></div>
  <div class="facts">${facts}</div>
</div></section>

<section class="sec stone"><div class="wrap portal">
  <div style="display:grid;gap:18px"><span class="eyebrow">${t.portalEyebrow}</span><h2>${t.portalH}</h2><p class="lead">${t.portalP}</p><p><a class="btn line arrow" href="${link('portal')}">${t.portalCta}</a></p></div>
  <div class="device rv" aria-hidden="true"><div class="top"><span>${site.name} · Beverly Hills</span><span>Week 46</span></div><div class="photos"><span></span><span></span><span></span><span></span></div>${pItems}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.revEyebrow}</span><h2>${t.revH}</h2></div>
  <div class="rgrid">${revs}</div>
</div></section>

<section class="sec tight dark"><div class="wrap offer">
  <div style="display:grid;gap:10px"><span class="eyebrow" style="color:var(--slate)">${offer.title}</span><h2 style="font-size:clamp(26px,3vw,36px)">${es ? offer.es : offer.text}</h2><p>${t.offerP} <a href="${link('referral')}">${t.referral}</a></p></div>
  <div class="on-dark"><a class="btn arrow" href="#start">${t.offerCta}</a></div>
</div></section>

${divisionsHtml}

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.areasEyebrow}</span><h2>${t.areasH}</h2><p class="lead">${es ? travelRuleEs : travelRule}</p></div>
  <div class="regions">${areas}</div>
</div></section>

<section class="sec paper rule"><div class="wrap split">
  <div style="display:grid;gap:18px;align-content:start"><span class="eyebrow">${t.faqEyebrow}</span><h2>${t.faqH}</h2><p><a href="${link(es ? 'es/preguntas-frecuentes' : 'faq')}">${t.allFaq} →</a></p></div>
  ${faqBlock(faqs)}
</div></section>

<section class="sec dark" id="start"><div class="wrap split">
  <div style="display:grid;gap:18px;align-content:start"><span class="eyebrow" style="color:var(--slate)">${t.endEyebrow}</span><h2>${t.endH}</h2><p class="lead">${t.endP}</p>
    <p style="margin-top:12px"><a href="tel:${site.phoneE164}" style="font:500 32px/1.2 var(--serif);color:var(--stone);text-decoration:none">${site.phone}</a><br><span>${site.email}</span><br><span>${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.zip}</span></p>
  </div>
  ${leadForm({ path, lang, id: 'start-form', dark: true, source: 'home-bottom' })}
</div></section>`;
  return { path, lang, title: t.title, description: t.description, body, schema: [faqSchema(faqs)], home: true };
}
