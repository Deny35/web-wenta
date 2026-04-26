// Link – komponent React Router do nawigacji bez przeładowania strony
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // mt-16 – margines górny oddzielający footer od treści strony
    // bg-dark – ciemnogranatowe tło (ten sam kolor co header)
    <footer className="bg-dark text-white/50 text-sm py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Logo firmy */}
        <Link to="/">
          <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="h-8 w-auto" />
        </Link>

        {/* Prawa autorskie – new Date().getFullYear() automatycznie wstawia aktualny rok */}
        <span>© {new Date().getFullYear()} Wenta. Wszelkie prawa zastrzeżone.</span>

        {/* Link do polityki prywatności – React Router, bez przeładowania */}
        {/* <Link to="/polityka-prywatnosci" className="hover:text-white transition-colors">
          Polityka prywatności
        </Link> */}
      </div>
    </footer>
  );
}
