import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/ui/star-rating';
import { Star, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../../public/sahoo.jpg';

interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface WatchlistItem {
  id: string;
  movieId: string;
  title: string;
  poster: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    bio: string;
    joinDate: string;
    avatar: string;
  } | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);  // NEW
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userData = {
        id: parsedUser.id || parsedUser._id || 'user1',
        name: parsedUser.username || parsedUser.name || 'User',
        bio: parsedUser.bio || 'Movie enthusiast and critic. Love exploring new genres and sharing my thoughts on cinema.',
        joinDate: parsedUser.joinDate || 'March 2023',
        avatar: parsedUser.avatar || '🎬',
      };
      setUser(userData);
      fetchReviews(userData.id);
      fetchWatchlist(userData.id);  // NEW
    } else {
      setLoading(false);
    }
  }, []);

  // Editable star rating used for editing a review
  function EditableStarRating({
    rating,
    size = 'sm',
    onChange,
  }: {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    onChange: (rating: number) => void;
  }) {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex gap-1 cursor-pointer text-yellow-400">
        {stars.map((star) => (
          <Star
            key={star}
            size={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
            className={star <= rating ? 'fill-current' : 'text-gray-500'}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  }

  // Fetch reviews
  async function fetchReviews(userId: string) {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://moive-review-platform-backend-3.onrender.com/api/movies/reviews/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted = res.data.reviews.map((r: any) => ({
        id: r._id,
        movieId: r.movie._id,
        movieTitle: r.movie.title,
        moviePoster: r.movie.posterUrl || '/placeholder-poster.png',
        rating: r.rating,
        comment: r.text || '',
        date: new Date(r.createdAt).toLocaleDateString(),
        helpful: r.helpful || 0,
      }));
      setReviews(formatted);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      // Do not set loading = false here if watchlist also needs loading
      // We’ll wait until both fetches done
    }
  }

  // NEW: Fetch watchlist
  async function fetchWatchlist(userId: string) {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://moive-review-platform-backend-3.onrender.com/api/users/${userId}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // res.data should be array of watchlist items
      const formatted = res.data.map((item: any) => ({
        id: item._id,
        movieId: item.movie._id,
        title: item.movie.title,
        poster: item.movie.posterUrl || '/placeholder-poster.png',
      }));
      setWatchlist(formatted);
    } catch (err) {
      console.error('Error fetching watchlist', err);
    } finally {
      // Once both reviews and watchlist are fetched, stop loading
      setLoading(false);
    }
  }

  // NEW: Remove from watchlist
  async function removeFromWatchlist(movieId: string) {
    if (!user) return;
    const confirmed = confirm('Are you sure you want to remove this movie from your watchlist?');
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://moive-review-platform-backend-3.onrender.com/api/users/${user.id}/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh watchlist
      fetchWatchlist(user.id);
    } catch (error) {
      console.error('Error removing from watchlist', error);
      alert('Could not remove from watchlist');
    }
  }

  // Review edit logic
  function startEditing(review: Review) {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  }

  function cancelEditing() {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment('');
  }

  async function saveReview(review: Review) {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://moive-review-platform-backend-3.onrender.com/api/movies/${review.movieId}/reviews/${review.id}`,
        { rating: editRating, text: editComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // refresh reviews
      fetchReviews(user.id);
      cancelEditing();
    } catch (error) {
      console.error('Failed to update review:', error);
      alert('Failed to update review');
    }
  }

  async function deleteReview(review: Review) {
    if (!user) return;
    const confirmed = confirm(`Are you sure you want to delete your review for "${review.movieTitle}"?`);
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://moive-review-platform-backend-3.onrender.com/api/movies/${review.movieId}/reviews/${review.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh
      fetchReviews(user.id);
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    }
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-card rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-playfair font-bold text-white">{user.name}</h1>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-300 max-w-2xl mr-4">{user.bio}</p>
                  <Button onClick={() => (window.location.href = '/logout')}>Log out</Button>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{reviews.length} Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{watchlist.length} Watchlist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="reviews" className="space-y-8">
            <TabsList className="bg-card border-border">
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
            </TabsList>

            {/* Reviews Tab Content */}
            <TabsContent value="reviews" className="space-y-6 mx-20">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-playfair font-bold text-white">
                  My Reviews ({reviews.length})
                </h2>
                <Button onClick={() => (window.location.href = '/review/new')}>
                  Review a Movie
                </Button>
              </div>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-xl p-6">
                      <div className="flex gap-4">
                        <img
                          src={'/sahoo.jpg'}
                          alt={review.movieTitle}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{review.movieTitle}</h3>
                            {editingReviewId === review.id ? (
                              <EditableStarRating
                                rating={editRating}
                                size="sm"
                                onChange={(newRating) => setEditRating(newRating)}
                              />
                            ) : (
                              <StarRating rating={review.rating} size="sm" />
                            )}
                            <span className="text-gray-400 text-sm">{review.date}</span>
                          </div>

                          {editingReviewId === review.id ? (
                            <>
                              <textarea
                                className="w-full p-2 rounded bg-background text-white border border-gray-600"
                                rows={3}
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                              />
                              <div className="mt-3 flex gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => saveReview(review)}
                                  className="text-green-400 hover:text-green-600"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="text-gray-400 hover:text-white"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-300">{review.comment}</p>
                              <div className="mt-3 flex gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => startEditing(review)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-destructive"
                                  onClick={() => deleteReview(review)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center">No reviews posted yet.</div>
                )}
              </div>
            </TabsContent>

            {/* Watchlist Tab Content */}
            <TabsContent value="watchlist" className="space-y-6 mx-20">
              <h2 className="text-2xl font-playfair font-bold text-white">
                My Watchlist ({watchlist.length})
              </h2>
              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {watchlist.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg p-4 relative group">
                      <img
                        src={'/sahoo.jpg'}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-md"
                      />
                      <h3 className="text-white text-md font-semibold mt-2">{item.title}</h3>
                      <button
                        onClick={() => removeFromWatchlist(item.movieId)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center">Your watchlist is empty.</div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
}
