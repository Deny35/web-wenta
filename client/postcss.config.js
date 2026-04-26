// PostCSS to narzędzie przetwarzające CSS – Vite używa go automatycznie
// Ten plik mówi PostCSS których pluginów ma użyć
export default {
  plugins: {
    // tailwindcss – zamienia dyrektywy @tailwind na prawdziwy CSS
    tailwindcss: {},

    // autoprefixer – automatycznie dodaje prefiksy przeglądarek (-webkit-, -moz-)
    // dzięki temu CSS działa w starszych przeglądarkach bez ręcznego pisania np. -webkit-flex
    autoprefixer: {}
  }
};
