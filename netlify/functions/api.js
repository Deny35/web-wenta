const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function ok(body)        { return { statusCode: 200, headers: CORS, body: JSON.stringify(body) }; }
function fail(code, msg) { return { statusCode: code, headers: CORS, body: JSON.stringify({ error: msg }) }; }
function authOk(headers) { return headers['x-admin-token'] === ADMIN_PASSWORD; }

async function getList(store, key) {
  const { getStore } = require('@netlify/blobs');
  const s = store || getStore('wenta');
  return (await s.get(key, { type: 'json' })) || [];
}

async function setList(store, key, data) {
  await store.set(key, JSON.stringify(data));
}

exports.handler = async function(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

    const method = event.httpMethod;
    const path   = (event.path || '')
      .replace(/\/.netlify\/functions\/api/, '')
      .replace(/^\/api/, '') || '/';
    const body   = event.body ? JSON.parse(event.body) : {};

    // Auth – nie wymaga storage
    if (path === '/auth/login' && method === 'POST') {
      if (body.password === ADMIN_PASSWORD) return ok({ token: ADMIN_PASSWORD });
      return fail(401, 'Nieprawidłowe hasło');
    }

    // Storage – inicjalizowane tylko gdy potrzebne
    const { getStore } = require('@netlify/blobs');
    const store = getStore('wenta');

    // Projects
    const projId   = (path.match(/^\/projects\/(\d+)/) || [])[1];

    if (path === '/projects' && method === 'GET') {
      return ok(await getList(store, 'projects'));
    }
    if (path === '/projects' && method === 'POST') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const projects = await getList(store, 'projects');
      const item = { ...body, id: Date.now() };
      projects.push(item);
      await setList(store, 'projects', projects);
      return ok(item);
    }
    if (projId && method === 'PUT') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const projects = await getList(store, 'projects');
      const idx = projects.findIndex(p => p.id === Number(projId));
      if (idx === -1) return fail(404, 'Not found');
      projects[idx] = { ...projects[idx], ...body };
      await setList(store, 'projects', projects);
      return ok(projects[idx]);
    }
    if (projId && method === 'DELETE') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const projects = await getList(store, 'projects');
      await setList(store, 'projects', projects.filter(p => p.id !== Number(projId)));
      return ok({ ok: true });
    }

    // Clients
    const clientId = (path.match(/^\/clients\/(\d+)/) || [])[1];

    if (path === '/clients' && method === 'GET') {
      return ok(await getList(store, 'clients'));
    }
    if (path === '/clients' && method === 'POST') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const clients = await getList(store, 'clients');
      const item = { id: Date.now(), name: body.name, logo: body.logo || '' };
      clients.push(item);
      await setList(store, 'clients', clients);
      return ok(item);
    }
    if (clientId && method === 'DELETE') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const clients = await getList(store, 'clients');
      await setList(store, 'clients', clients.filter(c => c.id !== Number(clientId)));
      return ok({ ok: true });
    }

    // Content
    if (path === '/content' && method === 'GET') {
      return ok((await store.get('content', { type: 'json' })) || {});
    }
    if (path === '/content' && method === 'PUT') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      await store.set('content', JSON.stringify(body));
      return ok({ ok: true });
    }

    return fail(404, 'Not found');

  } catch (e) {
    return fail(500, e.message);
  }
};
