// Link – link "wróć na stronę główną" bez przeładowania
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

// Statyczna strona – nie pobiera żadnych danych z API
// Zawiera treść polityki prywatności zgodnej z RODO
export default function PrivacyPolicy() {
  return (
    <>
      <Header />

      {/* pt-16 – miejsce na fixedowy header */}
      <div className="pt-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">

          {/* Link powrotu – React Router, bez przeładowania strony */}
          <Link to="/" className="text-sm font-semibold text-accent hover:underline inline-block mb-8">
            ← Wróć na stronę główną
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Polityka prywatności</h1>
          <p className="text-sm text-slate-400 mb-10">Ostatnia aktualizacja: kwiecień 2025</p>

          {/* space-y-6 – równe odstępy między sekcjami */}
          <div className="space-y-6 text-slate-500 leading-relaxed">

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">1. Administrator danych osobowych</h2>
              <p>Administratorem danych osobowych jest firma <strong>Wenta</strong>, ul. Przykładowa 1, 00-000 Miasto, e-mail: <a href="mailto:biuro@wenta.pl" className="text-accent">biuro@wenta.pl</a>, tel.: +48 000 000 000.</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">2. Jakie dane zbieramy i w jakim celu</h2>
              <p>Za pośrednictwem formularza kontaktowego zbieramy następujące dane:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Imię i nazwisko</strong> – w celu identyfikacji nadawcy zapytania</li>
                <li><strong>Adres e-mail</strong> – w celu udzielenia odpowiedzi na zapytanie</li>
                <li><strong>Numer telefonu</strong> (opcjonalnie) – w celu kontaktu telefonicznego</li>
                <li><strong>Nazwa firmy</strong> (opcjonalnie) – w celu przygotowania oferty</li>
                <li><strong>Treść wiadomości</strong> – opis zapytania lub projektu</li>
              </ul>
              <p className="mt-2">Dane są przetwarzane wyłącznie w celu obsługi zapytania (art. 6 ust. 1 lit. b i f RODO).</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">3. Podstawa prawna przetwarzania</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>art. 6 ust. 1 lit. <strong>b</strong> RODO – podjęcie działań na żądanie osoby przed zawarciem umowy,</li>
                <li>art. 6 ust. 1 lit. <strong>f</strong> RODO – prawnie uzasadniony interes administratora (obsługa korespondencji),</li>
                <li>art. 6 ust. 1 lit. <strong>a</strong> RODO – dobrowolna zgoda, w zakresie celów marketingowych (jeśli wyrażona).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">4. Okres przechowywania danych</h2>
              <p>Dane przechowujemy przez czas niezbędny do obsługi zapytania, a w przypadku nawiązania współpracy – przez okres wymagany przepisami prawa (co do zasady 5 lat od zakończenia współpracy).</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">5. Prawa osoby, której dane dotyczą</h2>
              <p>Przysługują Ci następujące prawa:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>prawo dostępu do swoich danych,</li>
                <li>prawo do sprostowania danych,</li>
                <li>prawo do usunięcia danych ("prawo do bycia zapomnianym"),</li>
                <li>prawo do ograniczenia przetwarzania,</li>
                <li>prawo do przenoszenia danych,</li>
                <li>prawo sprzeciwu wobec przetwarzania,</li>
                <li>prawo wniesienia skargi do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa).</li>
              </ul>
              <p className="mt-2">Aby skorzystać z praw, skontaktuj się z nami: <a href="mailto:biuro@wenta.pl" className="text-accent">biuro@wenta.pl</a>.</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">6. Pliki cookies</h2>
              <p>Serwis nie używa plików cookies do celów analitycznych ani marketingowych. Cookies sesyjne mogą być używane wyłącznie do obsługi panelu administracyjnego.</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">7. Przekazywanie danych</h2>
              <p>Dane nie są przekazywane do państw trzecich. Serwis korzysta z usług chmurowych (Supabase) zlokalizowanych w obrębie EOG.</p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
