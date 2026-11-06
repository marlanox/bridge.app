// THE THREE — the Vault. Supabase Edge Function.
//   GET  /vault/open?code=TT...   → { status: 'sealed', opens_at } | { status: 'open', ... } | 404
//   POST /vault/seal  (multipart: code, from, text, opens, notify, file?) → { ok: true, opens_at }
// Deploy: supabase functions deploy vault --no-verify-jwt
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const ORIGIN = Deno.env.get('SITE_ORIGIN') ?? '*'; // set to https://thethree.jewelry in production
const DAY = 86_400_000;
const cors = { 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const norm = (s: unknown) => String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const valid = (c: string) => /^TT[A-Z0-9]{8,14}$/.test(c);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  const url = new URL(req.url);
  const route = url.pathname.split('/').pop();

  if (req.method === 'GET' && route === 'open') {
    const code = norm(url.searchParams.get('code'));
    if (!valid(code)) return json({ error: 'Not a code.' }, 400);
    const { data: l } = await db.from('letters').select('*').eq('code', code).maybeSingle();
    if (!l) return json({ error: 'No letter.' }, 404);
    if (new Date(l.opens_at).getTime() > Date.now()) return json({ status: 'sealed', opens_at: l.opens_at });
    let media_url = null;
    if (l.media_path) {
      const { data } = await db.storage.from('vault').createSignedUrl(l.media_path, 3600);
      media_url = data?.signedUrl ?? null;
    }
    return json({ status: 'open', from: l.from_name, text: l.body, media_url, media_type: l.media_type, sealed_at: l.sealed_at, opens_at: l.opens_at });
  }

  if (req.method === 'POST' && route === 'seal') {
    const form = await req.formData();
    const code = norm(form.get('code'));
    if (!valid(code)) return json({ error: 'Enter the code from your order.' }, 400);
    const { data: known } = await db.from('codes').select('code').eq('code', code).maybeSingle();
    if (!known) return json({ error: 'This code is not ours.' }, 404);
    const { data: taken } = await db.from('letters').select('code').eq('code', code).maybeSingle();
    if (taken) return json({ error: 'A letter is already sealed behind this code.' }, 409);

    const text = String(form.get('text') ?? '').slice(0, 5000).trim();
    if (!text) return json({ error: 'The letter is empty.' }, 400);
    const opens = new Date(String(form.get('opens') ?? '') + 'T09:00:00Z');
    const now = Date.now();
    if (isNaN(opens.getTime()) || opens.getTime() < now + DAY / 2 || opens.getTime() > now + 366 * DAY) return json({ error: 'Choose a day within the next year.' }, 400);

    let media_path: string | null = null, media_type: string | null = null;
    const file = form.get('file');
    if (file instanceof File && file.size > 0) {
      if (file.size > 50 * 1024 * 1024) return json({ error: 'The file is larger than 50 MB.' }, 413);
      media_type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : null;
      if (!media_type) return json({ error: 'Only a photograph or a film.' }, 415);
      media_path = `${code}/${crypto.randomUUID()}`;
      const up = await db.storage.from('vault').upload(media_path, file, { contentType: file.type });
      if (up.error) return json({ error: 'The file could not be stored.' }, 500);
    }

    const { error } = await db.from('letters').insert({
      code, body: text, from_name: String(form.get('from') ?? '').slice(0, 80) || null,
      notify_email: String(form.get('notify') ?? '').slice(0, 200) || null,
      media_path, media_type, opens_at: opens.toISOString()
    });
    if (error) return json({ error: 'The Vault refused this letter.' }, 500);
    return json({ ok: true, opens_at: opens.toISOString() });
  }

  return json({ error: 'Not found.' }, 404);
});
