const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

const DATA_DIR = path.join(__dirname, 'data');

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

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

app.get('/api/projects', (req, res) => {
  res.json(readJSON('projects.json'));
});

app.post('/api/projects', requireAuth, (req, res) => {
  const projects = readJSON('projects.json');
  const item = { ...req.body, id: Date.now() };
  projects.push(item);
  writeJSON('projects.json', projects);
  res.json(item);
});

app.put('/api/projects/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const projects = readJSON('projects.json');
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  projects[idx] = { ...projects[idx], ...req.body };
  writeJSON('projects.json', projects);
  res.json(projects[idx]);
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const projects = readJSON('projects.json');
  writeJSON('projects.json', projects.filter(p => p.id !== id));
  res.json({ ok: true });
});

app.get('/api/clients', (req, res) => {
  res.json(readJSON('clients.json'));
});

app.post('/api/clients', requireAuth, (req, res) => {
  const clients = readJSON('clients.json');
  const item = { id: Date.now(), name: req.body.name, logo: req.body.logo || '' };
  clients.push(item);
  writeJSON('clients.json', clients);
  res.json(item);
});

app.delete('/api/clients/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const clients = readJSON('clients.json');
  writeJSON('clients.json', clients.filter(c => c.id !== id));
  res.json({ ok: true });
});

app.get('/api/content', (req, res) => {
  res.json(readJSON('content.json'));
});

app.put('/api/content', requireAuth, (req, res) => {
  writeJSON('content.json', req.body);
  res.json({ ok: true });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
