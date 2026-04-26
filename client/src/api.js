// BASE – bazowy adres URL naszego API
// '/api' – Vite proxy zamienia to na 'http://localhost:3001/api' podczas developmentu
// Na produkcji serwer Express serwuje React i sam obsługuje /api
const BASE = '/api';

// Funkcja pomocnicza – zwraca nagłówki HTTP do wysyłania zapytań
// Jeśli użytkownik jest zalogowany, dodajemy token admina z sessionStorage
function authHeaders() {
  const token = sessionStorage.getItem('wenta_token'); // Pobieramy token zapisany przy logowaniu
  return {
    'Content-Type': 'application/json',                // Mówimy serwerowi że wysyłamy JSON
    ...(token ? { 'x-admin-token': token } : {})      // Jeśli token istnieje – dodajemy go do nagłówków
  };
}

// Funkcja pomocnicza – sprawdza odpowiedź HTTP i zwraca dane lub rzuca błąd
async function handle(res) {
  if (!res.ok) {
    // Jeśli status to 4xx lub 5xx – próbujemy odczytać błąd z JSON-a
    const body = await res.json().catch(() => ({})); // .catch – zabezpieczenie gdyby odpowiedź nie była JSON
    throw new Error(body.error || res.status);       // Rzucamy błąd z opisem
  }
  return res.json(); // Parsujemy poprawną odpowiedź jako JSON
}

// Obiekt api – wszystkie funkcje do komunikacji z serwerem
// Używamy go w komponentach React zamiast pisać fetch() bezpośrednio w każdym miejscu
export const api = {

  // Logowanie do panelu admina
  // password – hasło wpisane w formularzu
  login: (password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }) // Zamieniamy obiekt na JSON string
    }).then(handle),

  // Operacje na projektach
  projects: {
    // Pobiera wszystkie projekty (GET /api/projects)
    list: () => fetch(`${BASE}/projects`).then(handle),

    // Dodaje nowy projekt (POST /api/projects) – wymaga tokenu admina
    // data – obiekt z polami: title, category, year, img, images, opis, featured
    add: (data) => fetch(`${BASE}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    // Aktualizuje projekt o danym id (PUT /api/projects/:id) – wymaga tokenu admina
    // id   – numer id projektu
    // data – obiekt z polami do zmiany (nie trzeba podawać wszystkich)
    update: (id, data) => fetch(`${BASE}/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),

    // Usuwa projekt o danym id (DELETE /api/projects/:id) – wymaga tokenu admina
    remove: (id) => fetch(`${BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  },

  // Operacje na klientach (firmach w karuzeli)
  // Treść strony (hero, o firmie, kontakt itd.)
  content: {
    // Pobiera wszystkie pola treści jako obiekt { klucz: wartość }
    get: () => fetch(`${BASE}/content`).then(handle),
    // Zapisuje obiekt z polami do nadpisania
    save: (data) => fetch(`${BASE}/content`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(handle),
  },

  clients: {
    // Pobiera wszystkie firmy (GET /api/clients)
    list: () => fetch(`${BASE}/clients`).then(handle),

    // Dodaje nową firmę (POST /api/clients) – wymaga tokenu admina
    // name – nazwa firmy, logo – base64 string zdjęcia (opcjonalne)
    add: (name, logo = '') => fetch(`${BASE}/clients`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, logo })
    }).then(handle),

    // Usuwa firmę o danym id (DELETE /api/clients/:id) – wymaga tokenu admina
    remove: (id) => fetch(`${BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(handle),
  }
};
