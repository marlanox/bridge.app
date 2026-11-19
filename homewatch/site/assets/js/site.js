// Homeward site script: scroll scene, lead forms, plan builder. No dependencies.
(function () {
  var cfg = window.HW || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll scene on the home page: one CSS variable, updated once per frame.
  var scene = document.querySelector('.scene');
  if (scene && !reduce) {
    // Eased follow: the scene glides toward the scroll position instead of jumping with it.
    var target = 0, cur = 0, running = false;
    var read = function () {
      var r = scene.getBoundingClientRect();
      var max = r.height - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
    };
    var frame = function () {
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      scene.style.setProperty('--p', cur.toFixed(4));
      if (cur !== target) requestAnimationFrame(frame); else running = false;
    };
    var kick = function () { read(); if (!running) { running = true; requestAnimationFrame(frame); } };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    read(); cur = target; scene.style.setProperty('--p', cur.toFixed(4));
  } else if (scene) {
    scene.style.setProperty('--p', '1');
  }

  // 2. Remember where the visitor came from (ads, partners, referrals).
  var store = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };
  var qs = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'plan'].forEach(function (k) { if (qs.get(k)) store('hw_' + k, qs.get(k)); });

  // Prefill the message when someone arrives from a plan button or the plan builder.
  var plan = qs.get('plan'); var total = qs.get('total');
  if (plan) {
    var msg = document.querySelector('form[data-lead] textarea');
    if (msg && !msg.value) msg.value = 'Plan: ' + plan + (total ? ' · estimated $' + total + '/mo' : '') + (qs.get('extras') ? ' · extras: ' + qs.get('extras') : '');
  }

  // 3. Lead forms. Sends to Supabase when configured; otherwise opens an email to the office so no lead is lost.
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.company_website && form.company_website.value) return; // bot trap
      var name = form.querySelector('[name=name]'); var phone = form.querySelector('[name=phone]');
      var bad = false;
      [name, phone].forEach(function (f) { if (!f.value.trim()) { f.setAttribute('aria-invalid', 'true'); bad = true; } else f.removeAttribute('aria-invalid'); });
      if (bad) { (name.value.trim() ? phone : name).focus(); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== 'company_website') data[k] = v; });
      data.source = form.dataset.source; data.page = location.pathname;
      ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'plan'].forEach(function (k) { var v = store('hw_' + k); if (v) data[k] = v; });
      var btn = form.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
      var done = function () { form.classList.add('sent'); if (window.gtag) gtag('event', 'generate_lead', { form: data.source }); };
      if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
        fetch(cfg.supabaseUrl + '/rest/v1/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey, Prefer: 'return=minimal' },
          body: JSON.stringify(data),
        }).then(function (r) { if (!r.ok) throw r; done(); }).catch(function () { mailFallback(data); done(); });
      } else { mailFallback(data); done(); }
    });
  });
  function mailFallback(d) {
    var body = Object.keys(d).map(function (k) { return k + ': ' + d[k]; }).join('\n');
    var a = document.createElement('a');
    a.href = 'mailto:' + (cfg.email || '') + '?subject=' + encodeURIComponent('New request: ' + (d.need || 'website')) + '&body=' + encodeURIComponent(body);
    a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  }

  // 4. Plan builder on the pricing page.
  var builder = document.getElementById('builder');
  if (builder) {
    var out = document.getElementById('total'); var sum = document.getElementById('summary'); var reserve = document.getElementById('reserve');
    var base = reserve.getAttribute('href');
    var calc = function () {
      var t = 0; var names = []; var extras = [];
      builder.querySelectorAll('input:checked').forEach(function (i) {
        t += Number(i.dataset.price || 0);
        var label = i.closest('label').querySelector('b').textContent;
        if (i.name === 'plan') names.unshift(label); else if (i.name === 'addon') extras.push(label); else names.push(label);
      });
      out.textContent = '$' + t;
      sum.textContent = names.concat(extras).join(' · ');
      var planId = (builder.querySelector('input[name=plan]:checked') || {}).value;
      reserve.setAttribute('href', base + '?plan=' + planId + '&total=' + t + (extras.length ? '&extras=' + encodeURIComponent(extras.join(', ')) : ''));
    };
    builder.addEventListener('change', calc); calc();
  }

  // 5. Close the mobile menu after choosing a link.
  document.querySelectorAll('.burger nav a').forEach(function (a) { a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.open = false; }); });
})();
