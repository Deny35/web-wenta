import { useContent } from '../useContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const { c } = useContent();

  return (
    <>
      <Header />
      <div className="min-h-screen">

        {/* Hero sekcji */}
        <div className="bg-dark py-16">
          <div className="max-w-5xl mx-auto px-6">
            <span className="text-xs font-bold tracking-widest uppercase text-brand">Kontakt</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Napisz lub zadzwoń</h1>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Jesteśmy do dyspozycji w godzinach pracy. Odpiszemy na każde zapytanie.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Dane kontaktowe */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-slate-800">Dane kontaktowe</h2>

              {[
                {
                  icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>',
                  label: 'Telefon',
                  value: c('contact_phone'),
                  href:  `tel:${c('contact_phone').replace(/\s/g,'')}`,
                },
                {
                  icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
                  label: 'E-mail',
                  value: c('contact_email'),
                  href:  `mailto:${c('contact_email')}`,
                },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 grid place-items-center flex-shrink-0">
                    <svg className="w-5 h-5 fill-brand" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{item.label}</p>
                    <a href={item.href} className="text-slate-800 font-semibold hover:text-brand transition-colors">{item.value}</a>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 grid place-items-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-brand" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Adres</p>
                  <p className="text-slate-800 font-semibold whitespace-pre-line">{c('contact_address')}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 grid place-items-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-brand" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Godziny pracy</p>
                  <p className="text-slate-800 font-semibold">{c('contact_hours')}</p>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-slate-800">Jak do nas trafić</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-80">
                <iframe
                  title="Lokalizacja Wenta"
                  src="https://maps.google.com/maps?width=425&height=350&hl=pl&q=Nysa%2C%20P.P.H.U.%20WENTA%20SP.%20C.+(P.P.H.U.%20WENTA%20SP.%20C.)&ie=UTF8&t=&z=13&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px', overflow: 'hidden' }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
