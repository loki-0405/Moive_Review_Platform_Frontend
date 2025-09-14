import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Play, Plus, Heart, Calendar, User } from 'lucide-react';
import axios from 'axios';
import '../../public/sahoo.jpg';

interface Movie {
  id: string;
  title: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [ratingInfo, setRatingInfo] = useState<{ averageRating: number; reviewCount: number } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  useEffect(() => {
    async function fetchMovie() {
      if (!id) {
        setError('Invalid movie id');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://moive-review-platform-backend-3.onrender.com/api/movies/${id}`);
        const mv = res.data.movie;
        const revs = res.data.reviews || [];

        const formattedMovie: Movie = {
          id: mv._id,
          title: mv.title,
          genre: mv.genre,
          releaseYear: mv.releaseYear,
          director: mv.director,
          cast: mv.cast,
          synopsis: mv.synopsis,
          posterUrl: mv.posterUrl,
        };

        const formattedReviews: Review[] = revs.map((r: any) => ({
          id: r._id || r.id,
          userName: r.user?.username || 'Anonymous',
          userAvatar: r.user?.profilePicture || '',
          rating: r.rating,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
          comment: r.text || r.comment || '',
          helpful: r.helpful || 0,
        }));

        const ratingRes = await axios.get(`https://moive-review-platform-backend-3.onrender.com/api/movies/${id}/rating`);

        setMovie(formattedMovie);
        setReviews(formattedReviews);
        setRatingInfo({
          averageRating: ratingRes.data.averageRating,
          reviewCount: ratingRes.data.reviewCount,
        });

        setError(null);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  async function handleAddToWatchlist() {
    if (!user || !user.id) {
      alert('You must be logged in to add to watchlist');
      return;
    }

    if (!movie) {
      alert('Movie data not loaded yet');
      return;
    }

    setAdding(true);
    try {
      await axios.post(
        `https://moive-review-platform-backend-3.onrender.com/api/users/${user.id}/watchlist`,
        { movieId: movie.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      setAddedToWatchlist(true);
      alert('Added to your watchlist!');
    } catch (error) {
      console.error(error);
      alert('Failed to add to watchlist');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
            <p className="text-gray-300">{error || 'No data available.'}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Banner */}
        <div className="relative h-[70vh] lg:h-[80vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/sahoo.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-end w-full">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {movie.genre.map((g) => (
                      <Badge
                        key={g}
                        variant="outline"
                        className="bg-black/50 border-white/20 text-white"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-white text-glow">
                    {movie.title}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.releaseYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{movie.director}</span>
                    </div>
                  </div>

                  {/* ✅ Dynamic Star Rating */}
                  {ratingInfo && <StarRating rating={ratingInfo.averageRating} size="lg" />}

                  <p className="text-lg text-gray-300 max-w-2xl">{movie.synopsis}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button size="lg" className="btn-hero">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Trailer
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-black/20 hover:bg-white/10 text-white"
                    onClick={handleAddToWatchlist}
                    disabled={adding || addedToWatchlist}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {addedToWatchlist ? 'Added' : 'Watchlist'}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsFavorite((prev) => !prev)}
                    className={`border-white/20 bg-black/20 hover:bg-white/10 text-white ${
                      isFavorite ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart
                      className="w-5 h-5 mr-2"
                      fill={isFavorite ? 'red' : 'none'}
                      stroke={isFavorite ? 'red' : 'currentColor'}
                    />
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </Button>
                </div>
              </div>

              {/* Poster */}
              <div className="hidden lg:flex justify-end">
                <div className="w-80 aspect-[2/3] rounded-xl overflow-hidden movie-card">
                  <img
                    src={'/sahoo.jpg'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="details" className="space-y-8">
            <TabsList className="bg-card border-border">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="bg-card rounded-xl p-6">
                <h3 className="text-2xl font-playfair font-bold text-white mb-4">Movie Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Director:</span>
                      <span className="text-white ml-2">{movie.director}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Year:</span>
                      <span className="text-white ml-2">{movie.releaseYear}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-2">
                        {ratingInfo ? ratingInfo.averageRating.toFixed(1) : 'N/A'}/5
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Reviews:</span>
                      <span className="text-white ml-2">
                        {ratingInfo ? ratingInfo.reviewCount : 0} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cast" className="space-y-6">
              <div className="bg-card rounded-xl p-6">
                <h3 className="text-2xl font-playfair font-bold text-white mb-4">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {actor.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-white font-medium">{actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-playfair font-bold text-white">Reviews</h3>
                <Button onClick={() => navigate(`/review/new`)}>Write Review</Button>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {review.userAvatar ? (
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            review.userName.split(' ').map((n) => n[0]).join('')
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{review.userName}</h4>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-gray-400 text-sm">{review.date}</span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-300">No reviews yet.</p>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
