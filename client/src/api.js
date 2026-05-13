const BASE = '/api';

function authHeaders() {
  const token = sessionStorage.getItem('wenta_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'x-admin-token': token } : {})
  };
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.status);
  }
  return res.json();
}

export const api = {

  login: (password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(handle),

  projects: {
    list: () => fetch(`${BASE}/projects`).then(handle),

    add: (data) => fetch(`${BASE}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    update: (id, data) => fetch(`${BASE}/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    remove: (id) => fetch(`${BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  },

  productions: {
    list: () => fetch(`${BASE}/productions`).then(handle),

    add: (data) => fetch(`${BASE}/productions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    update: (id, data) => fetch(`${BASE}/productions/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    remove: (id) => fetch(`${BASE}/productions/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  },

  services: {
    list: () => fetch(`${BASE}/services`).then(handle),

    add: (data) => fetch(`${BASE}/services`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    update: (id, data) => fetch(`${BASE}/services/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    remove: (id) => fetch(`${BASE}/services/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  },

  products: {
    list: () => fetch(`${BASE}/products`).then(handle),
    get: (id) => fetch(`${BASE}/products/${id}`).then(handle),

    add: (data) => fetch(`${BASE}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    update: (id, data) => fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    remove: (id) => fetch(`${BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  },

  content: {
    get: () => fetch(`${BASE}/content`).then(handle),
    save: (data) => fetch(`${BASE}/content`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),
  },

  clients: {
    list: () => fetch(`${BASE}/clients`).then(handle),

    add: (name, logo = '') => fetch(`${BASE}/clients`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, logo })
    }).then(handle),

    remove: (id) => fetch(`${BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  }
};
