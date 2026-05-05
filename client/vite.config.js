// Importujemy funkcję defineConfig z Vite – pomaga IDE podpowiadać opcje konfiguracji
import { defineConfig } from 'vite';

// Importujemy plugin React – dzięki niemu Vite rozumie składnię JSX (komponenty React)
import react from '@vitejs/plugin-react';

// Eksportujemy konfigurację Vite
export default defineConfig({
  // Lista pluginów – tutaj tylko React
  plugins: [react()],
});
