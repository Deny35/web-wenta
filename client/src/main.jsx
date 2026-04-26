// W React 18+ ten import nie jest wymagany do JSX (nowy transform automatycznie go dodaje)
// Zostawiamy go dla czytelności – wiadomo że to plik React
import React from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars

// ReactDOM obsługuje renderowanie Reacta w przeglądarce (wstrzykiwanie do DOM)
import ReactDOM from 'react-dom/client';

// BrowserRouter – umożliwia routing (React Router)
// Dzięki niemu /projekty, /realizacja/5, /admin to osobne "strony" bez przeładowania
import { BrowserRouter } from 'react-router-dom';

// Główny komponent aplikacji – zawiera definicję wszystkich tras
import App from './App';

// Globalny plik CSS z Tailwind – musi być zaimportowany żeby style działały
import './index.css';

// Tworzymy "korzeń" Reacta – szukamy elementu <div id="root"> w index.html
// i mówimy Reactowi żeby tam renderował całą aplikację
ReactDOM.createRoot(document.getElementById('root')).render(
  // BrowserRouter opakowuje całą aplikację – dzięki temu routing działa wszędzie
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
