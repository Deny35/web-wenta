// Importujemy framework Express – służy do tworzenia serwera HTTP i definiowania tras (routes)
const express = require('express');

// Importujemy cors – middleware który pozwala przeglądarce na zapytania do innego adresu/portu
// Bez tego React (port 5173) nie mógłby odpytywać serwera (port 3001)
const cors    = require('cors');

// Importujemy path – wbudowany moduł Node.js do operacji na ścieżkach plików
const path    = require('path');

// Ładujemy zmienne środowiskowe z pliku .env (PORT, ADMIN_PASSWORD itd.)
require('dotenv').config();

// Importujemy naszą funkcję req() do komunikacji z Supabase
const { req, upsert } = require('./db');

// Tworzymy instancję aplikacji Express
const app  = express();

// Port na którym będzie nasłuchiwał serwer; domyślnie 3001 jeśli nie ustawiony w .env
const PORT = process.env.PORT || 3001;

// Hasło admina z pliku .env; domyślnie 'wenta2025' jeśli nie ustawione
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wenta2025';

// Włączamy middleware CORS – każde zapytanie z przeglądarki będzie akceptowane
app.use(cors());

// Włączamy automatyczne parsowanie JSON z treści zapytania (req.body)
// limit: '50mb' – zezwalamy na duże dane (base64 zdjęcia mogą być duże)
app.use(express.json({ limit: '50mb' }));


/* ── Middleware sprawdzający hasło admina ── */
// Ta funkcja jest wywoływana przed każdą trasą wymagającą autoryzacji
function requireAuth(request, res, next) {
  // Sprawdzamy nagłówek 'x-admin-token' który React wysyła po zalogowaniu
  if (request.headers['x-admin-token'] === ADMIN_PASSWORD) return next(); // Hasło poprawne – przechodzimy dalej
  // Hasło nieprawidłowe – zwracamy błąd 401 Unauthorized
  res.status(401).json({ error: 'Unauthorized' });
}


/* ── Trasa logowania ── */
// POST /api/auth/login – React wysyła hasło, serwer odsyła token
app.post('/api/auth/login', (request, res) => {
  if (request.body.password === ADMIN_PASSWORD) {
    // Hasło poprawne – odsyłamy token (używamy hasła jako token, wystarczy dla prostego panelu)
    res.json({ token: ADMIN_PASSWORD });
  } else {
    // Hasło błędne – zwracamy błąd 401
    res.status(401).json({ error: 'Nieprawidłowe hasło' });
  }
});


/* ══ PROJEKTY ══ */

// GET /api/projects – pobiera wszystkie projekty (dostępne publicznie, bez logowania)
app.get('/api/projects', async (_, res) => {
  try {
    // Pobieramy z Supabase tabelę 'projects', posortowaną po id
    const rows = await req('GET', '/projects?order=id');
    res.json(rows); // Zwracamy tablicę projektów jako JSON
  } catch (e) { res.status(500).json({ error: e.message }); } // Błąd bazy – zwracamy 500
});

// POST /api/projects – dodaje nowy projekt (wymaga zalogowania)
app.post('/api/projects', requireAuth, async (request, res) => {
  try {
    // Wysyłamy do Supabase cały body zapytania (title, category, year, img, images, opis, featured)
    const rows = await req('POST', '/projects', request.body);
    // Supabase zwraca tablicę – bierzemy pierwszy (i jedyny) nowy rekord
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/projects/:id – aktualizuje projekt o danym id (wymaga zalogowania)
// :id – dynamiczny parametr URL, np. /api/projects/5
app.put('/api/projects/:id', requireAuth, async (request, res) => {
  try {
    // PATCH w Supabase REST API – aktualizuje tylko podane pola (nie nadpisuje całego rekordu)
    // ?id=eq.5 – filtr: tylko rekord gdzie id = 5
    const rows = await req('PATCH', `/projects?id=eq.${request.params.id}`, request.body);
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/projects/:id – usuwa projekt o danym id (wymaga zalogowania)
app.delete('/api/projects/:id', requireAuth, async (request, res) => {
  try {
    // Usuwamy rekord z Supabase; DELETE nie zwraca danych, więc ignorujemy wynik
    await req('DELETE', `/projects?id=eq.${request.params.id}`);
    res.json({ ok: true }); // Potwierdzamy sukces
  } catch (e) { res.status(500).json({ error: e.message }); }
});


/* ══ KLIENCI ══ */

// GET /api/clients – pobiera wszystkie firmy klientów (dostępne publicznie)
app.get('/api/clients', async (_, res) => {
  try {
    const rows = await req('GET', '/clients?order=id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/clients – dodaje nową firmę (wymaga zalogowania)
app.post('/api/clients', requireAuth, async (request, res) => {
  try {
    // Wysyłamy nazwę i logo (base64) do Supabase
    const rows = await req('POST', '/clients', { name: request.body.name, logo: request.body.logo || '' });
    res.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/clients/:id – usuwa firmę o danym id (wymaga zalogowania)
app.delete('/api/clients/:id', requireAuth, async (request, res) => {
  try {
    await req('DELETE', `/clients?id=eq.${request.params.id}`);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


/* ══ TREŚĆ STRONY ══ */

// GET /api/content – zwraca wszystkie pary klucz/wartość jako obiekt { klucz: wartość }
app.get('/api/content', async (_, res) => {
  try {
    const rows = await req('GET', '/site_content?order=key');
    const obj = {};
    rows.forEach(r => { obj[r.key] = r.value; });
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/content – zapisuje wiele par naraz (wymaga zalogowania)
app.put('/api/content', requireAuth, async (request, res) => {
  try {
    const entries = Object.entries(request.body).map(([key, value]) => ({ key, value: String(value) }));
    const result = await upsert('/site_content', entries);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Serwowanie aplikacji React w produkcji ── */
// Ten blok działa tylko gdy NODE_ENV=production (np. na serwerze Render/Railway)
// Lokalnie React ma własny serwer Vite, więc ten blok jest nieaktywny
if (process.env.NODE_ENV === 'production') {
  // Serwujemy zbudowane pliki React z folderu client/dist
  app.use(express.static(path.join(__dirname, '../client/dist')));
  // Wszystkie inne adresy URL kierujemy do index.html (React Router obsługuje routing)
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Startujemy serwer na wybranym porcie
// Callback wypisuje w terminalu potwierdzenie że serwer działa
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
