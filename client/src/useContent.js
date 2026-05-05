import { useState, useEffect } from 'react';
import { api } from './api';

export const DEFAULTS = {
  hero_label:        'Producent wyrobów ze stali nierdzewnej od 1993 roku',
  hero_title:        'Stal nierdzewna\nod projektu do montażu',
  hero_desc:         'Produkujemy i montujemy instalacje technologiczne dla przemysłu spożywczego i chemicznego. Doświadczenie, nowoczesny zakład i własna kadra – to nasza siła od ponad 30 lat.',
  hero_stat1_n:      '30+',
  hero_stat1_l:      'lat doświadczenia',
  hero_stat2_n:      '200+',
  hero_stat2_l:      'realizacji',
  hero_stat3_n:      '100%',
  hero_stat3_l:      'stal nierdzewna',

  about_label:       'O firmie',
  about_title:       'Kompleksowo – od projektu\ndo uruchomienia',
  about_desc:        'Wenta Sp. z o.o. to firma z Nysy, działająca na rynku od 1993 roku. Specjalizujemy się w produkcji i montażu instalacji ze stali nierdzewnej i kwasoodpornej dla przemysłu spożywczego i chemicznego. Realizujemy każdy projekt samodzielnie – od projektowania 3D, przez produkcję we własnym zakładzie, aż po montaż u klienta i serwis pogwarancyjny.',

  contact_phone:     '77 435 37 16',
  contact_email:     'wenta@wenta.eu',
  contact_address:   'ul. Otmuchowska 78\n48-300 Nysa',
  contact_hours:     'Pon–Pt, 7:00–15:00',
};

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

  function c(key) {
    return (content[key] !== undefined && content[key] !== '') ? content[key] : (DEFAULTS[key] || '');
  }

  return { c, raw: content };
}

export function clearContentCache() {
  cache = null;
  promise = null;
}
