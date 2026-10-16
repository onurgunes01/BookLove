import React, { useState, useEffect, useMemo } from 'react';
import { Book, ReadingStatus, CoupleNotes, SortOption } from './types';
import { INITIAL_BOOKS } from './data/initialBooks';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { BookSummaryModal } from './components/BookSummaryModal';
import { AddBookModal } from './components/AddBookModal';
import { RandomBookModal } from './components/RandomBookModal';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  BookOpen,
  Filter,
  X,
  ChevronDown,
  Heart,
  Star
} from 'lucide-react';

const STORAGE_KEY = 'bizim_kitaplik_v3_spouse_favorites';
const INITIAL_VISIBLE_COUNT = 36;

export default function App() {
  // Books state with localStorage persistence
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load books from localStorage', e);
    }
    return INITIAL_BOOKS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage', e);
    }
  }, [books]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Modals state
  const [activeBookForSummary, setActiveBookForSummary] = useState<Book | null>(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isRandomBookOpen, setIsRandomBookOpen] = useState(false);

  // Sync activeBookForSummary if books state changes while modal is open
  useEffect(() => {
    if (activeBookForSummary) {
      const updated = books.find((b) => b.id === activeBookForSummary.id);
      if (updated) {
        setActiveBookForSummary(updated);
      }
    }
  }, [books]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchQuery, selectedPublishers, selectedGenres, selectedAuthors, selectedStatus, onlyFavorites, sortBy]);

  // Handlers for book changes
  const handleStatusChange = (bookId: string, newStatus: ReadingStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const handleUpdateCoupleNotes = (bookId: string, notes: CoupleNotes) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              coupleNotes: notes,
            }
          : b
      )
    );
  };

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kitaplığı orijinal listeye geri döndürmek istiyor musunuz?')) {
      setBooks(INITIAL_BOOKS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Publisher, Genre & Author Lists with Counts
  const publishersList = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      map.set(b.publisher, (map.get(b.publisher) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
  }, [books]);

  const genresList = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      map.set(b.genre, (map.get(b.genre) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
  }, [books]);

  const authorsList = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      map.set(b.author, (map.get(b.author) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
  }, [books]);

  // Status counts for badge
  const statusCounts = useMemo(() => {
    const counts = {
      all: books.length,
      okunmadi: 0,
      esim_okudu: 0,
      ben_okudum: 0,
      ikimiz_de_okuduk: 0,
    };
    books.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      }
    });
    return counts;
  }, [books]);

  // Filter toggles
  const handleTogglePublisher = (publisher: string) => {
    setSelectedPublishers((prev) =>
      prev.includes(publisher)
        ? prev.filter((p) => p !== publisher)
        : [...prev, publisher]
    );
  };

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleToggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
  };

  const handleResetFilters = () => {
    setSelectedPublishers([]);
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setSelectedStatus('all');
    setOnlyFavorites(false);
    setSearchQuery('');
  };

  const handleQuickFilter = (filter: ReadingStatus | 'all' | 'favorites') => {
    handleResetFilters();
    if (filter === 'favorites') {
      setOnlyFavorites(true);
    } else {
      setSelectedStatus(filter);
    }
  };

  // Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchPublisher = book.publisher.toLowerCase().includes(q);
          const matchGenre = book.genre.toLowerCase().includes(q);
          const matchLead = book.summary.lead.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchPublisher && !matchGenre && !matchLead) {
            return false;
          }
        }

        // Status
        if (selectedStatus !== 'all' && book.status !== selectedStatus) {
          return false;
        }

        // Publisher
        if (selectedPublishers.length > 0 && !selectedPublishers.includes(book.publisher)) {
          return false;
        }

        // Genre
        if (selectedGenres.length > 0 && !selectedGenres.includes(book.genre)) {
          return false;
        }

        // Author
        if (selectedAuthors.length > 0 && !selectedAuthors.includes(book.author)) {
          return false;
        }

        // Favorites
        if (onlyFavorites && !book.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title, 'tr');
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title, 'tr');
        if (sortBy === 'pages-asc') return a.pages - b.pages;
        if (sortBy === 'pages-desc') return b.pages - a.pages;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0; // default order
      });
  }, [books, searchQuery, selectedStatus, selectedPublishers, selectedGenres, selectedAuthors, onlyFavorites, sortBy]);

  const visibleBooks = useMemo(() => {
    return filteredBooks.slice(0, visibleCount);
  }, [filteredBooks, visibleCount]);

  const hasActiveFilters =
    selectedPublishers.length > 0 ||
    selectedGenres.length > 0 ||
    selectedAuthors.length > 0 ||
    selectedStatus !== 'all' ||
    onlyFavorites ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24211E] flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        onOpenAddBook={() => setIsAddBookOpen(true)}
        onOpenRandomBook={() => setIsRandomBookOpen(true)}
        onSelectQuickFilter={handleQuickFilter}
        activeQuickFilter={onlyFavorites ? 'favorites' : selectedStatus}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Intro Hero Section for Couple's Library */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
            <div>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
                Ben ve Eşimin Kişisel Kitaplığı
              </h1>
              <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
                Dünya Klasikleri, Türk Edebiyatı, Polisiye & Gerilim ile Felsefe & Bilimkurgu eserlerimiz. Her eserin 1 sayfalık zengin özeti, alıntıları ve ortak okuma notlarıyla kütüphanemiz.
              </p>
            </div>

            {/* Quick Action Bar for Mobile Filter Toggle & Stats */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg shadow-xs"
              >
                <Filter className="w-4 h-4 text-amber-800" />
                <span>
                  Filtreler ({selectedPublishers.length + selectedGenres.length + selectedAuthors.length + (selectedStatus !== 'all' ? 1 : 0)})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsRandomBookOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-amber-950 bg-amber-100/70 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Kura Çek: Ne Okusak?</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2-Column Split: Sidebar Left, Books Grid Right */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              publishers={publishersList}
              genres={genresList}
              authors={authorsList}
              selectedPublishers={selectedPublishers}
              selectedGenres={selectedGenres}
              selectedAuthors={selectedAuthors}
              selectedStatus={selectedStatus}
              onlyFavorites={onlyFavorites}
              onTogglePublisher={handleTogglePublisher}
              onToggleGenre={handleToggleGenre}
              onToggleAuthor={handleToggleAuthor}
              onSelectStatus={setSelectedStatus}
              onToggleFavorites={() => setOnlyFavorites((prev) => !prev)}
              onResetFilters={handleResetFilters}
              statusCounts={statusCounts}
              totalBooks={books.length}
            />
          </div>

          {/* Right Section: Toolbar + Books Grid */}
          <div className="flex-1 w-full space-y-5">
            {/* DEDICATED BANNER FOR EŞİMİN OKUDUĞU KİTAPLAR */}
            {selectedStatus === 'esim_okudu' && (
              <div className="bg-gradient-to-r from-rose-100/90 via-rose-50 to-amber-50/70 border border-rose-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-rose-950">
                        Eşimin Okuduğu Kitaplar Bölümü
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200/90 text-rose-900 tabular-nums">
                        {statusCounts.esim_okudu} Favori Eser
                      </span>
                    </div>
                    <p className="text-xs text-rose-900/80 mt-1 leading-relaxed max-w-2xl">
                      Eşimin okuduğu ve tamamı favorilere eklenmiş özel seçki. Her kitap için sürprizbozan (spoiler) içermeyen 3 paragraflık detaylı edebi özetler ve unutulmaz alıntılar hazırlanmıştır.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-rose-900 bg-white/90 border border-rose-200 px-3 py-1.5 rounded-lg shadow-2xs">
                    ❤️ %100 Favori
                  </span>
                </div>
              </div>
            )}

            {/* Search & Sort Controls Toolbar */}
            <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kitap adı, yazar (Tolstoy, Zola, Christie...) veya konu ara..."
                  className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-stone-200 bg-white placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-600 focus:border-stone-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting and View Options */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-xs py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-hidden focus:ring-1 focus:ring-stone-500 cursor-pointer"
                  >
                    <option value="default">Sıralama: Varsayılan</option>
                    <option value="title-asc">Başlık (A - Z)</option>
                    <option value="title-desc">Başlık (Z - A)</option>
                    <option value="pages-asc">Sayfa Sayısı (Azdan Çoğa)</option>
                    <option value="pages-desc">Sayfa Sayısı (Çoktan Aza)</option>
                    <option value="rating-desc">En Yüksek Puan</option>
                  </select>
                </div>

                {/* View switcher */}
                <div className="flex items-center bg-stone-200/50 p-0.5 rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Geniş Izgara Görünümü"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'compact'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Kompakt Liste / Raf Görünümü"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar (Interactive buttons/toggles) */}
            {hasActiveFilters && (
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="text-stone-500 font-medium">Aktif Filtreler:</span>

                {selectedStatus !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('all')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    <span>Durum: {selectedStatus.replace(/_/g, ' ')}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {selectedGenres.map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => handleToggleGenre(gen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-200/80 text-amber-950 font-medium rounded-md hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <span>Tür: {gen}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}

                {selectedPublishers.map((pub) => (
                  <button
                    key={pub}
                    type="button"
                    onClick={() => handleTogglePublisher(pub)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200 text-stone-800 rounded-md hover:bg-stone-300 transition-colors cursor-pointer"
                  >
                    <span>{pub}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}

                {selectedAuthors.map((author) => (
                  <button
                    key={author}
                    type="button"
                    onClick={() => handleToggleAuthor(author)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <span>Yazar: {author}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}

                {onlyFavorites && (
                  <button
                    type="button"
                    onClick={() => setOnlyFavorites(false)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-900 rounded-md hover:bg-rose-200 transition-colors cursor-pointer"
                  >
                    <span>Sadece Favoriler</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200 text-stone-800 rounded-md hover:bg-stone-300 transition-colors cursor-pointer"
                  >
                    <span>Arama: "{searchQuery}"</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-stone-500 hover:text-stone-900 underline ml-2 transition-colors cursor-pointer text-xs"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}

            {/* Books Count Indicator */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Filtrelenen <strong className="text-stone-800 font-semibold tabular-nums">{filteredBooks.length}</strong> eserden {visibleBooks.length} tanesi gösteriliyor (Koleksiyon: <strong className="text-stone-800 tabular-nums">{books.length}</strong> kitap)
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline">
                Kitap kartına tıklayarak 1 sayfalık özeti açabilir ve durumunu değiştirebilirsiniz.
              </span>
            </div>

            {/* Books Grid */}
            {visibleBooks.length > 0 ? (
              <div className="space-y-6">
                <div
                  className={`grid gap-4 sm:gap-5 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  }`}
                >
                  {visibleBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onOpenSummary={(b) => setActiveBookForSummary(b)}
                      onStatusChange={handleStatusChange}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Show more button if there are more books */}
                {visibleCount < filteredBooks.length && (
                  <div className="text-center pt-4 pb-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      <span>Daha Fazla Kitap Göster (+{Math.min(24, filteredBooks.length - visibleCount)})</span>
                      <ChevronDown className="w-4 h-4 text-stone-500" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl p-12 text-center max-w-md mx-auto my-8">
                <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Aradığınız Kriterlere Uygun Kitap Bulunamadı
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Seçtiğiniz filtreler veya arama kelimesine uygun bir eser kitaplığımızda bulunamadı.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 shadow-2xs cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddBookOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs cursor-pointer"
                  >
                    Yeni Kitap Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-start lg:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-80 max-w-full h-full bg-[#FAF7F2] p-5 overflow-y-auto shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Filtreleme Menüsü
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Sidebar
              publishers={publishersList}
              genres={genresList}
              authors={authorsList}
              selectedPublishers={selectedPublishers}
              selectedGenres={selectedGenres}
              selectedAuthors={selectedAuthors}
              selectedStatus={selectedStatus}
              onlyFavorites={onlyFavorites}
              onTogglePublisher={handleTogglePublisher}
              onToggleGenre={handleToggleGenre}
              onToggleAuthor={handleToggleAuthor}
              onSelectStatus={setSelectedStatus}
              onToggleFavorites={() => setOnlyFavorites((prev) => !prev)}
              onResetFilters={handleResetFilters}
              statusCounts={statusCounts}
              totalBooks={books.length}
            />

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg"
            >
              Filtreleri Kapat
            </button>
          </div>
        </div>
      )}

      {/* 1-Page Rich Summary Modal */}
      {activeBookForSummary && (
        <BookSummaryModal
          book={activeBookForSummary}
          onClose={() => setActiveBookForSummary(null)}
          onStatusChange={handleStatusChange}
          onToggleFavorite={handleToggleFavorite}
          onUpdateCoupleNotes={handleUpdateCoupleNotes}
        />
      )}

      {/* Add New Book Modal */}
      {isAddBookOpen && (
        <AddBookModal
          onClose={() => setIsAddBookOpen(false)}
          onAddBook={handleAddBook}
          existingPublishers={publishersList.map((p) => p.name)}
          existingGenres={genresList.map((g) => g.name)}
        />
      )}

      {/* Random Book Selector Modal */}
      {isRandomBookOpen && (
        <RandomBookModal
          books={books}
          onClose={() => setIsRandomBookOpen(false)}
          onSelectBook={(book) => setActiveBookForSummary(book)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E7E2D8] bg-[#F5F2EB]/80 py-6 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">Bizim Kitaplığımız</span>
            <span aria-hidden="true">·</span>
            <span>Ben ve Eşim İçin Özel Kütüphane</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-medium text-stone-700">{books.length} Eser</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Orijinal Kitap Listesini Sıfırla</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
