// Hook zwracający treść strony z bazy danych
// Jeśli klucz nie istnieje w bazie – używa wartości domyślnej z DEFAULTS
import { useState, useEffect } from 'react';
import { api } from './api';

// Wartości domyślne – wyświetlane zanim dane załadują się z bazy
// i jako fallback gdy admin nie uzupełnił danego pola
export const DEFAULTS = {
  // Hero
  hero_label:        'Instalacje technologiczne',
  hero_title:        'Stal nierdzewna\nod projektu do montażu',
  hero_desc:         'Produkujemy i montujemy instalacje technologiczne dla przemysłu spożywczego, chemicznego i farmaceutycznego.',
  hero_stat1_n:      '10+',
  hero_stat1_l:      'lat doświadczenia',
  hero_stat2_n:      '200+',
  hero_stat2_l:      'realizacji',
  hero_stat3_n:      '100%',
  hero_stat3_l:      'stal nierdzewna',

  // O firmie
  about_label:       'O firmie',
  about_title:       'Kompleksowo – od projektu\ndo uruchomienia',
  about_desc:        'Wenta specjalizuje się w produkcji i montażu instalacji ze stali nierdzewnej i kwasoodpornej. Realizujemy każdy projekt samodzielnie – projektowanie 3D, produkcja we własnym zakładzie, montaż u klienta i serwis pogwarancyjny. Każda instalacja spełnia normy EHEDG, GMP i FDA.',

  // Kontakt
  contact_phone:     '+48 000 000 000',
  contact_email:     'biuro@wenta.pl',
  contact_address:   'ul. Otmuchowska 78\n48-300 Nysa',
  contact_hours:     'Pon–Pt, 8:00–17:00',
};

// Globalny cache – żeby nie pobierać wielokrotnie przy każdym renderze
let cache = null;
let promise = null;

export function useContent() {
  const [content, setContent] = useState(cache || {});

  useEffect(() => {
    if (cache) { setContent(cache); return; }
    if (!promise) promise = api.content.get();
    promise.then(data => {
      cache = data;
      setContent(data);
    }).catch(() => {
      cache = {};
    });
  }, []);

  // c(klucz) – zwraca wartość z bazy lub domyślną jeśli brak
  function c(key) {
    return (content[key] !== undefined && content[key] !== '') ? content[key] : (DEFAULTS[key] || '');
  }

  return { c, raw: content };
}

// Czyści cache po zapisie w adminie – żeby strona odświeżyła dane
export function clearContentCache() {
  cache = null;
  promise = null;
}
