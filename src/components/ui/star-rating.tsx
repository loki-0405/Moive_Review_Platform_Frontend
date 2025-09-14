import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false,
  onRatingChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isPartial = rating > index && rating < starRating;
        
        return (
          <button
            key={index}
            className={cn(
              'star-rating transition-all duration-200',
              interactive && 'hover:scale-110 cursor-pointer',
              !interactive && 'cursor-default'
            )}
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
          >
            <Star 
              className={cn(
                sizeClasses[size],
                isFilled || isPartial ? 'star-filled' : 'star-empty',
                isFilled && 'fill-current'
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}