export interface Movie {
  id: string;
  title: string;
  year: number;           // keep as number for sorting
  genre: string[];
  rating: number;
  description: string;
  posterUrl: string;      // unify to posterUrl (or rename your UI to use this)
  duration: string;
  director?: string;      // optional if sometimes missing
  cast?: string[];        // optional
  reviewCount?: number;   // optional
  featured?: boolean;
  trending?: boolean;
}


export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  joinDate: string;
  reviewCount: number;
  watchlistCount: number;
}