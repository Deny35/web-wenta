/** @type {import('tailwindcss').Config} */
// Eksportujemy konfigurację Tailwind CSS
export default {
  // content – lista plików w których Tailwind szuka klas CSS
  // Tailwind skanuje te pliki i generuje TYLKO użyte klasy (mniejszy plik CSS)
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      // Dodajemy własne kolory dostępne jako klasy Tailwind (np. bg-brand, text-orange)
      colors: {
        brand:  '#2EA3F2', // Niebieski – główny kolor marki (przyciski, akcenty)
        orange: '#E35B1C', // Pomarańczowy – kolor CTA (wezwanie do działania)
        dark:   '#1a2633'  // Ciemnogranatowy – tło headera, hero, footera
      },
      // Zastępujemy domyślny font Tailwind naszym Open Sans
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif']
      }
    }
  },

  // plugins – miejsce na dodatkowe pluginy Tailwind (np. formularze, typografia)
  plugins: []
};
