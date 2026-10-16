import React, { useState } from 'react';
import { ReadingStatus } from '../types';
import { STATUS_CONFIG } from '../data/initialBooks';
import {
  Layers,
  Building2,
  BookMarked,
  RotateCcw,
  Clock,
  UserCheck,
  Check,
  Sparkles,
  Heart,
  BookOpen,
  User,
  Search,
  Star
} from 'lucide-react';

interface SidebarProps {
  publishers: { name: string; count: number }[];
  genres: { name: string; count: number }[];
  authors: { name: string; count: number }[];
  selectedPublishers: string[];
  selectedGenres: string[];
  selectedAuthors: string[];
  selectedStatus: ReadingStatus | 'all';
  onlyFavorites: boolean;
  onTogglePublisher: (publisher: string) => void;
  onToggleGenre: (genre: string) => void;
  onToggleAuthor: (author: string) => void;
  onSelectStatus: (status: ReadingStatus | 'all') => void;
  onToggleFavorites: () => void;
  onResetFilters: () => void;
  statusCounts: Record<ReadingStatus | 'all', number>;
  totalBooks: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  publishers,
  genres,
  authors,
  selectedPublishers,
  selectedGenres,
  selectedAuthors,
  selectedStatus,
  onlyFavorites,
  onTogglePublisher,
  onToggleGenre,
  onToggleAuthor,
  onSelectStatus,
  onToggleFavorites,
  onResetFilters,
  statusCounts,
  totalBooks,
}) => {
  const [authorFilterQuery, setAuthorFilterQuery] = useState('');
  const [publisherFilterQuery, setPublisherFilterQuery] = useState('');

  const hasActiveFilters =
    selectedPublishers.length > 0 ||
    selectedGenres.length > 0 ||
    selectedAuthors.length > 0 ||
    selectedStatus !== 'all' ||
    onlyFavorites;

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(authorFilterQuery.toLowerCase().trim())
  );

  const filteredPublishers = publishers.filter((p) =>
    p.name.toLowerCase().includes(publisherFilterQuery.toLowerCase().trim())
  );

  const isSpouseSectionActive = selectedStatus === 'esim_okudu';

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* 1. DİKKAT ÇEKİCİ ÖZEL BÖLÜM: EŞİMİN OKUDUĞU KİTAPLAR */}
      <div
        onClick={() => onSelectStatus(isSpouseSectionActive ? 'all' : 'esim_okudu')}
        className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
          isSpouseSectionActive
            ? 'bg-gradient-to-br from-rose-50 via-rose-100/60 to-amber-50/50 border-rose-300 ring-2 ring-rose-400/40'
            : 'bg-gradient-to-br from-[#FFF9F9] to-[#FFF5F5] border-rose-200/80 hover:border-rose-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-rose-950 leading-tight">
                Eşimin Okuduğu Kitaplar
              </h3>
              <p className="text-[11px] text-rose-800/80 font-medium mt-0.5">
                Kütüphanemizin Favorileri
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-xs font-bold text-rose-700 bg-rose-100 rounded-full tabular-nums">
            {statusCounts.esim_okudu}
          </span>
        </div>

        <div className="mt-2.5 text-[11px] text-rose-900/80 leading-relaxed border-t border-rose-200/60 pt-2 flex items-center justify-between">
          <span>{isSpouseSectionActive ? 'Filtre devrede (Tıkla ve sıfırla)' : 'Tümünü listelemek için tıklayın'}</span>
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        </div>
      </div>

      {/* 2. Bizim İstatistiğimiz Bar */}
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif font-bold text-sm text-stone-900">
              Bizim İstatistiğimiz
            </h3>
          </div>
          <span className="text-xs font-semibold tabular-nums text-stone-600">
            {totalBooks} Kitap
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div
            onClick={() => onSelectStatus('esim_okudu')}
            className="p-2 rounded-lg bg-rose-50 border border-rose-200 flex flex-col cursor-pointer hover:bg-rose-100/70 transition-colors"
          >
            <span className="text-rose-900 text-[10px] font-medium flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-600 fill-rose-500" />
              Eşim Okudu
            </span>
            <span className="font-bold text-sm text-rose-950 mt-0.5 tabular-nums">
              {statusCounts.esim_okudu}
            </span>
          </div>

          <div
            onClick={() => onSelectStatus('okunmadi')}
            className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-col cursor-pointer hover:bg-amber-100/70 transition-colors"
          >
            <span className="text-amber-900 text-[10px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              Okunmadı
            </span>
            <span className="font-bold text-sm text-amber-950 mt-0.5 tabular-nums">
              {statusCounts.okunmadi}
            </span>
          </div>

          <div
            onClick={() => onSelectStatus('ben_okudum')}
            className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex flex-col cursor-pointer hover:bg-blue-100/70 transition-colors"
          >
            <span className="text-stone-500 text-[10px] flex items-center gap-1">
              <Check className="w-3 h-3 text-blue-600" />
              Ben Okudum
            </span>
            <span className="font-bold text-sm text-blue-900 mt-0.5 tabular-nums">
              {statusCounts.ben_okudum}
            </span>
          </div>

          <div
            onClick={() => onSelectStatus('ikimiz_de_okuduk')}
            className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex flex-col cursor-pointer hover:bg-emerald-100/70 transition-colors"
          >
            <span className="text-stone-500 text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Ortak Okunan
            </span>
            <span className="font-bold text-sm text-emerald-900 mt-0.5 tabular-nums">
              {statusCounts.ikimiz_de_okuduk}
            </span>
          </div>
        </div>
      </div>

      {/* 3. OKUMA DURUMU SEÇİCİ */}
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-800" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Okuma Durumu
            </h4>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectStatus('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            <span>Tüm Kitaplar</span>
            <span className="tabular-nums text-[11px] opacity-80">{statusCounts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('esim_okudu')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedStatus === 'esim_okudu'
                ? 'bg-rose-700 text-white shadow-xs font-semibold'
                : 'text-stone-800 hover:bg-rose-50/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
              <span>{STATUS_CONFIG.esim_okudu.shortLabel} (Favoriler)</span>
            </span>
            <span className="tabular-nums text-[11px] opacity-80">{statusCounts.esim_okudu}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('okunmadi')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedStatus === 'okunmadi'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-amber-50/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{STATUS_CONFIG.okunmadi.shortLabel} (Sırada)</span>
            </span>
            <span className="tabular-nums text-[11px] opacity-80">{statusCounts.okunmadi}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('ben_okudum')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedStatus === 'ben_okudum'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-blue-50/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>{STATUS_CONFIG.ben_okudum.shortLabel}</span>
            </span>
            <span className="tabular-nums text-[11px] opacity-80">{statusCounts.ben_okudum}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('ikimiz_de_okuduk')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedStatus === 'ikimiz_de_okuduk'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-emerald-50/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{STATUS_CONFIG.ikimiz_de_okuduk.shortLabel}</span>
            </span>
            <span className="tabular-nums text-[11px] opacity-80">{statusCounts.ikimiz_de_okuduk}</span>
          </button>
        </div>

        {/* Favorite toggle */}
        <div className="mt-3 pt-3 border-t border-[#EBE7DF]">
          <button
            type="button"
            onClick={onToggleFavorites}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              onlyFavorites
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-600 text-rose-600' : 'text-stone-500'}`} />
              <span>Sadece Favorilerimiz</span>
            </span>
          </button>
        </div>
      </div>

      {/* 4. TÜRLER */}
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-800" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Türler
            </h4>
          </div>
          {selectedGenres.length > 0 && (
            <span className="text-[11px] text-stone-500 font-medium">
              {selectedGenres.length} seçili
            </span>
          )}
        </div>

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <label
                key={genre.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                  isSelected ? 'bg-amber-100/70 text-amber-950 font-medium' : 'text-stone-700 hover:bg-stone-200/40'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleGenre(genre.name)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer w-3.5 h-3.5"
                  />
                  <span className="truncate">{genre.name}</span>
                </div>
                <span className="tabular-nums text-[11px] text-stone-500 shrink-0 ml-2">
                  {genre.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. YAYINEVLERİ (YKY, Can Yayınları, İş Bankası, Altın Kitaplar vb.) */}
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-800" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Yayınevleri
            </h4>
          </div>
          {selectedPublishers.length > 0 && (
            <span className="text-[11px] text-stone-500 font-medium">
              {selectedPublishers.length} seçili
            </span>
          )}
        </div>

        {publishers.length > 5 && (
          <div className="relative mb-2">
            <Search className="w-3 h-3 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={publisherFilterQuery}
              onChange={(e) => setPublisherFilterQuery(e.target.value)}
              placeholder="Yayınevi ara (YKY, Can...)"
              className="w-full text-[11px] pl-6 pr-2 py-1 rounded-md border border-stone-200 bg-white"
            />
          </div>
        )}

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {filteredPublishers.map((pub) => {
            const isSelected = selectedPublishers.includes(pub.name);
            return (
              <label
                key={pub.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                  isSelected ? 'bg-amber-100/70 text-amber-950 font-medium' : 'text-stone-700 hover:bg-stone-200/40'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onTogglePublisher(pub.name)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer w-3.5 h-3.5"
                  />
                  <span className="truncate">{pub.name}</span>
                </div>
                <span className="tabular-nums text-[11px] text-stone-500 shrink-0 ml-2">
                  {pub.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. YAZARLAR */}
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-800" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Yazarlar
            </h4>
          </div>
          {selectedAuthors.length > 0 && (
            <span className="text-[11px] text-stone-500 font-medium">
              {selectedAuthors.length} seçili
            </span>
          )}
        </div>

        <div className="relative mb-2">
          <Search className="w-3 h-3 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={authorFilterQuery}
            onChange={(e) => setAuthorFilterQuery(e.target.value)}
            placeholder="Yazar ara (Pamuk, Christie...)"
            className="w-full text-[11px] pl-6 pr-2 py-1 rounded-md border border-stone-200 bg-white"
          />
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {filteredAuthors.map((author) => {
            const isSelected = selectedAuthors.includes(author.name);
            return (
              <label
                key={author.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                  isSelected ? 'bg-amber-100/70 text-amber-950 font-medium' : 'text-stone-700 hover:bg-stone-200/40'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleAuthor(author.name)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer w-3.5 h-3.5"
                  />
                  <span className="truncate">{author.name}</span>
                </div>
                <span className="tabular-nums text-[11px] text-stone-500 shrink-0 ml-2">
                  {author.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
