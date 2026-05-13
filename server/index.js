const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const { query, init } = require('./db');

const app  = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

function requireAuth(req, res, next) {
  if (req.headers['x-admin-token'] === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.post('/api/auth/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Nieprawidłowe hasło' });
  }
});

// Projects
app.get('/api/projects', async (_, res) => {
  try {
    const rows = await query('SELECT * FROM projects ORDER BY id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', requireAuth, async (req, res) => {
  try {
    const { title, category, year, img, images, opis, short_desc, featured } = req.body;
    const id = Date.now();
    const rows = await query(
      `INSERT INTO projects (id, title, category, year, img, images, opis, short_desc, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, title, category, year, img || '', JSON.stringify(images || []), opis || '', short_desc || '', featured || false]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fields = req.body;
    const keys   = Object.keys(fields);
    const values = keys.map(k => k === 'images' ? JSON.stringify(fields[k]) : fields[k]);
    const set    = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const rows   = await query(`UPDATE projects SET ${set} WHERE id = $1 RETURNING *`, [id, ...values]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Productions (Co produkujemy)
app.get('/api/productions', async (_, res) => {
  try {
    const rows = await query('SELECT * FROM productions ORDER BY sort_order, id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/productions', requireAuth, async (req, res) => {
  try {
    const { title, desc, img, icon } = req.body;
    const id = Date.now();
    const count = await query('SELECT COUNT(*) FROM productions');
    const sort_order = parseInt(count[0].count);
    const rows = await query(
      'INSERT INTO productions (id, title, "desc", img, icon, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, title, desc || '', img || '', icon || '', sort_order]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/productions/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fields = req.body;
    const keys   = Object.keys(fields);
    const values = keys.map(k => fields[k]);
    const set    = keys.map((k, i) => `"${k}" = $${i + 2}`).join(', ');
    const rows   = await query(`UPDATE productions SET ${set} WHERE id = $1 RETURNING *`, [id, ...values]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/productions/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM productions WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Services
app.get('/api/services', async (_, res) => {
  try {
    const rows = await query('SELECT * FROM services ORDER BY sort_order, id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/services', requireAuth, async (req, res) => {
  try {
    const { title, short_desc, opis, img, images, tags } = req.body;
    const id = Date.now();
    const count = await query('SELECT COUNT(*) FROM services');
    const sort_order = parseInt(count[0].count);
    const rows = await query(
      `INSERT INTO services (id, title, short_desc, opis, img, images, tags, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, title, short_desc || '', opis || '', img || '', JSON.stringify(images || []), JSON.stringify(tags || []), sort_order]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/services/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fields = req.body;
    const keys   = Object.keys(fields);
    const values = keys.map(k => ['images','tags'].includes(k) ? JSON.stringify(fields[k]) : fields[k]);
    const set    = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const rows   = await query(`UPDATE services SET ${set} WHERE id = $1 RETURNING *`, [id, ...values]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/services/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM services WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Products
app.get('/api/products', async (_, res) => {
  try {
    const rows = await query('SELECT * FROM products ORDER BY sort_order, id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM products WHERE id = $1', [Number(req.params.id)]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { title, category, short_desc, opis, img, images, featured } = req.body;
    const id = Date.now();
    const rows = await query(
      `INSERT INTO products (id, title, category, short_desc, opis, img, images, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, title, category || '', short_desc || '', opis || '', img || '', JSON.stringify(images || []), featured || false]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fields = req.body;
    const keys   = Object.keys(fields);
    const values = keys.map(k => k === 'images' ? JSON.stringify(fields[k]) : fields[k]);
    const set    = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const rows   = await query(`UPDATE products SET ${set} WHERE id = $1 RETURNING *`, [id, ...values]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Clients
app.get('/api/clients', async (_, res) => {
  try {
    const rows = await query('SELECT * FROM clients ORDER BY id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', requireAuth, async (req, res) => {
  try {
    const id   = Date.now();
    const rows = await query(
      'INSERT INTO clients (id, name, logo) VALUES ($1,$2,$3) RETURNING *',
      [id, req.body.name, req.body.logo || '']
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/clients/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM clients WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Content
app.get('/api/content', async (_, res) => {
  try {
    const rows = await query('SELECT key, value FROM site_content');
    const obj  = {};
    rows.forEach(r => { obj[r.key] = r.value; });
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/content', requireAuth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        'INSERT INTO site_content (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [key, String(value)]
      );
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');

init().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(e => {
  console.error('DB init failed:', e.message, e.stack);
  process.exit(1);
});
