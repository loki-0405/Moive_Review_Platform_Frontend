import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // assuming you use sonner for toast notifications

function AddMovie() {
  const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState(''); // comma separated string for simplicity
  const [releaseYear, setReleaseYear] = useState('');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState(''); // comma separated
  const [synopsis, setSynopsis] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Access denied. Admins only.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://moive-review-platform-backend-3.onrender.com/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming you use a token for auth
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          genre: genre.split(',').map(g => g.trim()).filter(Boolean),
          releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
          director,
          cast: cast.split(',').map(c => c.trim()).filter(Boolean),
          synopsis,
          posterUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || 'Failed to add movie');
        setLoading(false);
        return;
      }

      toast.success('Movie added successfully');
      navigate('/movies'); // redirect to movie listing
    } catch (err) {
      toast.error('An error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Add New Movie</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg">
          <div>
            <label className="block mb-1 text-gray-300">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Movie title"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Genre(s)</label>
            <Input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Comma separated, e.g. Action, Drama"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Release Year</label>
            <Input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="e.g. 2023"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Director</label>
            <Input
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="Director's name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Cast</label>
            <Input
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              placeholder="Comma separated actor names"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Synopsis</label>
            <Textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Brief description of the movie"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Poster URL</label>
            <Input
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="URL of movie poster image"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Movie'}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default AddMovie;    