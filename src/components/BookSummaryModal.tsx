import React, { useState } from 'react';
import { Book, ReadingStatus, CoupleNotes } from '../types';
import { STATUS_CONFIG } from '../data/initialBooks';
import { BookCoverArt } from './BookCoverArt';
import {
  X,
  Clock,
  UserCheck,
  Check,
  Sparkles,
  Star,
  Quote,
  Heart,
  Copy,
  CheckCheck,
  Bookmark,
  MessageSquare,
  FileText
} from 'lucide-react';

interface BookSummaryModalProps {
  book: Book;
  onClose: () => void;
  onStatusChange: (bookId: string, newStatus: ReadingStatus) => void;
  onToggleFavorite: (bookId: string) => void;
  onUpdateCoupleNotes: (bookId: string, notes: CoupleNotes) => void;
}

export const BookSummaryModal: React.FC<BookSummaryModalProps> = ({
  book,
  onClose,
  onStatusChange,
  onToggleFavorite,
  onUpdateCoupleNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'quotes' | 'notes'>('summary');
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  // Editable couple notes local state
  const [myNote, setMyNote] = useState(book.coupleNotes?.myNote || '');
  const [spouseNote, setSpouseNote] = useState(book.coupleNotes?.spouseNote || '');
  const [myRating, setMyRating] = useState<number>(book.coupleNotes?.myRating || 5);
  const [spouseRating, setSpouseRating] = useState<number>(book.coupleNotes?.spouseRating || 5);
  const [savedNotesToast, setSavedNotesToast] = useState(false);

  const currentStatusConfig = STATUS_CONFIG[book.status];

  const handleCopyQuote = (quoteText: string) => {
    navigator.clipboard.writeText(`"${quoteText}" — ${book.title}, ${book.author}`);
    setCopiedQuote(quoteText);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  const handleSaveNotes = () => {
    const today = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    onUpdateCoupleNotes(book.id, {
      myNote,
      spouseNote,
      myRating,
      spouseRating,
      lastUpdated: today,
    });
    setSavedNotesToast(true);
    setTimeout(() => setSavedNotesToast(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DF] bg-[#F5F2EB]">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <Bookmark className="w-4 h-4 text-amber-800" />
            <span>Kişisel Kitaplığımız</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-800">{book.publisher}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(book.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                book.isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title={book.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Hero: Book Cover + Meta */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto sm:mx-0 shadow-lg">
              <BookCoverArt book={book} size="md" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
                {book.title}
              </h2>
              {book.originalTitle && book.originalTitle !== book.title && (
                <p className="text-xs text-stone-600 italic mt-0.5">
                  Orijinal Adı: {book.originalTitle}
                </p>
              )}

              <p className="text-base font-medium text-amber-950 mt-2">
                {book.author}
              </p>

              {/* Zero-pill metadata string */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-stone-600 mt-3 pt-3 border-t border-stone-200">
                <span className="font-semibold text-stone-800">{book.publisher}</span>
                <span aria-hidden="true">·</span>
                <span>{book.genre}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{book.pages} Sayfa</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{book.year} Basım</span>
                {book.translator && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic">Çev: {book.translator}</span>
                  </>
                )}
                {book.isbn && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-stone-600">ISBN: {book.isbn}</span>
                  </>
                )}
              </div>

              {/* Lead Hook */}
              <p className="text-sm text-stone-700 leading-relaxed mt-3 bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 italic">
                "{book.summary.lead}"
              </p>
            </div>
          </div>

          {/* THE 4 PROMINENT READING STATUS BUTTONS */}
          <div className="bg-[#F5F2EB] border border-[#E7E2D8] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Okuma Durumu Seçin
              </span>
              <span className="text-xs text-stone-600">
                Şu anki durum: <strong className="font-medium text-stone-800">{currentStatusConfig.label}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Eşim Okudu Button (Listed first as prominent favori) */}
              <button
                type="button"
                onClick={() => onStatusChange(book.id, 'esim_okudu')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  book.status === 'esim_okudu'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Heart className={`w-4 h-4 shrink-0 ${book.status === 'esim_okudu' ? 'fill-white' : 'text-rose-500'}`} />
                <span>Eşim Okudu</span>
              </button>

              {/* Okunmadı Button */}
              <button
                type="button"
                onClick={() => onStatusChange(book.id, 'okunmadi')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  book.status === 'okunmadi'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>Okunmadı</span>
              </button>

              {/* Ben Okudum Button */}
              <button
                type="button"
                onClick={() => onStatusChange(book.id, 'ben_okudum')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  book.status === 'ben_okudum'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>Ben Okudum</span>
              </button>

              {/* İkimiz de Okuduk Button */}
              <button
                type="button"
                onClick={() => onStatusChange(book.id, 'ikimiz_de_okuduk')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  book.status === 'ikimiz_de_okuduk'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>İkimiz de Okuduk</span>
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'summary'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3 Paragraflık Detaylı Özet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quotes')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'quotes'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Unutulmaz Cümleler ({book.summary.notableQuotes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Çift Notları & Yorumlarımız</span>
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Sürprizbozan (Spoiler) İçermez
            </span>
          </div>

          {/* Tab 1: 3-Paragraph Spoiler-Free Detailed Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-6 text-stone-800 leading-relaxed font-sans">
              {/* Paragraf 1: Başlangıç, Mekan ve Atmosfer */}
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 mb-2 flex items-center justify-between">
                  <span>01. Başlangıç, Mekan ve Atmosfer</span>
                  <span className="text-[11px] font-sans font-normal text-stone-500">Paragraf I</span>
                </h4>
                <p className="text-sm leading-relaxed text-stone-700 bg-white/70 border border-stone-200/80 rounded-xl p-4.5">
                  {book.summary.contextAndPlot}
                </p>
              </div>

              {/* Paragraf 2: Çatışmalar ve Tematik Gerilim */}
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 mb-2 flex items-center justify-between">
                  <span>02. Çatışmalar ve Tematik Gerilim (Spoiler-Free)</span>
                  <span className="text-[11px] font-sans font-normal text-stone-500">Paragraf II</span>
                </h4>
                <p className="text-sm leading-relaxed text-stone-700 bg-white/70 border border-stone-200/80 rounded-xl p-4.5">
                  {book.summary.themesAndAnalysis}
                </p>
              </div>

              {/* Paragraf 3: Edebi Değer ve Derin Anlam */}
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-amber-950 mb-2 flex items-center justify-between">
                  <span>03. Edebi Değer, Derin Anlam ve Eşimin Yorumu</span>
                  <span className="text-[11px] font-sans font-normal text-amber-800/80">Paragraf III</span>
                </h4>
                <p className="text-sm leading-relaxed text-stone-700 bg-[#FBF7EE] border border-amber-200/70 rounded-xl p-4.5">
                  {book.summary.whyReadTogether}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Memorable Quotes */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Kitabın altı çizilen en vurucu cümleleri. Üzerine tıklayarak kopyalayabilirsiniz.
              </p>
              <div className="space-y-3">
                {book.summary.notableQuotes.map((quote, idx) => (
                  <div
                    key={idx}
                    className="relative group bg-white border border-stone-200 rounded-xl p-4 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex gap-3">
                      <Quote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 opacity-60" />
                      <p className="text-sm font-serif italic text-stone-800 leading-relaxed flex-1">
                        "{quote}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(quote)}
                        className="text-stone-400 group-hover:text-stone-700 p-1.5 rounded hover:bg-stone-100 transition-colors shrink-0"
                        title="Alıntıyı Kopyala"
                      >
                        {copiedQuote === quote ? (
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copiedQuote === quote && (
                      <span className="absolute bottom-2 right-4 text-[10px] text-emerald-700 font-medium">
                        Kopyalandı!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Couple Notes & Ratings */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <p className="text-xs text-stone-500">
                Bu kitap hakkındaki özel düşüncelerinizi, sohbetlerinizi ve puanlarınızı kaydedin.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Benim Yorumum */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Benim Notum
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setMyRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= myRating ? 'fill-amber-400' : 'text-stone-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={myNote}
                    onChange={(e) => setMyNote(e.target.value)}
                    placeholder="Bu kitap hakkında ne düşündüm? Neler hissettirdi?"
                    rows={4}
                    className="w-full text-xs text-stone-800 p-2.5 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400 resize-none bg-stone-50/50"
                  />
                </div>

                {/* Eşimin Yorumu */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      Eşimin Notu
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSpouseRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= spouseRating ? 'fill-amber-400' : 'text-stone-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={spouseNote}
                    onChange={(e) => setSpouseNote(e.target.value)}
                    placeholder="Eşimin bu kitap hakkındaki düşünceleri..."
                    rows={4}
                    className="w-full text-xs text-stone-800 p-2.5 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400 resize-none bg-stone-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500">
                  {book.coupleNotes?.lastUpdated ? `Son Güncelleme: ${book.coupleNotes.lastUpdated}` : ''}
                </span>
                <div className="flex items-center gap-3">
                  {savedNotesToast && (
                    <span className="text-xs text-emerald-700 font-medium animate-fade-in">
                      Notlar başarıyla kaydedildi!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Yorum ve Puanları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-[#EBE7DF] bg-[#F5F2EB] flex items-center justify-between text-xs">
          <div className="text-stone-500 flex items-center gap-2">
            <span>Kitaplık ID: #{book.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
