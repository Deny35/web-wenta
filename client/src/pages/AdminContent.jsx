import { useState, useEffect } from 'react';
import { api } from '../api';
import { DEFAULTS, clearContentCache } from '../useContent';

// Grupy pól pogrupowane tematycznie
const SECTIONS = [
  {
    label: 'Hero (baner główny)',
    fields: [
      { key: 'hero_label',   label: 'Etykieta nad tytułem',  type: 'text' },
      { key: 'hero_title',   label: 'Tytuł (Enter = nowa linia)', type: 'textarea', rows: 2 },
      { key: 'hero_desc',    label: 'Opis pod tytułem',      type: 'textarea', rows: 3 },
      { key: 'hero_stat1_n', label: 'Statystyka 1 – liczba', type: 'text' },
      { key: 'hero_stat1_l', label: 'Statystyka 1 – opis',   type: 'text' },
      { key: 'hero_stat2_n', label: 'Statystyka 2 – liczba', type: 'text' },
      { key: 'hero_stat2_l', label: 'Statystyka 2 – opis',   type: 'text' },
      { key: 'hero_stat3_n', label: 'Statystyka 3 – liczba', type: 'text' },
      { key: 'hero_stat3_l', label: 'Statystyka 3 – opis',   type: 'text' },
    ]
  },
  {
    label: 'O firmie',
    fields: [
      { key: 'about_label', label: 'Etykieta sekcji', type: 'text' },
      { key: 'about_title', label: 'Tytuł',           type: 'textarea', rows: 2 },
      { key: 'about_desc',  label: 'Opis firmy',      type: 'textarea', rows: 5 },
    ]
  },
  {
    label: 'Kontakt',
    fields: [
      { key: 'contact_phone',   label: 'Telefon',        type: 'text' },
      { key: 'contact_email',   label: 'E-mail',         type: 'text' },
      { key: 'contact_address', label: 'Adres (Enter = nowa linia)', type: 'textarea', rows: 2 },
      { key: 'contact_hours',   label: 'Godziny pracy',  type: 'text' },
    ]
  },
];

export default function AdminContent({ showSuccess }) {
  // values – aktualnie wyświetlane wartości pól formularza
  const [values, setValues]   = useState({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    api.content.get().then(data => {
      // Wypełniamy pola: wartość z bazy lub domyślna
      const init = {};
      SECTIONS.forEach(s => s.fields.forEach(f => {
        init[f.key] = data[f.key] !== undefined ? data[f.key] : DEFAULTS[f.key] || '';
      }));
      setValues(init);
      setLoading(false);
    });
  }, []);

  function handleChange(key, val) {
    setValues(v => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.content.save(values);
      clearContentCache(); // Czyścimy cache żeby strona załadowała nowe dane
      showSuccess('Treść strony zaktualizowana!');
    } catch (err) {
      alert('Błąd zapisu: ' + err.message);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-slate-400 text-sm">Ładowanie…</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {SECTIONS.map(section => (
        <div key={section.label} className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">
            {section.label}
          </h3>
          <div className="flex flex-col gap-4">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea'
                  ? <textarea
                      rows={field.rows || 3}
                      value={values[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand resize-vertical"
                    />
                  : <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
                    />
                }
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-brand text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? 'Zapisywanie…' : 'Zapisz wszystkie zmiany'}
        </button>
      </div>
    </form>
  );
}
