const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function ok(body)        { return { statusCode: 200, headers: CORS, body: JSON.stringify(body) }; }
function fail(code, msg) { return { statusCode: code, headers: CORS, body: JSON.stringify({ error: msg }) }; }
function authOk(h)       { return h['x-admin-token'] === ADMIN_PASSWORD; }

exports.handler = async function(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

    const method = event.httpMethod;
    const qs     = event.queryStringParameters || {};
    const path   = qs.p || '/';
    const body   = event.body ? JSON.parse(event.body) : {};

    // Auth
    if (path === '/auth/login' && method === 'POST') {
      if (body.password === ADMIN_PASSWORD) return ok({ token: ADMIN_PASSWORD });
      return fail(401, 'Nieprawidłowe hasło');
    }

    const { getStore } = require('@netlify/blobs');
    const store = getStore('wenta');

    async function getList(key)       { return (await store.get(key, { type: 'json' })) || []; }
    async function setList(key, data) { await store.set(key, JSON.stringify(data)); }

    // Projects
    const projId = (path.match(/^\/projects\/(\d+)/) || [])[1];

    if (path === '/projects' && method === 'GET')  return ok(await getList('projects'));

    if (path === '/projects' && method === 'POST') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const list = await getList('projects');
      const item = { ...body, id: Date.now() };
      list.push(item);
      await setList('projects', list);
      return ok(item);
    }
    if (projId && method === 'PUT') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const list = await getList('projects');
      const idx  = list.findIndex(p => p.id === Number(projId));
      if (idx === -1) return fail(404, 'Not found');
      list[idx] = { ...list[idx], ...body };
      await setList('projects', list);
      return ok(list[idx]);
    }
    if (projId && method === 'DELETE') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const list = await getList('projects');
      await setList('projects', list.filter(p => p.id !== Number(projId)));
      return ok({ ok: true });
    }

    // Clients
    const clientId = (path.match(/^\/clients\/(\d+)/) || [])[1];

    if (path === '/clients' && method === 'GET')  return ok(await getList('clients'));

    if (path === '/clients' && method === 'POST') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const list = await getList('clients');
      const item = { id: Date.now(), name: body.name, logo: body.logo || '' };
      list.push(item);
      await setList('clients', list);
      return ok(item);
    }
    if (clientId && method === 'DELETE') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      const list = await getList('clients');
      await setList('clients', list.filter(c => c.id !== Number(clientId)));
      return ok({ ok: true });
    }

    // Content
    if (path === '/content' && method === 'GET')  return ok((await store.get('content', { type: 'json' })) || {});
    if (path === '/content' && method === 'PUT') {
      if (!authOk(event.headers)) return fail(401, 'Unauthorized');
      await store.set('content', JSON.stringify(body));
      return ok({ ok: true });
    }

    return fail(404, 'Not found: ' + path);

  } catch (e) {
    return fail(500, e.message);
  }
};
