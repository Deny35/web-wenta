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
    CREATE TABLE IF NOT EXISTS productions (
      id         BIGINT PRIMARY KEY,
      title      TEXT,
      desc       TEXT DEFAULT '',
      img        TEXT DEFAULT '',
      icon       TEXT DEFAULT '',
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

  const existingProd = await pool.query('SELECT COUNT(*) FROM productions');
  if (parseInt(existingProd.rows[0].count) === 0) {
    const items = [
      { title: 'Linie technologiczne',    desc: 'Kompletne linie produkcyjne ze stali nierdzewnej pod konkretny proces.',            img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
      { title: 'Zbiorniki nierdzewne',    desc: 'Procesowe, magazynowe i ciśnieniowe – certyfikowane z dokumentacją UDT.',           img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80', icon: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },
      { title: 'Instalacje rurowe',       desc: 'Rurociągi ze stali nierdzewnej i kwasoodpornej – sanitarne, technologiczne, CIP.',  img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80', icon: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>' },
      { title: 'SKID-y produkcyjne',      desc: 'Gotowe moduły procesowe z armaturą i osprzętem – plug & play.',                    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
      { title: 'Stacje mycia CIP',        desc: 'Automatyczne mycie instalacji bez demontażu – z dokumentowanymi programami.',       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', icon: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },
      { title: 'Mieszalniki przemysłowe', desc: 'Różne typy wirników – do roztworów, past, emulsji i zawiesin.',                    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', icon: '<path d="M12 22V12m0 0L8 8m4 4l4-4M4 6h16"/>' },
      { title: 'Przenośniki',             desc: 'Taśmowe, ślimakowe i łańcuchowe ze stali nierdzewnej.',                            img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>' },
      { title: 'Konstrukcje stalowe',     desc: 'Platformy, podesty, schody i balustrady ze stali nierdzewnej.',                    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
    ];
    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      await pool.query(
        'INSERT INTO productions (id, title, "desc", img, icon, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
        [Date.now() + i, p.title, p.desc, p.img, p.icon, i]
      );
    }
  }

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
