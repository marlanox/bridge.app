// Client portal sign-in through Supabase Auth (REST, no library).
// Until Supabase keys are set in src/config.mjs, the login page points to the demo portal.
(function () {
  var cfg = window.HW || {};
  var on = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  var form = document.getElementById('login');
  var key = 'hw_session';
  var save = function (s) { try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) {} };
  var load = function () { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } };
  var api = function (path, body, token) {
    return fetch(cfg.supabaseUrl + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + (token || cfg.supabaseAnonKey) }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
  };

  if (form) {
    var msg = document.getElementById('login-msg');
    if (!on) document.getElementById('login-note').hidden = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!on) { msg.textContent = 'The portal is not connected yet. Open the demo above.'; return; }
      msg.textContent = 'Signing in…';
      api('/auth/v1/token?grant_type=password', { email: form.querySelector('#li-email').value, password: form.querySelector('#li-pass').value })
        .then(function (s) { save(s); location.href = cfg.portalUrl || 'portal.html'; })
        .catch(function () { msg.textContent = 'Email or password is not right. Try again or use a sign-in link.'; });
    });
    document.getElementById('magic').addEventListener('click', function () {
      var email = form.querySelector('#li-email').value;
      if (!email) { msg.textContent = 'Enter your email first.'; return; }
      if (!on) { msg.textContent = 'The portal is not connected yet.'; return; }
      api('/auth/v1/otp', { email: email, create_user: false }).then(function () { msg.textContent = 'Check your email for a sign-in link.'; }).catch(function () { msg.textContent = 'We could not send the link. Call us and we will help.'; });
    });
  }

  // Portal page: with a session, load the client's own visits (protected by row-level security).
  var root = document.getElementById('portal-root');
  var s = load();
  if (root && on && s && s.access_token) {
    api('/rest/v1/visits?select=visited_at,inspector_name,photo_count,result&order=visited_at.desc&limit=10', null, s.access_token).then(function (rows) {
      document.getElementById('demo-banner').hidden = true;
      var tb = root.querySelector('#visits tbody');
      tb.innerHTML = rows.map(function (r) { return '<tr><td>' + new Date(r.visited_at).toLocaleString() + '</td><td>' + (r.inspector_name || '') + '</td><td>' + (r.photo_count || 0) + '</td><td><span class="pill ' + (r.result === 'all_clear' ? 'ok">All clear' : 'warn">' + r.result) + '</span></td></tr>'; }).join('');
    }).catch(function () {});
  }
})();
