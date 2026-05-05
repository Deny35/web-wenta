require('dotenv').config();

const BASE = process.env.SUPABASE_URL + '/rest/v1';
const KEY  = process.env.SUPABASE_KEY;

const HEADERS = {
  'apikey':        KEY,
  'Authorization': 'Bearer ' + KEY,
  'Content-Type':  'application/json',
  'Prefer':        'return=representation'
};

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.details || res.status);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function upsert(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.details || res.status);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

module.exports = { req, upsert };
