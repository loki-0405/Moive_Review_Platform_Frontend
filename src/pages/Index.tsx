import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/home/hero-section';
import { MovieCarousel } from '@/components/home/movie-carousel';
import { MovieCard } from '@/components/ui/movie-card';
import axios from 'axios';
import { Movie } from '@/types/movie';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMovieClick = (movie: Movie) => {
    window.location.href = `/movie/${movie.id}`;
  };

  const Footer = () => (
  <footer className="bg-card text-gray-400 py-8 mt-12 border-t border-border">
    <div className="container mx-auto px-4 text-center space-y-2">
      <p className="text-sm">&copy; {new Date().getFullYear()} CineScope. All rights reserved.</p>
      <div className="flex justify-center gap-4 text-sm">
        <p>About</p>
        <p>Contact</p>
         <p>Privacy Policy</p>
      </div>
    </div>
  </footer>
);


  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await axios.get('https://moive-review-platform-backend-3.onrender.com/api/movies');
        const moviesFromApi = res.data.data || [];

        const formattedMovies = moviesFromApi.map((movie: any) => ({
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
          trending: movie.trending, // optional field
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

  const trendingMovies = movies.filter((movie) => movie.trending);
  const actionMovies = movies.filter((movie) => movie.genre.includes('Action'));
  const sciFiMovies = movies.filter((movie) => movie.genre.includes('Sci-Fi'));
  const fantasyMovies = movies.filter((movie) => movie.genre.includes('Fantasy'));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

        <div className="container mx-auto px-4 py-10 space-y-10">
        
          {actionMovies.length > 0 && (
            <MovieCarousel
              title="🎬 All Moives"
              movies={actionMovies}
              onMovieClick={handleMovieClick}
            />
          )}

        </div>
      </main>
          <Footer />
    </div>
  );
};

export default Index;
