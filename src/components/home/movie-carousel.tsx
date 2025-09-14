import { MovieCard } from '@/components/ui/movie-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useRef } from 'react';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one movie card + gap
      const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-4">
          <h2 className="text-2xl lg:text-3xl font-playfair font-bold text-white text-center sm:text-left">
            {title}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              className="border-white/20 bg-black/20 hover:bg-white/10 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              className="border-white/20 bg-black/20 hover:bg-white/10 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-none w-64 sm:w-72 lg:w-80">
                <MovieCard 
                  movie={movie}
                  onClick={() => onMovieClick?.(movie)}
                />
              </div>
            ))}
          </div>
          
          {/* Gradient Fade */}
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}