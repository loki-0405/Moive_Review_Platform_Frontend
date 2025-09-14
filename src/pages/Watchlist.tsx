import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '@/components/layout/header';
import { MovieCard } from '@/components/ui/movie-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Trash2, Film } from 'lucide-react';
import '../../public/sahoo.jpg';


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

interface WatchlistItem {
  _id: string;
  movie: {
    _id: string;
    title: string;
    genre: string[];
    releaseYear: number;
    synopsis?: string;
    posterUrl?: string;
    averageRating?: number;
  };
  addedAt: string;
}

export default function Watchlist() {
  const navigate = useNavigate();
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dateAdded' | 'title' | 'year' | 'rating'>('dateAdded');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user from localStorage safely
  let user : any= null;
 
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  useEffect(() => {
    async function fetchWatchlist() {
      if (!user || !(user._id || user.id)) {
        setError('Not logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`https://moive-review-platform-backend-3.onrender.com/api/users/${user.id}/watchlist`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setWatchlistItems(res.data);

        const movieList = res.data.map((item: WatchlistItem) => ({
          id: item.movie._id,
          title: item.movie.title,
          genre: item.movie.genre,
          year: item.movie.releaseYear.toString(),
          duration: '2h 10m',
          rating: item.movie.averageRating || 0,
          description: item.movie.synopsis || 'No synopsis available',
          posterUrl: item.movie.posterUrl || '',
          featured: false,
          trending: false
        }));
        setFilteredMovies(movieList);
        setError(null);
      } catch {
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    }
    fetchWatchlist();
  }, [user]);

  const applyFilters = (movies: Movie[]) => {
    let filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        filtered.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  };

  const displayedMovies = applyFilters(filteredMovies);

  const handleRemove = async (movieId: string) => {
    if (!user) return;
    try {
      await axios.delete(`https://moive-review-platform-backend-3.onrender.com/api/users/${user.id}/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWatchlistItems(prev => prev.filter(item => item.movie._id !== movieId));
      setFilteredMovies(prev => prev.filter(m => m.id !== movieId));
    } catch {
      alert('Failed to remove movie from watchlist');
    }
  };

  if (loading) return <div>Loading watchlist...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 container mx-auto px-4">
        <h1 className="text-4xl mb-8 text-white">My Watchlist</h1>

        {/* Search and filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground"
            />
          </div>

          <Select value={sortBy}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="year">Release Year</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Genres</SelectItem>
              {Array.from(new Set(watchlistItems.flatMap(item => item.movie.genre))).map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => navigate('/movies')} className="ml-auto">
            <Film className="w-4 h-4 mr-2" />
            Browse Movies
          </Button>
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedMovies.length > 0 ? (
            displayedMovies.map(movie => (
              <div key={movie.id} className="relative group cursor-pointer" onClick={() => navigate(`/movie/${movie.id}`)}>
                <MovieCard movie={movie} />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(movie.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 col-span-full text-gray-400">
              <Film className="w-24 h-24 mx-auto mb-6" />
              <h3 className="text-2xl mb-4">Your watchlist is empty</h3>
              <p className="max-w-md mx-auto mb-6">Add movies to start building your watchlist.</p>
              <Button onClick={() => navigate('/movies')} className="btn-hero">
                <Film className="w-5 h-5 mr-2" />
                Browse Movies
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
