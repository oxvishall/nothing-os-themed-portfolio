'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = "/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState<'Experience' | 'Projects'>('Projects');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Project Form State
  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: [] as string[],
    sourceUrl: '',
    liveUrl: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (!adminPassword) {
      router.push('/admin/login');
    } else {
      fetchData();
    }
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'Projects' ? 'projects' : 'experience';
      const res = await fetch(`${API_URL}/${endpoint}`);
      const data = await res.json();
      console.log(`Admin Fetch ${endpoint}:`, data);
      if (res.ok && Array.isArray(data)) {
        setItems(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch data');
        setItems([]);
      }
    } catch (err) {
      console.error("Admin fetchData error:", err);
      setError('Failed to fetch data');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const adminPassword = sessionStorage.getItem('adminPassword');
    const endpoint = tab === 'Projects' ? 'projects' : 'experience';
    try {
      await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword || '' }
      });
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <div>
          <span className="font-dot text-[10px] text-secondary tracking-widest uppercase">· SYSTEM DASHBOARD ·</span>
          <h1 className="font-serif text-3xl">NOTHING × ADMIN</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-surface border border-border px-6 py-2 rounded-full text-xs font-bold hover:bg-page transition-colors uppercase tracking-wide"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-8 border-b border-border pb-4">
          <button 
            onClick={() => setTab('Projects')}
            className={`font-dot text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all ${tab === 'Projects' ? 'bg-primary text-background' : 'text-secondary hover:text-primary'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setTab('Experience')}
            className={`font-dot text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all ${tab === 'Experience' ? 'bg-primary text-background' : 'text-secondary hover:text-primary'}`}
          >
            Experience
          </button>
        </div>

        {error && <div className="text-red-500 mb-4 font-dot text-xs uppercase">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* List Section */}
          <section>
            <h2 className="font-dot text-[10px] text-tertiary tracking-widest uppercase mb-6">Current Items</h2>
            {loading ? (
              <div className="font-dot text-xs uppercase animate-pulse">Loading archive...</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="bg-surface border border-border p-5 rounded-2xl group hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{item.title || item.organization}</h3>
                        <p className="text-secondary text-sm line-clamp-2 mb-3">{item.description || (item.roles && item.roles[0].description)}</p>
                        <div className="flex flex-wrap gap-2">
                          {(item.tags || []).slice(0, 3).map((t: string) => (
                            <span key={t} className="font-dot text-[9px] border border-border px-2 py-0.5 rounded uppercase">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="text-xs font-bold uppercase hover:text-primary">Edit</button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-xs font-bold uppercase text-red-500/70 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-tertiary font-dot text-xs uppercase">No items found in directory.</div>}
              </div>
            )}
          </section>

          {/* Form Section */}
          <section>
            <h2 className="font-dot text-[10px] text-tertiary tracking-widest uppercase mb-6">Create New</h2>
            <div className="bg-surface border border-border p-8 rounded-3xl sticky top-8">
              <form className="space-y-6">
                <div>
                  <label className="block font-dot text-[10px] text-secondary uppercase tracking-widest mb-2">Title / Org</label>
                  <input className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block font-dot text-[10px] text-secondary uppercase tracking-widest mb-2">Description</label>
                  <textarea rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <div>
                  <label className="block font-dot text-[10px] text-secondary uppercase tracking-widest mb-2">Asset URL (Image/Logo)</label>
                  <input className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors" />
                </div>
                <button className="w-full bg-primary text-background font-bold py-3 rounded-full hover:opacity-90 transition-opacity uppercase text-sm tracking-wide">
                  Commit to Archive
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-24 max-w-5xl mx-auto border-t border-border pt-8 text-center">
        <button 
          onClick={() => router.push('/')}
          className="text-tertiary text-xs font-dot tracking-widest hover:text-primary transition-colors uppercase"
        >
          ← Exit System
        </button>
      </footer>
    </div>
  );
}
