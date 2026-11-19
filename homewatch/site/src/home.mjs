import { site, plans, offer } from './config.mjs';
import { services } from './data/services.mjs';
import { audiences } from './data/audiences.mjs';
import { locations } from './data/locations.mjs';
import { esc, makeLinker, leadForm, faqBlock, faqSchema } from './layout.mjs';
import { sceneSvg, landSvg } from './scene.mjs';

export const checkpoints = {
  en: [
    ['Exterior', ['Roof line, gutters and downspouts', 'Walls, stucco and paint for cracks', 'Windows and screens', 'Fences, gates and latches', 'Exterior lights and timers', 'Drainage and standing water', 'Pests and animal activity']],
    ['Entry & signs of occupancy', ['Every exterior door and lock tested', 'Garage doors and side entries', 'Signs of forced entry', 'Signs someone is living in the home', 'Alarm system status', 'Police authorization letter current']],
    ['Interior', ['Ceilings for water stains', 'Floors around toilets, tubs and sinks', 'Walls and windows for moisture or mold', 'Odors, pests and droppings', 'Smoke and CO detectors', 'Doors and windows locked inside', 'Blinds and lights set to look lived-in']],
    ['Systems', ['Run every tap and flush every toilet', 'Water heater and supply lines', 'HVAC running and thermostat setting', 'Fridge and freezer temperatures', 'Electrical panel and outages', 'Pool and spa equipment', 'Irrigation timer and leaks']],
    ['Mail & deliveries', ['Mail collected and scanned', 'Packages received and logged', 'Flyers and door hangers removed']],
    ['Landscape & city code', ['Branches over sidewalks and roofs', 'Dry brush and fire clearance', 'Lawn and planters cared for', 'City or HOA notices posted']],
  ],
  es: [
    ['Exterior', ['Techo, canaletas y bajantes', 'Paredes y estuco', 'Ventanas y mosquiteros', 'Cercas, rejas y cerrojos', 'Luces exteriores y temporizadores', 'Drenaje y agua estancada', 'Plagas y animales']],
    ['Entradas y ocupación', ['Cada puerta y cerradura', 'Garaje y entradas laterales', 'Señales de entrada forzada', 'Señales de que alguien vive allí', 'Estado de la alarma', 'Carta de autorización policial vigente']],
    ['Interior', ['Techos y manchas de agua', 'Pisos junto a baños y lavabos', 'Humedad y moho', 'Olores y plagas', 'Detectores de humo y CO', 'Puertas y ventanas cerradas', 'Persianas y luces para que parezca habitada']],
    ['Sistemas', ['Abrir llaves y descargar inodoros', 'Calentador y tuberías', 'Aire acondicionado y termostato', 'Temperatura del refrigerador', 'Panel eléctrico', 'Equipo de piscina y spa', 'Riego y fugas']],
    ['Correo y paquetes', ['Correo recogido y escaneado', 'Paquetes recibidos y registrados', 'Volantes retirados']],
    ['Jardín y código municipal', ['Ramas sobre aceras y techos', 'Maleza seca y prevención de incendios', 'Césped y jardineras', 'Avisos de la ciudad o HOA']],
  ],
};

export const generalFaqs = {
  en: [
    ['What exactly is home watch?', 'Scheduled visits to your home while you are away. We inspect the inside and outside, handle the mail, report with photos and act fast if something is wrong.'],
    ['How is this different from a property manager?', 'Property managers handle tenants and rent. We look after homes where no one is living, or where the owner is away, and we never take a percentage of rent.'],
    ['Are you insured?', 'Yes. Homeward is bonded and insured. We are happy to send a certificate of insurance to you or your insurer.'],
    ['Is there a long contract?', 'No. Plans are month to month. Cancel any time with 30 days’ notice.'],
    ['How do you keep my keys safe?', 'Keys are coded, never labeled with your address, and stored in a locked safe. Every key use is logged in your portal.'],
    ['Which areas do you cover?', 'West Hollywood, Beverly Hills, the Hollywood Hills, Bel Air, Brentwood, Santa Monica, the Palisades, Malibu, the east side and the Valley. Ask us about anywhere else in Los Angeles County.'],
    ['Can you also sell my home?', 'Yes. Our in-house licensed real estate agent can prepare, list and sell it, or we can work with your own agent.'],
    ['Do you speak Spanish?', 'Yes. Our team works in English and Spanish, and so do our reports.'],
  ],
  es: [
    ['¿Qué es exactamente la vigilancia de casas?', 'Visitas programadas a su casa mientras usted no está. Revisamos el interior y el exterior, recogemos el correo, enviamos un informe con fotos y actuamos rápido si algo anda mal.'],
    ['¿En qué se diferencia de un administrador de propiedades?', 'El administrador se ocupa de inquilinos y rentas. Nosotros cuidamos casas donde nadie vive o cuyo dueño está lejos, y nunca cobramos un porcentaje de la renta.'],
    ['¿Están asegurados?', 'Sí. Homeward está afianzada y asegurada. Enviamos el certificado de seguro a usted o a su aseguradora.'],
    ['¿Hay contrato a largo plazo?', 'No. Los planes son mes a mes. Puede cancelar con 30 días de aviso.'],
    ['¿Cómo protegen mis llaves?', 'Las llaves se codifican, nunca llevan su dirección y se guardan en una caja fuerte. Cada uso queda registrado en su portal.'],
    ['¿Hablan español?', 'Sí. Nuestro equipo trabaja en inglés y en español, y también nuestros informes.'],
  ],
};

