import React, { useState } from 'react';
import { Book } from '../types';
import { BookCoverArt } from './BookCoverArt';
import { X, Dices, BookOpen, Sparkles } from 'lucide-react';

interface RandomBookModalProps {
  books: Book[];
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const RandomBookModal: React.FC<RandomBookModalProps> = ({
  books,
  onClose,
  onSelectBook,
}) => {
  // Prefer books in "okunmadi" first, fallback to all books
  const candidates = books.filter((b) => b.status === 'okunmadi').length > 0
    ? books.filter((b) => b.status === 'okunmadi')
    : books;

  const [selectedBook, setSelectedBook] = useState<Book>(
    candidates[Math.floor(Math.random() * candidates.length)]
  );
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = () => {
    setIsShuffling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * candidates.length);
      setSelectedBook(candidates[randomIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden p-6 text-center my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
          <Dices className="w-6 h-6" />
        </div>

        <h3 className="font-serif font-bold text-2xl text-stone-900">
          Bu Akşam Ne Okusak?
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Kitaplığımızda sırada bekleyen eserler arasından sizin için bir seçim yaptık.
        </p>

        {/* Selected Book Presentation */}
        <div className={`mt-6 p-4 bg-white border border-stone-200 rounded-xl transition-all ${isShuffling ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
          <div className="flex justify-center mb-3">
            <BookCoverArt book={selectedBook} size="sm" />
          </div>

          <h4 className="font-serif font-bold text-lg text-stone-900">
            {selectedBook.title}
          </h4>
          <p className="text-xs font-medium text-amber-900 mt-0.5">
            {selectedBook.author}
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mt-2">
            <span>{selectedBook.publisher}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedBook.genre}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{selectedBook.pages} sayfa</span>
          </div>

          <p className="text-xs text-stone-600 italic mt-3 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
            "{selectedBook.summary.lead}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Dices className="w-4 h-4 text-stone-600" />
            <span>Tekrar Kura Çek</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectBook(selectedBook);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>1 Sayfalık Özeti Aç</span>
          </button>
        </div>
      </div>
    </div>
  );
};
