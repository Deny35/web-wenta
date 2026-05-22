import Header from '../components/Header';
import Footer from '../components/Footer';

const SERVICES = [
  {
    title: 'Projektowanie 3D',
    desc: 'Każdy projekt poprzedzony szczegółową dokumentacją techniczną: projekty P&ID, rysunki warsztatowe oraz wizualizacje 3D dostosowane do specyfiki branży spożywczej, chemicznej i kosmetycznej. Precyzyjna dokumentacja ogranicza ryzyko błędów na etapie produkcji, skraca czas realizacji i redukuje koszty wdrożenia.',
    img: '/znak_zapytania.jpg',
    tags: ['P&ID', 'CAD 3D', 'Dokumentacja techniczna'],
  },
  {
    title: 'Obróbka i spawanie',
    desc: 'Produkcja prowadzona we własnym zakładzie z nowoczesnym parkiem maszynowym. Zakres obróbki obejmuje frezowanie CNC, spawanie TIG orbitalne oraz elektropolerowanie powierzchni – kluczowe dla zachowania najwyższych standardów higieny w przemyśle spożywczym, chemicznym i kosmetycznym. Jakość połączeń spawalniczych potwierdzana certyfikatami i protokołami badań.',
    img: '/znak_zapytania.jpg',
    tags: ['Spawanie TIG', 'Cięcie CNC', 'Elektropolerowanie'],
  },
  {
    title: 'Izolacje techniczne',
    desc: 'Izolacje termiczne rurociągów i zbiorników procesowych z obudowami ze stali nierdzewnej lub aluminium – dedykowane dla linii produkcyjnych w przemyśle spożywczym, chemicznym i kosmetycznym. Zastosowane rozwiązania utrzymują właściwą temperaturę mediów, minimalizują straty energii i zapewniają bezpieczeństwo personelu.',
    img: '/znak_zapytania.jpg',
    tags: ['Izolacja termiczna', 'Obudowy nierdzewne', 'Oszczędność energii'],
  },
  {
    title: 'Maszyny przemysłu spożywczego',
    desc: 'Projektowanie i produkcja maszyn oraz urządzeń procesowych dla branży spożywczej, kosmetycznej i chemicznej. Konstrukcje wykonywane ze stali nierdzewnej AISI 304 lub 316L. Każde urządzenie projektowane z uwzględnieniem wymagań mycia i dezynfekcji w systemach CIP/SIP.',
    img: '/znak_zapytania.jpg',
    tags: ['CIP/SIP', 'AISI 316L', 'AISI 304'],
  },
  {
    title: 'Instalacje procesowe',
    desc: 'Kompleksowe instalacje procesowe ze stali nierdzewnej dla przemysłu spożywczego, chemicznego i kosmetycznego. Zakres dostaw obejmuje rurociągi, zbiorniki, wymienniki ciepła, stacje CIP oraz kompletną armaturę. Każda instalacja realizowana zgodnie z wymaganiami technicznymi zleceniodawcy i normami branżowymi.',
    img: '/znak_zapytania.jpg',
    tags: ['Stal nierdzewna', 'Rurociągi', 'Zbiorniki', 'Stacje CIP'],
  },
  {
    title: 'Instalacje transportowe',
    desc: 'Projektowanie i realizacja systemów transportu wewnętrznego surowców i produktów gotowych w zakładach spożywczych, chemicznych i kosmetycznych: przenośniki taśmowe i ślimakowe, rurociągi grawitacyjne, instalacje pneumatyczne oraz systemy zasypowe. Dobór rozwiązań z uwzględnieniem wydajności, wymagań higienicznych i kosztów eksploatacji.',
    img: '/znak_zapytania.jpg',
    tags: ['Transport pneumatyczny', 'Przenośniki', 'Systemy zasypowe'],
  },
  {
    title: 'Montaż linii technologicznych',
    desc: 'Kompleksowa realizacja montaży linii technologicznych w zakładach branży spożywczej, chemicznej i kosmetycznej – od prac spawalniczych i mechanicznych, przez podłączenia elektryczne, po uruchomienie i testy akceptacyjne. Po zakończeniu montażu dostępne szkolenie personelu obsługi oraz serwis gwarancyjny i pogwarancyjny.',
    img: '/znak_zapytania.jpg',
    tags: ['Montaż', 'Uruchomienie', 'Szkolenia', 'Serwis'],
  },
];

export default function Services() {
  return (
    <>
      <Header />
      <div className="min-h-screen">

        <div className="bg-dark py-20">
          <div className="max-w-5xl mx-auto px-6">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Co oferujemy</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Nasze usługi</h1>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Projekty realizowane są kompleksowo – od koncepcji, przez produkcję, po montaż i serwis. Każdy etap wykonywany jest samodzielnie we własnym zakładzie.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16 space-y-0 divide-y divide-slate-100">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 md:gap-12 items-stretch py-14`}
            >
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="rounded-2xl overflow-hidden h-64 md:h-full min-h-52">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center flex-1 pt-6 md:pt-0">
                <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">{s.title}</h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-sm">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