const T = {
  en: {
    title: 'Homeward | Home Watch & Estate Services in Los Angeles',
    description: 'Premium home watch for vacant and second homes in Los Angeles. Weekly visits, photo reports, mail handling, vendor access, pre-sale preparation and more. From $189/mo.',
    eyebrow: 'Home watch · Los Angeles', h1: 'Your home, <em>kept</em> while you’re away.',
    lead: 'Every week a Homeward inspector walks your home, room by room, and sends you a photo report before they have even left the driveway.',
    cta1: 'Book a free walkthrough', cta2: 'See plans', scroll: 'Scroll',
    logHead: ['Tuesday visit', '6:42 pm'],
    log: [['6:42', 'Arrived · alarm disarmed'], ['6:44', 'Doors, locks & windows'], ['6:49', 'Living room & kitchen'], ['6:53', 'Water, HVAC & fridge'], ['6:58', 'Upstairs & bathrooms'], ['7:06', 'Pool, garden & gates'], ['7:11', 'Report sent · 38 photos']],
    logFoot: ['Your inspector', 'All clear'],
    trust: ['Bonded & insured', 'Report within 2 hours', 'Licensed agent on staff', 'English & Español', 'Office in West Hollywood'],
    checkEyebrow: 'The Homeward visit', checkH: '34 checkpoints, every visit.', checkP: 'The same list every time, photographed every time. So when something changes, we notice.',
    plansEyebrow: 'Plans', plansH: 'Simple monthly plans. No long contracts.', plansP: 'Every plan includes the full inspection, photo reports, key holding, emergency response and your private portal.', choose: 'Choose', mostChosen: 'Most chosen', perMonth: '/mo', compare: 'Build your plan and see the exact price',
    ladderEyebrow: 'Beyond home watch', ladderH: 'Home watch is where trust starts. It is not where we stop.', ladderP: 'Once we know your home, we can take care of almost anything it needs, all the way to selling it for you.',
    ladder: [['vendor-contractor-access', 'Care for it', 'Gardeners, pool, cleaners, repairs. We hire them, let them in and check the work.'], ['pre-sale-preparation-staging', 'Prepare it', 'Repairs, staging, furniture, art, flowers and photography, on your budget.'], ['sell-your-home', 'Sell it', 'Our licensed agent lists and sells the home we already know best.'], ['power-of-attorney-services', 'Act for you', 'With your limited power of attorney: permits, inspectors, insurance, auctions.']],
    howEyebrow: 'How it works', howH: 'Up and running in a week.',
    steps: [['Free walkthrough', 'We meet you or your representative at the home and learn how it works: shut-offs, alarm, vendors, quirks.'], ['Your home profile', 'Keys are coded and stored. We write your emergency plan and set the visit schedule together.'], ['Weekly visits', 'The same inspector, the same 34 checkpoints, a photo report within 2 hours.'], ['Everything in one place', 'Reports, photos, scanned mail, requests and invoices live in your private portal.']],
    portalEyebrow: 'Your private portal', portalH: 'Every visit, every photo, every letter. In your pocket.', portalP: 'Log in from anywhere to see your home’s full history, approve vendor quotes, request a service or message your house manager. Your family, attorney or agent can get their own access.', portalCta: 'Preview the portal',
    portalItems: [['Visit report · all clear', 'Tue, 7:11 pm', ''], ['Mail scanned · 6 items', 'Tue, 6:47 pm', ''], ['Branch over sidewalk', 'Trim booked for Fri', 'warn'], ['Pool service checked', 'Mon, 10:20 am', '']],
    whoEyebrow: 'Who we serve', whoH: 'For anyone whose home is waiting for them.',
    revEyebrow: 'Reviews', revH: 'What our clients say.',
    reviews: [['We spent five months in London. Every Tuesday I opened the report and stopped worrying about the house.', 'Signature plan · West Hollywood'], ['They found a slow leak under the guest bathroom sink in week two. That one visit paid for the year.', 'Signature plan · Hollywood Hills'], ['Staging, photos and open houses, all while I was in New York. It sold in eleven days.', 'Pre-sale & sale · Silver Lake']],
    sample: 'Sample review · replace with real reviews before launch',
    offerP: 'And when you refer a friend, you both get one month free.', offerCta: 'Claim a founding spot', referral: 'How referrals work',
    areasEyebrow: 'Where we work', areasH: 'Los Angeles, neighborhood by neighborhood.',
    faqEyebrow: 'Questions', faqH: 'Good questions, straight answers.', allFaq: 'All questions',
    endEyebrow: 'Start here', endH: 'See what we would check at your home.', endP: 'Book a free 30-minute walkthrough. We will show you exactly what we look for, and you keep the written risk check even if you do not sign up.',
  },
  es: {
    title: 'Homeward | Vigilancia de casas en Los Ángeles',
    description: 'Vigilancia de casas vacías y segundas residencias en Los Ángeles. Visitas semanales, informes con fotos, correo, proveedores y preparación para la venta. Desde $189/mes.',
    eyebrow: 'Vigilancia de casas · Los Ángeles', h1: 'Su casa, <em>cuidada</em> mientras usted no está.',
    lead: 'Cada semana un inspector de Homeward recorre su casa, habitación por habitación, y le envía un informe con fotos al terminar.',
    cta1: 'Reserve una visita gratis', cta2: 'Ver planes', scroll: 'Desplace',
    logHead: ['Visita del martes', '6:42 pm'],
    log: [['6:42', 'Llegada · alarma desactivada'], ['6:44', 'Puertas, cerraduras y ventanas'], ['6:49', 'Sala y cocina'], ['6:53', 'Agua, aire y refrigerador'], ['6:58', 'Planta alta y baños'], ['7:06', 'Piscina, jardín y rejas'], ['7:11', 'Informe enviado · 38 fotos']],
    logFoot: ['Su inspector', 'Todo en orden'],
    trust: ['Afianzados y asegurados', 'Informe en 2 horas', 'Agente con licencia', 'English & Español', 'Oficina en West Hollywood'],
    checkEyebrow: 'La visita Homeward', checkH: '34 puntos en cada visita.', checkP: 'La misma lista cada vez, con fotos cada vez. Así notamos cualquier cambio.',
    plansEyebrow: 'Planes', plansH: 'Planes mensuales simples. Sin contratos largos.', plansP: 'Todos los planes incluyen la inspección completa, informes con fotos, custodia de llaves, respuesta a emergencias y su portal privado.', choose: 'Elegir', mostChosen: 'El más elegido', perMonth: '/mes', compare: 'Arme su plan y vea el precio exacto',
    ladderEyebrow: 'Más que vigilancia', ladderH: 'La vigilancia es donde empieza la confianza.', ladderP: 'Cuando conocemos su casa, podemos encargarnos de casi todo lo que necesita, hasta venderla por usted.',
    ladder: [['vendor-contractor-access', 'Cuidarla', 'Jardineros, piscina, limpieza y reparaciones. Los contratamos, les abrimos y revisamos el trabajo.'], ['pre-sale-preparation-staging', 'Prepararla', 'Reparaciones, decoración, muebles, flores y fotografía, según su presupuesto.'], ['sell-your-home', 'Venderla', 'Nuestro agente con licencia vende la casa que ya conocemos mejor que nadie.'], ['power-of-attorney-services', 'Actuar por usted', 'Con un poder notarial limitado: permisos, inspectores, seguros y subastas.']],
    howEyebrow: 'Cómo funciona', howH: 'Listo en una semana.',
    steps: [['Visita gratis', 'Nos reunimos en la casa y aprendemos cómo funciona: llaves de paso, alarma, proveedores.'], ['Perfil de su casa', 'Codificamos y guardamos las llaves, y acordamos el plan de emergencia y el horario.'], ['Visitas semanales', 'El mismo inspector, los mismos 34 puntos, informe en 2 horas.'], ['Todo en un lugar', 'Informes, fotos, correo escaneado, solicitudes y facturas en su portal privado.']],
    portalEyebrow: 'Su portal privado', portalH: 'Cada visita, cada foto, cada carta. En su bolsillo.', portalP: 'Entre desde cualquier lugar para ver el historial completo de su casa, aprobar presupuestos o pedir un servicio.', portalCta: 'Ver el portal',
    portalItems: [['Informe · todo en orden', 'Mar, 7:11 pm', ''], ['Correo escaneado · 6', 'Mar, 6:47 pm', ''], ['Rama sobre la acera', 'Poda el viernes', 'warn'], ['Piscina revisada', 'Lun, 10:20 am', '']],
    whoEyebrow: 'Para quién', whoH: 'Para todo aquel cuya casa le espera.',
    revEyebrow: 'Opiniones', revH: 'Lo que dicen nuestros clientes.',
    reviews: [['Pasamos cinco meses en Londres. Cada martes leía el informe y dejaba de preocuparme.', 'Plan Signature · West Hollywood'], ['Encontraron una fuga lenta en la segunda semana. Esa visita pagó todo el año.', 'Plan Signature · Hollywood Hills'], ['Preparación, fotos y casas abiertas mientras yo estaba en Nueva York. Se vendió en once días.', 'Venta · Silver Lake']],
    sample: 'Opinión de ejemplo · reemplazar antes del lanzamiento',
    offerP: 'Y si nos recomienda a un amigo, ambos reciben un mes gratis.', offerCta: 'Reservar mi lugar', referral: 'Cómo funcionan las referencias',
    areasEyebrow: 'Dónde trabajamos', areasH: 'Los Ángeles, vecindario por vecindario.',
    faqEyebrow: 'Preguntas', faqH: 'Preguntas claras, respuestas directas.', allFaq: 'Todas las preguntas',
    endEyebrow: 'Empiece aquí', endH: 'Vea lo que revisaríamos en su casa.', endP: 'Reserve una visita gratis de 30 minutos. Le mostramos lo que revisamos y se queda con el informe de riesgos aunque no contrate.',
  },
};

