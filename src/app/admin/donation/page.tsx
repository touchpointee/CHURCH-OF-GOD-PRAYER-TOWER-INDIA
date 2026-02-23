'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface DonationPoster {
  _id: string;
  title?: string;
  imageUrl: string;
  paymentLink: string;
  order: number;
}

export default function DonationSettingsPage() {
  const [posters, setPosters] = useState<DonationPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [posterImageUrl, setPosterImageUrl] = useState('');

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const res = await axios.get('/api/donation-posters');
      if (res.data.success && Array.isArray(res.data.data)) {
        setPosters(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load posters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.url ?? res.data.uploads?.[0]?.url;
      if (url) setPosterImageUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload poster image.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterImageUrl.trim() || !paymentLink.trim()) {
      alert('Please add a poster image and payment link.');
      return;
    }
    try {
      const res = await axios.post('/api/donation-posters', {
        title: title.trim() || undefined,
        imageUrl: posterImageUrl.trim(),
        paymentLink: paymentLink.trim(),
        order: posters.length,
      });
      if (res.data.success) {
        setPosters((prev) => [...prev, res.data.data]);
        setTitle('');
        setPaymentLink('');
        setPosterImageUrl('');
      }
    } catch (err: any) {
      console.error('Failed to add poster:', err);
      alert(err.response?.data?.error || 'Failed to add poster.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this donation poster?')) return;
    try {
      await axios.delete(`/api/donation-posters/${id}`);
      setPosters((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete poster.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Donation Posters</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Upload posters and set a payment link for each. They will appear on the Donate page as cards with a button linking to the payment URL.
      </p>

      <form onSubmit={handleAddPoster} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Add donation poster</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster image</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-24 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                {posterImageUrl ? (
                  <img src={posterImageUrl} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs text-center p-2">No image</span>
                )}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Choose image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={uploading} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. General Donation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment link *</label>
            <input
              type="url"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={!posterImageUrl.trim() || !paymentLink.trim() || uploading}
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Add poster
          </button>
        </div>
      </form>

      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Current posters</h2>
        {posters.length === 0 ? (
          <p className="text-gray-500 py-6">No posters yet. Add one above to show on the Donate page.</p>
        ) : (
          <ul className="space-y-4">
            {posters.map((p) => (
              <li key={p._id} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={p.imageUrl} alt={p.title || 'Poster'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {p.title && <p className="font-medium text-gray-900">{p.title}</p>}
                  <a href={p.paymentLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline truncate block">
                    {p.paymentLink}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={p.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent p-2"
                    title="Open link"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
