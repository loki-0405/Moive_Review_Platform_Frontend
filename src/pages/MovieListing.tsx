import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { MovieCard } from '@/components/ui/movie-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Grid } from 'lucide-react';
import { genres } from '@/data/movies';
import axios from 'axios';

export default function MovieListing() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await axios.get('https://moive-review-platform-backend-3.onrender.com/movies');
        const moviesFromApi = res.data.data || [];

        // Map API fields to component's expected fields
        const formattedMovies = moviesFromApi.map((movie) => ({
          id: movie._id,
          title: movie.title,
          genre: movie.genre,
          year: movie.releaseYear,
          director: movie.director,
          cast: movie.cast,
          synopsis: movie.synopsis,
          posterUrl: movie.posterUrl,
          rating: movie.averageRating,
          reviewCount: movie.reviewCount,
        }));

        setMovies(formattedMovies);
        setError(null);
      } catch (err) {
        setError('Failed to load movies.');
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      movie.title.toLowerCase().includes(searchLower) ||
      movie.director.toLowerCase().includes(searchLower);
    const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return b.year - a.year;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-white text-glow mb-4">
              Discover Movies
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore our extensive collection of movies across all genres and
              decades
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl p-6 mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search movies, directors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full lg:w-48 bg-background border-border">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genre">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="year">Newest First</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle & Add Button */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>

                {user?.role === 'admin' && (
                  <Button
                    onClick={() => (window.location.href = '/addnewmoive')}
                    className="ml-auto"
                  >
                    Add New Movie
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex gap-2 flex-wrap">
              {selectedGenre && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {selectedGenre}
                  <button
                    className="ml-2 hover:text-primary-foreground"
                    onClick={() => setSelectedGenre('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-300">Found {sortedMovies.length} movies</p>
          </div>

          {/* Movie Grid or List */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onClick={() => (window.location.href = `/movie/${movie.id}`)}
              />
            ))}
          </div>

          {sortedMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No movies found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
