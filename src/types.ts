export type ReadingStatus = 'okunmadi' | 'esim_okudu' | 'ben_okudum' | 'ikimiz_de_okuduk';

export interface BookSummary {
  lead: string;
  contextAndPlot: string;
  themesAndAnalysis: string;
  whyReadTogether: string;
  notableQuotes: string[];
}

export interface CoupleNotes {
  myNote?: string;
  spouseNote?: string;
  myRating?: number;
  spouseRating?: number;
  lastUpdated?: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  translator?: string;
  publisher: string;
  genre: string;
  pages: number;
  year: number;
  isbn?: string;
  status: ReadingStatus;
  rating: number; // 1 to 5
  isFavorite?: boolean;
  coverStyle: {
    bgGradient: string;
    accentColor: string;
    textColor: string;
    spineColor: string;
    pattern?: 'classic' | 'minimal' | 'noir' | 'ornate' | 'geometry';
  };
  summary: BookSummary;
  coupleNotes?: CoupleNotes;
  addedAt: string;
}

export type SortOption = 'default' | 'title-asc' | 'title-desc' | 'pages-asc' | 'pages-desc' | 'rating-desc';
