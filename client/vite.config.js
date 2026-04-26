// Importujemy funkcję defineConfig z Vite – pomaga IDE podpowiadać opcje konfiguracji
import { defineConfig } from 'vite';

// Importujemy plugin React – dzięki niemu Vite rozumie składnię JSX (komponenty React)
import react from '@vitejs/plugin-react';

// Eksportujemy konfigurację Vite
export default defineConfig({
  // Lista pluginów – tutaj tylko React
  plugins: [react()],

  server: {
    // Proxy – przekierowuje zapytania zaczynające się od /api na lokalny serwer Node.js
    // Dzięki temu React na porcie 5173 może rozmawiać z Express na porcie 3001
    // Bez tego przeglądarka blokowałaby zapytania (CORS policy)
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
