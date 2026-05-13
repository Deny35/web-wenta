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
      specs      JSONB DEFAULT '[]',
      featured   BOOLEAN DEFAULT false,
      sort_order INT DEFAULT 0
    );
    ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]';
  `);
}

module.exports = { query, init };
