const IS_PROD = import.meta.env.PROD;
const FN = '/.netlify/functions/api';

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

function url(path) {
  if (IS_PROD) return `${FN}?p=${encodeURIComponent(path)}`;
  return `/api${path}`;
}

export const api = {
  login: (password) =>
    fetch(url('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(handle),

  projects: {
    list:   ()       => fetch(url('/projects')).then(handle),
    add:    (data)   => fetch(url('/projects'), { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(handle),
    update: (id, d)  => fetch(url(`/projects/${id}`), { method: 'PUT',  headers: authHeaders(), body: JSON.stringify(d) }).then(handle),
    remove: (id)     => fetch(url(`/projects/${id}`), { method: 'DELETE', headers: authHeaders() }).then(handle),
  },

  clients: {
    list:   ()           => fetch(url('/clients')).then(handle),
    add:    (name, logo) => fetch(url('/clients'), { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, logo: logo || '' }) }).then(handle),
    remove: (id)         => fetch(url(`/clients/${id}`), { method: 'DELETE', headers: authHeaders() }).then(handle),
  },

  content: {
    get:  ()     => fetch(url('/content')).then(handle),
    save: (data) => fetch(url('/content'), { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }).then(handle),
  },
};
