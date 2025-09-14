import { movies } from '@/data/movies';
import heroBackground from '@/assets/hero-background.jpg';

export function HeroSection() {
  const featuredMovies = movies.filter(movie => movie.featured);
  const primaryMovie = featuredMovies[0];

  return (
    <section className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12 flex flex-col">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh] gap-8 max-w-2xl mx-auto">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-glow leading-tight">
              Discover<br />
              <span className="text-glow-secondary">Cinema</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300">
              
              
              Dive into a universe of stories — from timeless classics to the latest blockbusters. CineScope is your go-to platform to explore detailed movie info, discover hidden gems, and read honest reviews from real movie lovers like you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
