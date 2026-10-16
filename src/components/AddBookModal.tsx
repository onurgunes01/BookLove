import React, { useState } from 'react';
import { Book, ReadingStatus } from '../types';
import { X, Plus, BookOpen } from 'lucide-react';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
  existingPublishers: string[];
  existingGenres: string[];
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  onClose,
  onAddBook,
  existingPublishers,
  existingGenres,
}) => {
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [translator, setTranslator] = useState('');
  const [publisher, setPublisher] = useState('Altın Kitaplar');
  const [customPublisher, setCustomPublisher] = useState('');
  const [genre, setGenre] = useState('Polisiye');
  const [customGenre, setCustomGenre] = useState('');
  const [pages, setPages] = useState('280');
  const [year, setYear] = useState('2024');
  const [status, setStatus] = useState<ReadingStatus>('okunmadi');
  const [rating, setRating] = useState('4.8');
  const [lead, setLead] = useState('');
  const [contextAndPlot, setContextAndPlot] = useState('');
  const [themesAndAnalysis, setThemesAndAnalysis] = useState('');
  const [whyReadTogether, setWhyReadTogether] = useState('');
  const [quote1, setQuote1] = useState('');
  const [quote2, setQuote2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const finalPublisher = publisher === '__custom__' ? customPublisher.trim() || 'Özel Baskı' : publisher;
    const finalGenre = genre === '__custom__' ? customGenre.trim() || 'Genel' : genre;

    // Pick artistic palette based on genre
    const palettes = [
      { bgGradient: 'from-[#1E293B] via-[#334155] to-[#0F172A]', accentColor: '#38BDF8', textColor: '#F8FAFC', spineColor: '#090D16', pattern: 'noir' as const },
      { bgGradient: 'from-[#3B1E1E] via-[#522525] to-[#241111]', accentColor: '#F59E0B', textColor: '#FEF3C7', spineColor: '#170909', pattern: 'classic' as const },
      { bgGradient: 'from-[#143E2C] via-[#1C5A3E] to-[#0D281C]', accentColor: '#34D399', textColor: '#ECFDF5', spineColor: '#07160F', pattern: 'geometry' as const },
      { bgGradient: 'from-[#2E1065] via-[#3B0764] to-[#1E0638]', accentColor: '#C084FC', textColor: '#FAF5FF', spineColor: '#120224', pattern: 'ornate' as const },
    ];
    const pickedPalette = palettes[Math.floor(Math.random() * palettes.length)];

    const quotes: string[] = [];
    if (quote1.trim()) quotes.push(quote1.trim());
    if (quote2.trim()) quotes.push(quote2.trim());

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      author: author.trim(),
      translator: translator.trim() || undefined,
      publisher: finalPublisher,
      genre: finalGenre,
      pages: parseInt(pages, 10) || 200,
      year: parseInt(year, 10) || new Date().getFullYear(),
      status,
      rating: parseFloat(rating) || 4.5,
      isFavorite: false,
      coverStyle: pickedPalette,
      summary: {
        lead: lead.trim() || `${author} tarafından kaleme alınan sürükleyici bir yapıt.`,
        contextAndPlot: contextAndPlot.trim() || 'Kitaplığımıza yeni eklenen bu eserin olay örgüsü ve detayları yakında eklenecektir.',
        themesAndAnalysis: themesAndAnalysis.trim() || 'Eserde ele alınan ana felsefi fikirler ve insani temalar derin bir iz bırakıyor.',
        whyReadTogether: whyReadTogether.trim() || 'Birlikte okuyup akşam çayı eşliğinde üzerine konuşabileceğimiz keyifli bir kitap.',
        notableQuotes: quotes.length > 0 ? quotes : ['"İyi bir kitap, insanın içinde donmuş denize vurulan bir baltadır."'],
      },
      addedAt: new Date().toISOString().split('T')[0],
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DF] bg-[#F5F2EB]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-900" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Kitaplığımıza Yeni Eser Ekle
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kitap Adı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Doğu Ekspresinde Cinayet"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-600 focus:outline-hidden bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Yazar *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Örn: Agatha Christie"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-600 focus:outline-hidden bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Yayınevi
              </label>
              <select
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-600 focus:outline-hidden bg-white"
              >
                {existingPublishers.map((pub) => (
                  <option key={pub} value={pub}>
                    {pub}
                  </option>
                ))}
                <option value="__custom__">+ Farklı Yayınevi Gir</option>
              </select>
              {publisher === '__custom__' && (
                <input
                  type="text"
                  value={customPublisher}
                  onChange={(e) => setCustomPublisher(e.target.value)}
                  placeholder="Yayınevi adı yazın"
                  className="mt-2 w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tür
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-600 focus:outline-hidden bg-white"
              >
                {existingGenres.map((gen) => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
                <option value="__custom__">+ Farklı Tür Gir</option>
              </select>
              {genre === '__custom__' && (
                <input
                  type="text"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  placeholder="Tür adı yazın"
                  className="mt-2 w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Basım Yılı
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>
          </div>

          {/* Reading Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Okuma Durumu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label
                className={`p-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                  status === 'okunmadi' ? 'bg-amber-100 border-amber-400 font-semibold text-amber-950' : 'bg-white border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="okunmadi"
                  checked={status === 'okunmadi'}
                  onChange={() => setStatus('okunmadi')}
                  className="sr-only"
                />
                Okunmadı
              </label>
              <label
                className={`p-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                  status === 'esim_okudu' ? 'bg-rose-100 border-rose-400 font-semibold text-rose-950' : 'bg-white border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="esim_okudu"
                  checked={status === 'esim_okudu'}
                  onChange={() => setStatus('esim_okudu')}
                  className="sr-only"
                />
                Eşim Okudu
              </label>
              <label
                className={`p-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                  status === 'ben_okudum' ? 'bg-blue-100 border-blue-400 font-semibold text-blue-950' : 'bg-white border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="ben_okudum"
                  checked={status === 'ben_okudum'}
                  onChange={() => setStatus('ben_okudum')}
                  className="sr-only"
                />
                Ben Okudum
              </label>
              <label
                className={`p-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                  status === 'ikimiz_de_okuduk' ? 'bg-emerald-100 border-emerald-400 font-semibold text-emerald-950' : 'bg-white border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="ikimiz_de_okuduk"
                  checked={status === 'ikimiz_de_okuduk'}
                  onChange={() => setStatus('ikimiz_de_okuduk')}
                  className="sr-only"
                />
                İkimiz de Okuduk
              </label>
            </div>
          </div>

          {/* 1-Page Summary Details */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900">
              1 Sayfalık Özet Bilgileri
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tek Cümlelik Kanca / Giriş
              </label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="Örn: Lüks bir trende işlenen gizemli cinayet ve dedektif Poirot..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Geniş Olay Örgüsü & Karakterler
              </label>
              <textarea
                value={contextAndPlot}
                onChange={(e) => setContextAndPlot(e.target.value)}
                rows={3}
                placeholder="Kitabın kurgusu, ana karakterleri ve olayların gelişimi..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tematik İnceleme & Derin Mesaj
              </label>
              <textarea
                value={themesAndAnalysis}
                onChange={(e) => setThemesAndAnalysis(e.target.value)}
                rows={2}
                placeholder="Kitabın işlediği felsefi veya toplumsal meseleler..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                İkimiz İçin Neden Özel / Neden Okunmalı?
              </label>
              <input
                type="text"
                value={whyReadTogether}
                onChange={(e) => setWhyReadTogether(e.target.value)}
                placeholder="Birlikte okurken üzerine konuşulacak keyifli noktalar..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Unutulmaz Alıntı 1
                </label>
                <input
                  type="text"
                  value={quote1}
                  onChange={(e) => setQuote1(e.target.value)}
                  placeholder="Kitaptan vurucu bir cümle..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Unutulmaz Alıntı 2
                </label>
                <input
                  type="text"
                  value={quote2}
                  onChange={(e) => setQuote2(e.target.value)}
                  placeholder="İkinci alıntı..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Kitaplığa Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
