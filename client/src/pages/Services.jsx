import Header from '../components/Header';
import Footer from '../components/Footer';

const SERVICES = [
  {
    icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
    title: 'Projektowanie 3D',
    desc: 'Projekty P&ID, rysunki warsztatowe, wizualizacje 3D, dokumentacja techniczna. Każdy projekt zaczyna się od szczegółowego planu, który eliminuje błędy na etapie produkcji i montażu.',
  },
  {
    icon: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
    title: 'Obróbka i spawanie',
    desc: 'Cięcie laserowe, CNC, spawanie TIG orbitalne, elektropolerowanie. Posiadamy własny zakład produkcyjny wyposażony w nowoczesne maszyny.',
  },
  {
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    title: 'Izolacje techniczne',
    desc: 'Izolacje termiczne rurociągów i zbiorników – obudowy nierdzewne lub aluminiowe. Zapewniamy utrzymanie właściwej temperatury mediów procesowych.',
  },
  {
    icon: '<path d="M5 12H19M12 5l7 7-7 7"/>',
    title: 'Relokacja maszyn',
    desc: 'Demontaż, transport i ponowny montaż linii produkcyjnych. Kompleksowa obsługa przeprowadzki całych zakładów produkcyjnych.',
  },
  {
    icon: '<path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
    title: 'Maszyny i urządzenia przemysłu spożywczego',
    desc: 'Produkcja i montaż maszyn oraz urządzeń dedykowanych dla branży spożywczej. Wszystkie elementy spełniają normy EHEDG i GMP.',
  },
  {
    icon: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
    title: 'Instalacje procesowe',
    desc: 'Kompleksowe instalacje procesowe ze stali nierdzewnej dla różnych gałęzi przemysłu – spożywczego i chemicznego.',
  },
  {
    icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>',
    title: 'Urządzenia i instalacje transportowe',
    desc: 'Systemy transportu wewnętrznego – przenośniki, rurociągi, instalacje pneumatyczne. Projektujemy i budujemy kompleksowe systemy przemieszczania surowców i produktów.',
  },
  {
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    title: 'Montaż linii technologicznych',
    desc: 'Realizujemy montaże kompletnych linii technologicznych – od spawania po uruchomienie i testy. Oferujemy również szkolenie personelu i serwis pogwarancyjny.',
  },
];

export default function Services() {
  return (
    <>
      <Header />
      <div className="min-h-screen">

        <div className="bg-dark py-16">
          <div className="max-w-5xl mx-auto px-6">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Co oferujemy</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Nasze usługi</h1>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Realizujemy projekty kompleksowo – od koncepcji, przez produkcję, po montaż i serwis. Każdy etap wykonujemy samodzielnie we własnym zakładzie.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="flex gap-5 p-6 bg-white border border-slate-200 border-l-4 border-l-accent rounded-r-xl hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl grid place-items-center">
                  <svg className="w-6 h-6 fill-accent" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: s.icon }} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 mb-2">{s.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-dark rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Potrzebujesz wyceny?</h3>
              <p className="text-white/50 mt-1 text-sm">Skontaktuj się z nami.</p>
            </div>
            <a href="/kontakt" className="flex-shrink-0 px-8 py-3 rounded-lg bg-brand text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Kontakt →
            </a>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
