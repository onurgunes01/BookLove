import React from 'react';
import { Book, ReadingStatus } from '../types';
import { STATUS_CONFIG } from '../data/initialBooks';
import { BookCoverArt } from './BookCoverArt';
import { Heart, Star, BookOpen, Clock, UserCheck, Check, Sparkles } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenSummary: (book: Book) => void;
  onStatusChange: (bookId: string, newStatus: ReadingStatus) => void;
  onToggleFavorite: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenSummary,
  onStatusChange,
  onToggleFavorite,
}) => {
  const currentStatus = STATUS_CONFIG[book.status];

  const getStatusIcon = (status: ReadingStatus) => {
    switch (status) {
      case 'okunmadi':
        return <Clock className="w-3.5 h-3.5" />;
      case 'esim_okudu':
        return <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />;
      case 'ben_okudum':
        return <Check className="w-3.5 h-3.5" />;
      case 'ikimiz_de_okuduk':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      onClick={() => onOpenSummary(book)}
      className="group relative bg-[#FCFBF8] border border-[#E7E2D8] hover:border-[#C4BBAE] rounded-xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      {/* Top Header info & Favorite */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Status Indicator (Text + icon, quiet style) */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
          style={{
            color: currentStatus.color,
            backgroundColor: currentStatus.bg,
          }}
          title={currentStatus.description}
          onClick={(e) => e.stopPropagation()}
        >
          {getStatusIcon(book.status)}
          <span>{currentStatus.shortLabel}</span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            book.isFavorite
              ? 'text-rose-600 hover:bg-rose-50'
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
          }`}
          aria-label={book.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Book Presentation: Cover + Core Info */}
      <div className="flex gap-4 items-start">
        {/* Visual Cover */}
        <div className="shrink-0 group-hover:scale-[1.02] transition-transform duration-200 shadow-sm">
          <BookCoverArt book={book} size="sm" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-base text-[#1E1C19] leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs font-medium text-stone-600 mt-1 truncate">
            {book.author}
          </p>

          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-stone-600 mt-2.5">
            <span className="font-semibold text-stone-700">{book.publisher}</span>
            <span aria-hidden="true">·</span>
            <span>{book.genre}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{book.pages} sayfa</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-medium text-stone-800 tabular-nums">{book.rating.toFixed(1)}</span>
            {book.coupleNotes?.lastUpdated && (
              <span className="text-[11px] text-stone-600 truncate ml-1">
                ({book.coupleNotes.lastUpdated})
              </span>
            )}
          </div>

          {/* Brief hook */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {book.summary.lead}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div
        className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-stone-500"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] text-stone-400">
          {book.year} Basım
        </span>

        {/* Quick status dropdown or trigger */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onOpenSummary(book)}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-amber-900 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>1 Sayfalık Özeti Oku</span>
          </button>
        </div>
      </div>
    </div>
  );
};
