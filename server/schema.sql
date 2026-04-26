-- Run this in your PostgreSQL / Supabase SQL editor

CREATE TABLE IF NOT EXISTS projects (
  id       SERIAL PRIMARY KEY,
  title    TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  year     TEXT NOT NULL DEFAULT '',
  img      TEXT NOT NULL DEFAULT '',
  images   JSONB NOT NULL DEFAULT '[]',
  opis     TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false
);

-- Treść strony – pary klucz/wartość (tekst lub JSON)
CREATE TABLE IF NOT EXISTS site_content (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS clients (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '' -- base64 zdjęcie/logo firmy
);

-- Jeśli tabela już istnieje, dodaj kolumnę logo:
-- ALTER TABLE clients ADD COLUMN IF NOT EXISTS logo TEXT NOT NULL DEFAULT '';