export function homePage(lang = 'en') {
  const path = lang === 'es' ? 'es/index' : 'index';
  const { link } = makeLinker(path);
  const t = T[lang];
  const tStep = [0.06, 0.18, 0.3, 0.42, 0.54, 0.68, 0.8];
  const log = t.log.map(([time, txt], i) => `<li style="--t:${tStep[i]}"><time>${time}</time><i></i><span>${txt}</span></li>`).join('');
  const checks = checkpoints[lang].map(([h, items]) => `<div class="rv"><h3>${h} <span>${items.length}</span></h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('');
  const plansHtml = plans.map((p) => `<div class="plan${p.featured ? ' featured' : ''}">${p.featured ? `<span class="badge">${t.mostChosen}</span>` : ''}<h3>${p.name}</h3><p class="muted small">${lang === 'es' ? p.es.cadence : p.cadence}</p><div class="amt">$${p.price}<small>${t.perMonth}</small></div>${lang === 'en' ? `<p class="small">${p.pitch}</p>` : ''}<ul>${p.features.slice(0, 5).map((f) => `<li>${f}</li>`).join('')}</ul><a class="btn${p.featured ? '' : ' line'}" href="${link((lang === 'es' ? 'es/contacto' : 'get-started'))}?plan=${p.id}">${t.choose} ${p.name}</a></div>`).join('');
  const ladder = t.ladder.map(([s, h, p], i) => `<a href="${link(s)}" class="rv"><span class="n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></a>`).join('');
  const steps = t.steps.map(([h, p]) => `<li class="rv"><h3>${h}</h3><p class="muted">${p}</p></li>`).join('');
  const pItems = t.portalItems.map(([a, b, c]) => `<div class="item"><span class="dot ${c}"></span><span>${a}</span><small>${b}</small></div>`).join('');
  const who = audiences.slice(0, 8).map((a) => `<a class="card rv" href="${link('for/' + a.slug)}"><span class="k">${a.partner ? (lang === 'es' ? 'Socios' : 'Partners') : (lang === 'es' ? 'Propietarios' : 'Owners')}</span><h3>${esc(a.name)}</h3><span class="more arrow"></span></a>`).join('');
  const reviews = t.reviews.map(([q, w]) => `<figure class="review rv" style="margin:0"><span class="stars" aria-label="5 out of 5">★★★★★</span><q>${q}</q><figcaption class="who">${w}</figcaption><span class="sample">${t.sample}</span></figure>`).join('');
  const areas = locations.map((l) => `<li><a href="${link('home-watch/' + l.slug)}">${l.name}</a></li>`).join('');
  const faqs = generalFaqs[lang];

  const body = `
<section class="scene" id="top" aria-label="${lang === 'es' ? 'Introducción' : 'Introduction'}">
  <div class="stage">
    <div class="sky"></div><div class="night"></div><div class="stars"></div>
    <div class="land">${landSvg()}<div class="ground"></div></div>
    <div class="house">${sceneSvg()}</div>
    <div class="wrap copy on-dark">
      <div>
        <span class="eyebrow" style="color:var(--slate)">${t.eyebrow}</span>
        <h1 style="margin-top:18px">${t.h1}</h1>
        <p class="lead">${t.lead}</p>
        <div class="row"><a class="btn arrow" href="#start">${t.cta1}</a><a class="btn line" href="#plans">${t.cta2}</a><a class="tel" href="tel:${site.phoneE164}">${site.phone}</a></div>
      </div>
      <div class="log" aria-label="${lang === 'es' ? 'Ejemplo de registro de visita' : 'Example visit log'}">
        <div class="log-h"><span>${t.logHead[0]}</span><span>${t.logHead[1]}</span></div>
        <ol>${log}</ol>
        <div class="log-f"><span>${t.logFoot[0]}</span><b>${t.logFoot[1]}</b></div>
      </div>
    </div>
    <span class="cue" aria-hidden="true">${t.scroll}</span>
  </div>
</section>
<div class="trust"><div class="wrap"><ul>${t.trust.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.checkEyebrow}</span><h2>${t.checkH}</h2><p class="lead muted">${t.checkP}</p></div>
  <div class="checks">${checks}</div>
</div></section>

<section class="sec stone" id="plans"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.plansEyebrow}</span><h2>${t.plansH}</h2><p class="lead muted">${t.plansP}</p></div>
  <div class="plans rv">${plansHtml}</div>
  <p style="margin-top:22px"><a href="${link(lang === 'es' ? 'es/precios' : 'pricing')}" class="small">${t.compare} →</a></p>
</div></section>

<section class="sec dark"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.ladderEyebrow}</span><h2>${t.ladderH}</h2><p class="lead">${t.ladderP}</p></div>
  <div class="ladder">${ladder}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.howEyebrow}</span><h2>${t.howH}</h2></div>
  <ol class="steps">${steps}</ol>
</div></section>

<section class="sec paper rule"><div class="wrap portal">
  <div style="display:grid;gap:18px"><span class="eyebrow">${t.portalEyebrow}</span><h2>${t.portalH}</h2><p class="lead muted">${t.portalP}</p><p><a class="btn line arrow" href="${link('portal')}">${t.portalCta}</a></p></div>
  <div class="device rv" aria-hidden="true"><div class="top"><span>${site.name} · Laurel Ave</span><span>Week 46</span></div><div class="photos"><span></span><span></span><span></span><span></span></div>${pItems}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.whoEyebrow}</span><h2>${t.whoH}</h2></div>
  <div class="grid g4">${who}</div>
</div></section>

<section class="sec stone"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.revEyebrow}</span><h2>${t.revH}</h2></div>
  <div class="reviews">${reviews}</div>
</div></section>

<section class="sec tight dark"><div class="wrap offer">
  <div style="display:grid;gap:10px"><span class="eyebrow" style="color:var(--glow)">${offer.title}</span><h2 style="font-size:clamp(26px,3vw,36px)">${lang === 'es' ? offer.es : offer.text}</h2><p class="muted">${t.offerP} <a href="${link('referral')}">${t.referral}</a></p></div>
  <div class="on-dark"><a class="btn arrow" href="#start">${t.offerCta}</a></div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">${t.areasEyebrow}</span><h2>${t.areasH}</h2></div>
  <ul class="links">${areas}</ul>
</div></section>

<section class="sec paper rule"><div class="wrap split">
  <div style="display:grid;gap:18px;align-content:start"><span class="eyebrow">${t.faqEyebrow}</span><h2>${t.faqH}</h2><p><a class="small" href="${link(lang === 'es' ? 'es/preguntas-frecuentes' : 'faq')}">${t.allFaq} →</a></p></div>
  ${faqBlock(faqs)}
</div></section>

<section class="sec dark" id="start"><div class="wrap split">
  <div style="display:grid;gap:18px;align-content:start"><span class="eyebrow">${t.endEyebrow}</span><h2>${t.endH}</h2><p class="lead">${t.endP}</p>
    <p style="margin-top:12px"><a href="tel:${site.phoneE164}" style="font:400 30px/1.2 var(--serif);color:var(--stone);text-decoration:none">${site.phone}</a><br><span class="muted">${site.email}</span><br><span class="muted">${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.zip}</span></p>
  </div>
  ${leadForm({ path, lang, id: 'start-form', dark: true, source: 'home-bottom' })}
</div></section>`;
  return { path, lang, title: t.title, description: t.description, body, schema: [faqSchema(faqs)], home: true };
}
