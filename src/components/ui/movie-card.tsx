import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Plus, Heart } from 'lucide-react';
import { Movie } from '@/types/movie';
import { cn } from '@/lib/utils';
import '../../../public/sahoo.jpg';
interface MovieCardProps {
   Movie : movie;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function MovieCard({ movie, variant = 'default', className, onClick }: MovieCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <Card
      className={cn(
        'movie-card cursor-pointer group border-0 w-full',
        isFeatured && 'aspect-[3/2]',  // shorter than 16/9
        !isFeatured && 'aspect-[3/4]',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 relative h-full">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-xl"
         style={{ backgroundImage: `url('/sahoo.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
          {/* Badges */}
          <div className="flex gap-1 sm:gap-2 mb-2">
            {movie.featured && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                Featured
              </Badge>
            )}
            {movie.trending && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                Trending
              </Badge>
            )}
          </div>

          {/* Movie Info */}
          <div className="space-y-1 sm:space-y-2">
            <h3 className={cn(
              'font-playfair font-bold text-white line-clamp-2',
              isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            )}>
              {movie.title}
            </h3>

            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
              <span>{movie.year}</span>
              <span>•</span>
              <span className="hidden sm:inline">{movie.duration}</span>
              <span className="hidden sm:inline">•</span>
              <span>{movie.genre[0]}</span>
            </div>

            <StarRating rating={movie.rating} size={isCompact ? 'sm' : 'md'} />

            {!isCompact && (
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {movie.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" className="btn-hero text-xs sm:text-sm px-2 sm:px-3">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Watch</span>
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 bg-black/20 hover:bg-white/10 p-1 sm:p-2">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 bg-black/20 hover:bg-white/10 p-1 sm:p-2">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Genre Labels for Featured */}
        {isFeatured && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-1">
            {movie.genre.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="bg-black/50 border-white/20 text-white text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}