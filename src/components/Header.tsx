import React from 'react';
import { Plus, Dices, BookOpen, Heart, Sparkles, BookMarked } from 'lucide-react';
import { ReadingStatus } from '../types';

interface HeaderProps {
  onOpenAddBook: () => void;
  onOpenRandomBook: () => void;
  onSelectQuickFilter: (filter: ReadingStatus | 'all' | 'favorites') => void;
  activeQuickFilter: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddBook,
  onOpenRandomBook,
  onSelectQuickFilter,
  activeQuickFilter,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no adjacent subtitle pills) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-200" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectQuickFilter('all');
            }}
            className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-stone-900 hover:text-amber-950 transition-colors whitespace-nowrap shrink-0"
          >
            Bizim Kitaplığımız
          </a>
        </div>

        {/* Zone 2: 4-5 single-line nav links / quick actions with prominent Spouse link */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium text-stone-600">
          {/* SPECIAL SECTION: Eşimin Okuduğu Kitaplar */}
          <button
            type="button"
            onClick={() => onSelectQuickFilter('esim_okudu')}
            className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeQuickFilter === 'esim_okudu'
                ? 'bg-rose-100 text-rose-950 font-bold border border-rose-300 shadow-2xs'
                : 'text-rose-900 hover:bg-rose-50/70 border border-transparent font-semibold'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
            <span>Eşimin Okuduğu Kitaplar</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectQuickFilter('all')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 cursor-pointer ${
              activeQuickFilter === 'all'
                ? 'text-stone-950 font-bold underline underline-offset-8 decoration-amber-800'
                : ''
            }`}
          >
            Tüm Kitaplar
          </button>

          <button
            type="button"
            onClick={() => onSelectQuickFilter('okunmadi')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 cursor-pointer ${
              activeQuickFilter === 'okunmadi'
                ? 'text-stone-950 font-bold underline underline-offset-8 decoration-amber-800'
                : ''
            }`}
          >
            Okunmamış Kitaplar
          </button>

          <button
            type="button"
            onClick={() => onSelectQuickFilter('ikimiz_de_okuduk')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 cursor-pointer ${
              activeQuickFilter === 'ikimiz_de_okuduk'
                ? 'text-stone-950 font-bold underline underline-offset-8 decoration-amber-800'
                : ''
            }`}
          >
            Ortak Okuduklarımız
          </button>

          <button
            type="button"
            onClick={onOpenRandomBook}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-900 hover:text-amber-950 transition-colors cursor-pointer font-medium"
          >
            <Dices className="w-4 h-4 text-amber-700" />
            <span>Ne Okusak?</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAddBook}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kitap Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
