import React from 'react';
import { Book } from '../types';

interface BookCoverArtProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({ book, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-24 h-36 text-[10px]',
    md: 'w-40 h-60 text-xs',
    lg: 'w-56 h-84 text-sm',
  }[size];

  const { bgGradient, accentColor, textColor, spineColor, pattern } = book.coverStyle;

  return (
    <div
      className={`relative rounded-r-md rounded-l-xs overflow-hidden shadow-md transition-all duration-300 flex flex-col justify-between p-3 select-none bg-gradient-to-br ${bgGradient} ${sizeClasses} ${className}`}
      style={{
        boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.4), 2px 4px 12px rgba(0,0,0,0.18)',
      }}
    >
      {/* Book spine line simulation */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[5px] opacity-75 border-r border-black/30"
        style={{ backgroundColor: spineColor }}
      />
      <div className="absolute top-0 left-[5px] bottom-0 w-[1px] bg-white/10" />

      {/* Decorative pattern overlays */}
      {pattern === 'noir' && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px)',
          }}
        />
      )}
      {pattern === 'ornate' && (
        <div className="absolute inset-2 border border-white/15 pointer-events-none rounded-sm" />
      )}
      {pattern === 'classic' && (
        <div className="absolute top-3 left-4 right-3 border-t border-b border-white/15 h-8 pointer-events-none" />
      )}

      {/* Publisher Banner / Header */}
      <div className="relative z-10 pl-2">
        <span
          className="text-[9px] uppercase tracking-widest font-semibold block truncate opacity-80"
          style={{ color: accentColor }}
        >
          {book.publisher}
        </span>
      </div>

      {/* Title & Author */}
      <div className="relative z-10 my-auto pl-2 py-2 text-center">
        <h4
          className="font-serif font-bold leading-tight tracking-normal line-clamp-3"
          style={{
            color: textColor,
            fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '1rem' : '1.35rem',
          }}
        >
          {book.title}
        </h4>
        <div
          className="w-6 h-[1.5px] mx-auto my-2 opacity-60"
          style={{ backgroundColor: accentColor }}
        />
        <p
          className="font-sans font-medium opacity-90 truncate text-[11px]"
          style={{ color: textColor }}
        >
          {book.author}
        </p>
      </div>

      {/* Bottom Genre & Year */}
      <div className="relative z-10 pl-2 flex items-center justify-between text-[9px] opacity-75 text-stone-300">
        <span>{book.genre}</span>
        <span>{book.year}</span>
      </div>

      {/* Subtle glossy page edge highlight */}
      <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/20 pointer-events-none" />
    </div>
  );
};
