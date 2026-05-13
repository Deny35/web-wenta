const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function query(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id         BIGINT PRIMARY KEY,
      title      TEXT,
      category   TEXT,
      year       TEXT,
      img        TEXT,
      images     JSONB DEFAULT '[]',
      opis       TEXT DEFAULT '',
      short_desc TEXT DEFAULT '',
      featured   BOOLEAN DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS clients (
      id   BIGINT PRIMARY KEY,
      name TEXT,
      logo TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS site_content (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id         BIGINT PRIMARY KEY,
      title      TEXT,
      category   TEXT DEFAULT '',
      short_desc TEXT DEFAULT '',
      opis       TEXT DEFAULT '',
      img        TEXT DEFAULT '',
      images     JSONB DEFAULT '[]',
      featured   BOOLEAN DEFAULT false,
      sort_order INT DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS services (
      id         BIGINT PRIMARY KEY,
      title      TEXT,
      short_desc TEXT DEFAULT '',
      opis       TEXT DEFAULT '',
      img        TEXT DEFAULT '',
      images     JSONB DEFAULT '[]',
      tags       JSONB DEFAULT '[]',
      sort_order INT DEFAULT 0
    );
  `);

  const existing = await pool.query('SELECT COUNT(*) FROM services');
  if (parseInt(existing.rows[0].count) === 0) {
    const initial = [
      { title: 'Projektowanie 3D',       short_desc: 'Projekty P&ID, rysunki warsztatowe, wizualizacje 3D.',        opis: 'Każdy projekt zaczyna się u nas od szczegółowej dokumentacji. Tworzymy projekty P&ID, rysunki warsztatowe oraz pełne wizualizacje 3D, które pozwalają klientowi zobaczyć efekt końcowy jeszcze przed rozpoczęciem produkcji. Precyzyjna dokumentacja techniczna eliminuje błędy na etapie produkcji i montażu, skraca czas realizacji i obniża koszty.', img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=900&q=80', tags: ['P&ID', 'CAD 3D', 'Dokumentacja techniczna'] },
      { title: 'Obróbka i spawanie',     short_desc: 'Cięcie laserowe, CNC, spawanie TIG orbitalne.',               opis: 'Posiadamy własny zakład produkcyjny z nowoczesnym parkiem maszynowym. Realizujemy cięcie laserowe, obróbkę CNC, spawanie TIG orbitalne oraz elektropolerowanie powierzchni. Gwarantujemy najwyższą jakość połączeń spawalniczych, potwierdzoną certyfikatami i protokołami badań.', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80', tags: ['Spawanie TIG', 'Cięcie CNC', 'Elektropolerowanie'] },
      { title: 'Izolacje techniczne',    short_desc: 'Izolacje termiczne rurociągów i zbiorników.',                 opis: 'Wykonujemy izolacje termiczne rurociągów i zbiorników procesowych z zastosowaniem obudów ze stali nierdzewnej lub aluminium. Nasze izolacje zapewniają utrzymanie właściwej temperatury mediów procesowych, ograniczają straty energii i chronią personel przed poparzeniami.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80', tags: ['Izolacja termiczna', 'Obudowy nierdzewne', 'Oszczędność energii'] },
      { title: 'Maszyny spożywcze',      short_desc: 'Produkcja maszyn dla branży spożywczej.',                     opis: 'Projektujemy i produkujemy maszyny oraz urządzenia dedykowane dla branży spożywczej, farmaceutycznej i kosmetycznej. Wszystkie elementy wykonane są ze stali nierdzewnej AISI 304 lub 316L i spełniają normy EHEDG oraz GMP. Urządzenia projektowane są z myślą o łatwym myciu i dezynfekcji (CIP/SIP).', img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80', tags: ['EHEDG', 'GMP', 'CIP/SIP', 'AISI 316L'] },
      { title: 'Instalacje procesowe',   short_desc: 'Instalacje ze stali nierdzewnej dla przemysłu.',              opis: 'Budujemy kompleksowe instalacje procesowe ze stali nierdzewnej dla przemysłu spożywczego, chemicznego i farmaceutycznego. Obejmuje to rurociągi, zbiorniki, wymienniki ciepła, stacje CIP oraz całą armaturę. Każda instalacja wykonywana jest zgodnie z wymaganiami technicznymi klienta i obowiązującymi normami branżowymi.', img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=900&q=80', tags: ['Stal nierdzewna', 'Rurociągi', 'Zbiorniki', 'Stacje CIP'] },
      { title: 'Instalacje transportowe', short_desc: 'Przenośniki, rurociągi, instalacje pneumatyczne.',           opis: 'Projektujemy i budujemy systemy transportu wewnętrznego surowców i produktów: przenośniki taśmowe i ślimakowe, rurociągi grawitacyjne, instalacje pneumatyczne oraz systemy zasypowe. Dobieramy rozwiązania optymalne pod względem wydajności, higieny i kosztów eksploatacji.', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=900&q=80', tags: ['Transport pneumatyczny', 'Przenośniki', 'Systemy zasypowe'] },
      { title: 'Montaż linii technologicznych', short_desc: 'Kompletne linie od spawania po uruchomienie.',         opis: 'Realizujemy kompleksowe montaże linii technologicznych – od prac spawalniczych i mechanicznych, przez podłączenia elektryczne i automatykę, po uruchomienie i testy akceptacyjne. Po zakończeniu montażu zapewniamy szkolenie personelu obsługi oraz serwis gwarancyjny i pogwarancyjny.', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', tags: ['Montaż', 'Uruchomienie', 'Szkolenia', 'Serwis'] },
    ];
    for (let i = 0; i < initial.length; i++) {
      const s = initial[i];
      const id = Date.now() + i;
      await pool.query(
        `INSERT INTO services (id, title, short_desc, opis, img, images, tags, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, s.title, s.short_desc, s.opis, s.img, JSON.stringify([]), JSON.stringify(s.tags), i]
      );
    }
  }
}

module.exports = { query, init };
