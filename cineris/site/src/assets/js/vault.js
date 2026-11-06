/* ORDO CINERIS — the Vault and the Concordance.
   FRONT-END DEMONSTRATION. Real cells live on the server (see README: "Vault backend").
   Here, codes resolve deterministically so the ritual can be shown and tested. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const DAY = 86400000;

  async function sha(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 2166136261; // FNV fallback
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16).padStart(8, '0').repeat(8);
  }
  const norm = s => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const valid = s => /^KP[A-Z0-9]{8,14}$/.test(norm(s));

  /* ---------- open a cell ---------- */
  const vf = $('#vault-form');
  if (vf) {
    const out = $('#vault-out');
    const DEMO = {
      KP0001ASHE: { open: true, from: 'For M., from her father', body: 'You asked me once what I was afraid of. This. That you would be grown and I would not have said it. I am proud of you in a way that has no bottom. Wear this when you are frightened. — D.', sealed: '2026-03-02' },
      KP0007K4M9: { open: false, opens: '2027-06-21', from: 'Sealed by the giver' }
    };
    vf.addEventListener('submit', async e => {
      e.preventDefault();
      const raw = $('#vault-code').value;
      if (!valid(raw)) { out.innerHTML = 'That is not a passport code. It is engraved on the plate beside the clasp and begins with KP, for example KP-0007-K4M9.'; return; }
      const k = norm(raw);
      out.textContent = 'Reading the plate…';
      let cell = DEMO[k];
      if (!cell) {
        const h = await sha(k);
        const days = (parseInt(h.slice(0, 6), 16) % 540) + 3;
        cell = { open: false, opens: new Date(Date.now() + days * DAY).toISOString().slice(0, 10), from: 'Sealed' };
      }
      if (cell.open) {
        out.innerHTML = `CELL ${raw.toUpperCase()} · SEALED ${cell.sealed} · OPEN\n<span class="big">${cell.from}</span>${cell.body}`;
      } else {
        const d = Math.ceil((new Date(cell.opens) - Date.now()) / DAY);
        out.innerHTML = `CELL ${raw.toUpperCase()} · ${cell.from.toUpperCase()}\n<span class="big">This cell opens in ${d} days.</span>On ${new Date(cell.opens).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Not before. Not for us either.`;
      }
    });
  }

  /* ---------- concordance: two or more chains make a key ---------- */
  const cf = $('#conc-form');
  if (cf) {
    const out = $('#conc-out');
    const SAYINGS = [
      'One of you is owed an apology. The other already knows.',
      'Return to the place where you first lied to each other. Tell the truth there.',
      'Something you buried in 2019 wants to be dug up. Bring a witness.',
      'The next stranger who asks you for directions is part of this. Walk them there.',
      'Exchange chains for seven days. Do not explain why to anyone.',
      'Write the name you were almost given. Burn it. Keep the ash.',
      'One of you will be invited to a table. Only one chair is set.',
      'Call the person you have not called. Say only: the Order remembers.',
      'Your next argument ends the moment one of you touches the gold link.',
      'Plant something you will not live long enough to see grown.',
      'Pay a debt that is not yours. Do not let it be traced.',
      'Ask your oldest living relative what they never forgave. Listen to the end.'
    ];
    cf.addEventListener('submit', async e => {
      e.preventDefault();
      const codes = Array.from(cf.querySelectorAll('input')).map(i => i.value).filter(v => v.trim());
      if (codes.length < 2) { out.textContent = 'A concordance needs at least two passports. Enter both codes.'; return; }
      const bad = codes.find(c => !valid(c));
      if (bad) { out.textContent = `"${bad}" is not a passport code. Codes begin with KP and are engraved on the plate beside the clasp.`; return; }
      const set = Array.from(new Set(codes.map(norm))).sort();
      if (set.length < 2) { out.textContent = 'Those are the same chain. A concordance needs two different passports.'; return; }
      const h = (await sha(set.join('|'))).toUpperCase();
      const key = h.slice(0, 32).match(/.{4}/g).join('·');
      const cellNo = 'CXL-' + (parseInt(h.slice(32, 36), 16) % 999 + 1);
      const saying = SAYINGS[parseInt(h.slice(36, 40), 16) % SAYINGS.length];
      out.innerHTML = `CONCORDANCE OF ${set.length} · CELL ${cellNo}\n<span class="key">${key}</span>\n<span class="big">“${saying}”</span>This key exists only for these ${set.length} chains together. Lose one, and the cell does not answer.`;
    });
  }

  document.querySelectorAll('.samples button').forEach(b => b.addEventListener('click', () => {
    const t = document.getElementById(b.dataset.target);
    if (t) { t.value = b.textContent.trim(); t.focus(); }
  }));
})();
