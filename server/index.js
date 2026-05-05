const express = require('express');
const cors    = require('cors');
const path    = require('path');

require('dotenv').config();

const { req, upsert } = require('./db');

const app  = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

app.use(cors());
app.use(express.json({ limit: '50mb' }));


function requireAuth(request, res, next) {
  if (request.headers['x-admin-token'] === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Unauthorized' });
}


app.post('/api/auth/login', (request, res) => {
  if (request.body.password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Nieprawidłowe hasło' });
  }
});


app.get('/api/projects', async (_, res) => {
  try {
    const rows = await req('GET', '/projects?order=id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', requireAuth, async (request, res) => {
  try {
    const rows = await req('POST', '/projects', request.body);
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', requireAuth, async (request, res) => {
  try {
    const rows = await req('PATCH', `/projects?id=eq.${request.params.id}`, request.body);
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', requireAuth, async (request, res) => {
  try {
    await req('DELETE', `/projects?id=eq.${request.params.id}`);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


app.get('/api/clients', async (_, res) => {
  try {
    const rows = await req('GET', '/clients?order=id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', requireAuth, async (request, res) => {
  try {
    const rows = await req('POST', '/clients', { name: request.body.name, logo: request.body.logo || '' });
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/clients/:id', requireAuth, async (request, res) => {
  try {
    await req('DELETE', `/clients?id=eq.${request.params.id}`);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


app.get('/api/content', async (_, res) => {
  try {
    const rows = await req('GET', '/site_content?order=key');
    const obj = {};
    rows.forEach(r => { obj[r.key] = r.value; });
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/content', requireAuth, async (request, res) => {
  try {
    const entries = Object.entries(request.body).map(([key, value]) => ({ key, value: String(value) }));
    const result = await upsert('/site_content', entries);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
