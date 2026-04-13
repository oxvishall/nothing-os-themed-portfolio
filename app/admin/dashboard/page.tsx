'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HiDotsHorizontal, HiPlus, HiTrash, HiX } from 'react-icons/hi';

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
  const [projTagInput, setProjTagInput] = useState('');
  const [projImageFile, setProjImageFile] = useState<File | null>(null);
  const [projImagePreview, setProjImagePreview] = useState<string | null>(null);
  const [projEditingId, setProjEditingId] = useState<string | null>(null);

  // Experience Form State
  const [expForm, setExpForm] = useState({
    organization: '',
    logo: '',
    website: '',
    roles: [
      { role: '', description: '', startDate: '', endDate: '', website: '' }
    ],
    tags: [] as string[],
  });
  const [expTagInput, setExpTagInput] = useState('');
  const [expEditingId, setExpEditingId] = useState<string | null>(null);

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
      if (res.ok && Array.isArray(data)) {
        setItems(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch data');
        setItems([]);
      }
    } catch (err) {
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

  // --- PROJECT HANDLERS ---
  const handleProjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = sessionStorage.getItem('adminPassword');
    try {
      // For now, we'll try JSON submission. 
      // If file uploads are needed, we'd use FormData and ensure the proxy handles it.
      const method = projEditingId ? 'PUT' : 'POST';
      const url = projEditingId ? `${API_URL}/projects/${projEditingId}` : `${API_URL}/projects`;
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || ''
        },
        body: JSON.stringify(projForm)
      });

      if (res.ok) {
        setProjEditingId(null);
        setProjForm({ title: '', description: '', image: '', tags: [], sourceUrl: '', liveUrl: '' });
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Submit failed');
      }
    } catch (err) {
      alert('Submit failed');
    }
  };

  const handleProjEdit = (item: any) => {
    setProjEditingId(item._id);
    setProjForm({
      title: item.title,
      description: item.description,
      image: item.image || '',
      tags: item.tags || [],
      sourceUrl: item.sourceUrl || '',
      liveUrl: item.liveUrl || '',
    });
  };

  // --- EXPERIENCE HANDLERS ---
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = sessionStorage.getItem('adminPassword');
    try {
      const method = expEditingId ? 'PUT' : 'POST';
      const url = expEditingId ? `${API_URL}/experience/${expEditingId}` : `${API_URL}/experience`;
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || ''
        },
        body: JSON.stringify(expForm)
      });

      if (res.ok) {
        setExpEditingId(null);
        setExpForm({
          organization: '', logo: '', website: '',
          roles: [{ role: '', description: '', startDate: '', endDate: '', website: '' }],
          tags: []
        });
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Submit failed');
      }
    } catch (err) {
      alert('Submit failed');
    }
  };

  const handleExpEdit = (item: any) => {
    setExpEditingId(item._id);
    setExpForm({
      organization: item.organization,
      logo: item.logo || '',
      website: item.website || '',
      roles: item.roles.map((r: any) => ({
        role: r.role,
        description: r.description,
        startDate: r.startDate,
        endDate: r.endDate,
        website: r.website || ''
      })),
      tags: item.tags || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this entry permanently?')) return;
    const adminPassword = sessionStorage.getItem('adminPassword');
    const endpoint = tab === 'Projects' ? 'projects' : 'experience';
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword || '' }
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans selection:bg-primary selection:text-background">
      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div>
          <span className="font-dot text-[10px] text-secondary tracking-widest uppercase">· SYSTEM DASHBOARD v1.0 ·</span>
          <h1 className="font-serif text-3xl">NOTHING × ADMIN</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-surface border border-border px-6 py-2 rounded-full text-xs font-bold hover:bg-page transition-colors uppercase tracking-wide"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex gap-4 mb-8 border-b border-border pb-4">
          <button 
            onClick={() => setTab('Projects')}
            className={`font-dot text-xs uppercase tracking-widest px-6 py-2 rounded-full transition-all border ${tab === 'Projects' ? 'bg-primary text-background border-primary' : 'text-secondary hover:text-primary border-transparent'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setTab('Experience')}
            className={`font-dot text-xs uppercase tracking-widest px-6 py-2 rounded-full transition-all border ${tab === 'Experience' ? 'bg-primary text-background border-primary' : 'text-secondary hover:text-primary border-transparent'}`}
          >
            Experience
          </button>
        </div>

        {error && <div className="text-red-500 mb-6 font-dot text-xs uppercase tracking-tight">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT: List Section */}
          <section className="flex-1 min-w-0">
            <h2 className="font-dot text-[10px] text-tertiary tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Existing Archive
            </h2>
            {loading ? (
              <div className="font-dot text-xs uppercase animate-pulse text-secondary">Decrypting directory...</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="bg-surface border border-border p-5 rounded-2xl group hover:border-primary transition-all hover:bg-elevated/50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl mb-1 truncate">{item.title || item.organization}</h3>
                        <p className="text-secondary text-sm line-clamp-2 mb-3 leading-relaxed">
                          {item.description || (item.roles && item.roles[0]?.description) || 'No description available.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(item.tags || []).map((t: string) => (
                            <span key={t} className="font-dot text-[9px] border border-border px-2 py-0.5 rounded uppercase text-tertiary">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => tab === 'Projects' ? handleProjEdit(item) : handleExpEdit(item)}
                          className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full hover:border-primary transition-colors"
                        >
                          <HiDotsHorizontal size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-tertiary font-dot text-xs uppercase py-12 text-center border border-dashed border-border rounded-3xl tracking-widest">Directory is empty.</div>}
              </div>
            )}
          </section>

          {/* RIGHT: Form Section */}
          <section className="lg:w-[450px] flex-shrink-0">
            <h2 className="font-dot text-[10px] text-tertiary tracking-widest uppercase mb-6">
              {tab === 'Projects' ? (projEditingId ? '· Edit Project ·' : '· New Project ·') : (expEditingId ? '· Edit Experience ·' : '· New Experience ·')}
            </h2>
            <div className="bg-surface border border-border p-6 rounded-3xl sticky top-8 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
              {tab === 'Projects' ? (
                <form onSubmit={handleProjSubmit} className="space-y-6">
                  <div className="admin-field-group">
                    <label className="admin-label">Project Title</label>
                    <input 
                      value={projForm.title}
                      onChange={e => setProjForm({...projForm, title: e.target.value})}
                      className="admin-input" 
                      placeholder="e.g. Xyra Exchange"
                      required 
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-label">Description</label>
                    <textarea 
                      value={projForm.description}
                      onChange={e => setProjForm({...projForm, description: e.target.value})}
                      rows={4} 
                      className="admin-input resize-none" 
                      placeholder="Tell the story of this project..."
                      required 
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-label">Cover Image URL</label>
                    <input 
                      value={projForm.image}
                      onChange={e => setProjForm({...projForm, image: e.target.value})}
                      className="admin-input" 
                      placeholder="https://images.unsplash.com/..." 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="admin-field-group">
                      <label className="admin-label">Source Link</label>
                      <input 
                        value={projForm.sourceUrl}
                        onChange={e => setProjForm({...projForm, sourceUrl: e.target.value})}
                        className="admin-input" 
                        placeholder="Github URL" 
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-label">Live Preview</label>
                      <input 
                        value={projForm.liveUrl}
                        onChange={e => setProjForm({...projForm, liveUrl: e.target.value})}
                        className="admin-input" 
                        placeholder="Website URL" 
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-label">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {projForm.tags.map(tag => (
                        <span key={tag} className="bg-background border border-border px-3 py-1 rounded-full text-[10px] font-dot uppercase flex items-center gap-2">
                          {tag}
                          <HiX className="cursor-pointer hover:text-red-500" onClick={() => setProjForm({...projForm, tags: projForm.tags.filter(t => t !== tag)})} />
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        value={projTagInput}
                        onChange={e => setProjTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (projTagInput.trim()) {
                              setProjForm({...projForm, tags: [...projForm.tags, projTagInput.trim()]});
                              setProjTagInput('');
                            }
                          }
                        }}
                        className="admin-input pr-10" 
                        placeholder="Add tag and press Enter..." 
                      />
                      <HiPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary cursor-pointer hover:text-primary" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity uppercase text-xs tracking-widest">
                      {projEditingId ? 'Update Entry' : 'Commit to Archive'}
                    </button>
                    {projEditingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setProjEditingId(null);
                          setProjForm({ title: '', description: '', image: '', tags: [], sourceUrl: '', liveUrl: '' });
                        }}
                        className="px-6 border border-border rounded-2xl hover:bg-elevated transition-colors"
                      >
                        <HiX size={20} />
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleExpSubmit} className="space-y-6">
                  <div className="admin-field-group">
                    <label className="admin-label">Organization Name</label>
                    <input 
                      value={expForm.organization}
                      onChange={e => setExpForm({...expForm, organization: e.target.value})}
                      className="admin-input" 
                      placeholder="e.g. Google DeepMind"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="admin-field-group">
                      <label className="admin-label">Logo URL</label>
                      <input 
                        value={expForm.logo}
                        onChange={e => setExpForm({...expForm, logo: e.target.value})}
                        className="admin-input" 
                        placeholder="SVG or PNG link" 
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-label">Website</label>
                      <input 
                        value={expForm.website}
                        onChange={e => setExpForm({...expForm, website: e.target.value})}
                        className="admin-input" 
                        placeholder="Company URL" 
                      />
                    </div>
                  </div>

                  <div className="admin-field-group">
                    <div className="flex justify-between items-center mb-4">
                       <label className="admin-label !mb-0">Roles Archive</label>
                       <button 
                         type="button" 
                         onClick={() => setExpForm({...expForm, roles: [...expForm.roles, { role: '', description: '', startDate: '', endDate: '', website: '' }]})}
                         className="text-[10px] font-dot uppercase text-primary bg-elevated px-4 py-1.5 rounded-full"
                       >
                         + Add Role
                       </button>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                      {expForm.roles.map((role, idx) => (
                        <div key={idx} className="bg-background border border-border p-4 rounded-2xl relative group">
                          <button 
                            type="button"
                            onClick={() => setExpForm({...expForm, roles: expForm.roles.filter((_, i) => i !== idx)})}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <HiX size={14} />
                          </button>
                          <input 
                            value={role.role}
                            onChange={e => {
                               const newRoles = [...expForm.roles];
                               newRoles[idx].role = e.target.value;
                               setExpForm({...expForm, roles: newRoles});
                            }}
                            className="admin-input-small mb-2" 
                            placeholder="Role Title" 
                            required
                          />
                          <textarea 
                            value={role.description}
                            onChange={e => {
                               const newRoles = [...expForm.roles];
                               newRoles[idx].description = e.target.value;
                               setExpForm({...expForm, roles: newRoles});
                            }}
                            className="admin-input-small resize-none mb-2" 
                            placeholder="What did you build?" 
                            rows={2}
                            required
                          />
                          <div className="grid grid-cols-2 gap-2">
                             <input 
                               value={role.startDate}
                               onChange={e => {
                                  const newRoles = [...expForm.roles];
                                  newRoles[idx].startDate = e.target.value;
                                  setExpForm({...expForm, roles: newRoles});
                               }}
                               className="admin-input-small text-[10px]" 
                               placeholder="Start Date" 
                             />
                             <input 
                               value={role.endDate}
                               onChange={e => {
                                  const newRoles = [...expForm.roles];
                                  newRoles[idx].endDate = e.target.value;
                                  setExpForm({...expForm, roles: newRoles});
                               }}
                               className="admin-input-small text-[10px]" 
                               placeholder="End Date" 
                             />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity uppercase text-xs tracking-widest">
                      {expEditingId ? 'Update Experience' : 'Confirm Archive'}
                    </button>
                    {expEditingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setExpEditingId(null);
                          setExpForm({ organization: '', logo: '', website: '', roles: [{ role: '', description: '', startDate: '', endDate: '', website: '' }], tags: [] });
                        }}
                        className="px-6 border border-border rounded-2xl hover:bg-elevated transition-colors"
                      >
                        <HiX size={20} />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-24 max-w-6xl mx-auto border-t border-border pt-8 text-center pb-12">
        <button 
          onClick={() => router.push('/')}
          className="text-tertiary text-xs font-dot tracking-widest hover:text-primary transition-colors uppercase flex items-center gap-2 mx-auto justify-center"
        >
          <span className="w-1 h-1 bg-tertiary rounded-full" />
          Disconnect from Terminal
        </button>
      </footer>

      <style jsx global>{`
        .admin-field-group { display: flex; flex-direction: column; }
        .admin-label { font-family: 'DotGothic16', monospace; font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .admin-input { width: 100%; background: var(--bg-page); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; outline: none; transition: border-color 0.2s; font-size: 14px; color: var(--text-primary); }
        .admin-input:focus { border-color: var(--text-primary); }
        .admin-input-small { width: 100%; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; outline: none; font-size: 13px; }
        .admin-input-small:focus { border-color: var(--text-primary); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }
      `}</style>
    </div>
  );
}
