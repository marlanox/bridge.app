/* THE THREE — the Vault. Seal a letter; open a letter on its day.
   With CINERIS_CONFIG.vaultApi set, everything goes to the server (see /vault/README.md).
   Without it, a clearly labelled demonstration keeps letters only in this browser. */
(function () {
  'use strict';
  const CFG = window.CINERIS_CONFIG || {};
  const API = (CFG.vaultApi || '').replace(/\/$/, '');
  const DAY = 864e5;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const pretty = c => c.replace(/^TT/, 'TT-').replace(/^(TT-.{4})/, '$1-');
  const valid = s => /^TT[A-Z0-9]{8,14}$/.test(norm(s));
  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const KEY = 'tt-vault-demo';
  const store = { get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; } } };
  const BUILT_IN = {
    TT0001ASHE: { from: 'D.', text: 'You asked me once what I was afraid of. This. That you would be grown and I would not have said it.\n\nI am proud of you in a way that has no bottom. Wear this when you are frightened.', sealed: '2026-03-02', opens: '2026-09-02' },
    TT0007K4M9: { from: '', text: '', sealed: '2026-10-01', opens: '2027-06-21' }
  };

  document.querySelectorAll('.mode-note').forEach(n => {
    n.textContent = API ? '' : 'Demonstration: until the Vault is connected, letters sealed here are kept only in this browser, on this device.';
  });

  /* ---------- open ---------- */
  const vf = $('#vault-form');
  if (vf) {
    const out = $('#vault-out');
    const show = cell => {
      if (!cell) { out.innerHTML = 'There is no letter behind this code yet.'; return; }
      const opens = new Date(cell.opens || cell.opens_at);
      if (opens > new Date()) {
        const d = Math.ceil((opens - Date.now()) / DAY);
        out.innerHTML = `<span class="big">This letter opens in ${d} day${d === 1 ? '' : 's'}.</span>On ${fmt(opens)}. Not before. Not for us either.`;
        return;
      }
      const media = cell.media_url || cell.media;
      const mtype = cell.media_type || (media && media.startsWith('data:video') ? 'video' : 'image');
      out.innerHTML = `<span class="cap dim">Sealed ${fmt(cell.sealed || cell.sealed_at)} · opened ${fmt(opens)}</span>
<div class="letter">${esc(cell.text || '').replace(/\n/g, '<br>')}</div>
${media ? (mtype === 'video' ? `<video src="${media}" controls playsinline style="width:100%"></video>` : `<img src="${media}" alt="">`) : ''}
${cell.from ? `<p class="it">— ${esc(cell.from)}</p>` : ''}`;
    };
    vf.addEventListener('submit', async e => {
      e.preventDefault();
      const raw = $('#vault-code').value;
      if (!valid(raw)) { out.textContent = 'That code is not ours. It is engraved by the clasp and begins with TT, for example TT-0007-K4M9.'; return; }
      const k = norm(raw);
      out.textContent = 'Reading…';
      if (API) {
        try {
          const r = await fetch(`${API}/open?code=${k}`);
          if (r.status === 404) return show(null);
          if (!r.ok) throw new Error(r.status);
          return show(await r.json());
        } catch (err) { out.textContent = 'The Vault did not answer. Try again in a minute.'; return; }
      }
      show(BUILT_IN[k] || store.get()[k]);
    });
  }

  /* ---------- seal ---------- */
  const sf = $('#seal-form');
  if (sf) {
    const out = $('#seal-out');
    const date = $('#s-date');
    const now = new Date();
    date.min = new Date(now.getTime() + DAY).toISOString().slice(0, 10);
    date.max = new Date(now.getTime() + (CFG.vaultMaxDays || 365) * DAY).toISOString().slice(0, 10);
    sf.addEventListener('submit', async e => {
      e.preventDefault();
      const code = $('#s-code').value;
      if (!valid(code)) { out.textContent = 'Enter the code from your order. It begins with TT.'; return; }
      const k = norm(code);
      const opens = date.value;
      if (!opens || opens < date.min || opens > date.max) { out.textContent = `Choose a day between ${fmt(date.min)} and ${fmt(date.max)}.`; return; }
      const file = $('#s-file').files[0];
      if (file && file.size > 50 * 1024 * 1024) { out.textContent = 'The file is larger than 50 MB.'; return; }
      out.textContent = 'Sealing…';
      if (API) {
        const fd = new FormData(sf);
        fd.set('code', k);
        try {
          const r = await fetch(`${API}/seal`, { method: 'POST', body: fd });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) { out.textContent = j.error || 'The Vault refused this letter.'; return; }
          sf.reset();
          out.innerHTML = `<span class="big">Sealed.</span>It opens on ${fmt(opens)} for whoever holds ${pretty(k)}.`;
        } catch (err) { out.textContent = 'The Vault did not answer. Nothing was sealed. Try again in a minute.'; }
        return;
      }
      // demonstration mode
      if (BUILT_IN[k] || store.get()[k]) { out.textContent = 'A letter is already sealed behind this code.'; return; }
      let media = '';
      if (file) {
        if (file.size > 2 * 1024 * 1024) { out.textContent = 'In the demonstration, files up to 2 MB only. The real Vault takes up to 50 MB.'; return; }
        media = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(''); fr.readAsDataURL(file); });
      }
      const all = store.get();
      all[k] = { from: $('#s-from').value.trim(), text: $('#s-text').value, media, sealed: new Date().toISOString().slice(0, 10), opens };
      if (!store.set(all)) { out.textContent = 'This browser will not keep the letter (private mode or storage blocked).'; return; }
      sf.reset();
      out.innerHTML = `<span class="big">Sealed.</span>It opens on ${fmt(opens)} for whoever holds ${pretty(k)}. <a href="vault.html">The Vault</a>.`;
    });
  }

  document.querySelectorAll('.samples button').forEach(b => b.addEventListener('click', () => {
    const t = document.getElementById(b.dataset.target);
    if (t) { t.value = b.textContent.trim(); t.focus(); }
  }));
})();
