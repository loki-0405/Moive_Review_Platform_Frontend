import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import '../../public/sahoo.jpg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarRating } from '@/components/ui/star-rating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Star, Send } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface MovieOption {
  id: string;
  title: string;
  releaseYear: number;
  posterUrl: string;
}

export default function ReviewSubmission() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movies, setMovies] = useState<MovieOption[]>([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState<string | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch movies for the Select dropdown
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsMoviesLoading(true);
        const res = await axios.get('https://moive-review-platform-backend-3.onrender.com/api/movies');
        const apiMovies = res.data.data || [];

        const formatted = apiMovies.map((m: any) => ({
          id: m._id,
          title: m.title,
          releaseYear: m.releaseYear,
          posterUrl: m.posterUrl,
        }));

        setMovies(formatted);
        setMoviesError(null);
      } catch (err) {
        console.error(err);
        setMoviesError('Failed to load movies');
      } finally {
        setIsMoviesLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const selectedMovieData = movies.find(m => m.id === selectedMovie);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie) {
      toast({
        title: "Incomplete Review",
        description: "Please select a movie.",
        variant: "destructive"
      });
      return;
    }
    if (!rating) {
      toast({
        title: "Incomplete Review",
        description: "Please give a rating.",
        variant: "destructive"
      });
      return;
    }
    if (!reviewText.trim()) {
      toast({
        title: "Incomplete Review",
        description: "Please write a review text.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Suppose your backend expects POST to /api/movies/:id/reviews
      const res = await axios.post(
        `https://moive-review-platform-backend-3.onrender.com/api/movies/${selectedMovie}/reviews`,
        {
          rating,
          text: reviewText.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );

      if (res.status === 201) {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your review."
        });
        // Reset form
        setSelectedMovie('');
        setRating(0);
        setReviewText('');
        // Optionally navigate or refresh reviews
      } else {
        toast({
          title: "Error",
          description: res.data.message || "Failed to submit review.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-white text-glow">
                Write a Review
              </h1>
              <p className="text-gray-300 mt-2">
                Share your thoughts and help others discover great movies
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Movie Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Movie Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Movie *
                      </label>
                      { isMoviesLoading ? (
                        <p className="text-gray-300">Loading movies...</p>
                      ) : moviesError ? (
                        <p className="text-red-500">{moviesError}</p>
                      ) : (
                        <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Choose a movie to review" />
                          </SelectTrigger>
                          <SelectContent>
                            {movies.map(movie => (
                              <SelectItem key={movie.id} value={movie.id}>
                                {movie.title} ({movie.releaseYear})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Rating *
                      </label>
                      <div className="flex items-center gap-4">
                        <StarRating 
                          rating={rating} 
                          size="lg"
                          interactive
                          onRatingChange={(newRating: number) => setRating(newRating)}
                        />
                        <span className="text-white text-lg">
                          {rating > 0 ? `${rating}/5` : 'Select rating'}
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Review *
                      </label>
                      <Textarea
                        placeholder="What did you think of this movie? Share your thoughts, what you liked or disliked..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="min-h-[150px] bg-background border-border text-foreground resize-none"
                        maxLength={1000}
                      />
                      <div className="text-right text-sm text-gray-400 mt-1">
                        {reviewText.length}/1000 characters
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-hero"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setSelectedMovie('');
                          setRating(0);
                          setReviewText('');
                        }}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Movie Preview */}
            <div className="space-y-6">
              { selectedMovieData ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <img 
                      src={'/sahoo.jpg'}
                      alt={selectedMovieData.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-playfair font-bold text-white text-lg mb-2">
                      {selectedMovieData.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>Year: {selectedMovieData.releaseYear}</div>
                      <div>Genre: {/* optionally show genres, if you fetch */}</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <StarRating rating={selectedMovieData ? rating : 0} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      Select a movie to see its preview
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Review Guidelines */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Review Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-300">
                  <p>• Be honest and constructive in your feedback.</p>
                  <p>• Avoid major spoilers without warning.</p>
                  <p>• Focus on storytelling, acting, direction, direction, production quality, etc.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
