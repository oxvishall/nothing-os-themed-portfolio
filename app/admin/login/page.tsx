'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // The API URL from our proxy
    const API_URL = "/api";

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (!res.ok) {
        throw new Error('Invalid password');
      }
      
      sessionStorage.setItem('adminPassword', password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <span className="font-dot text-xs tracking-widest text-secondary block mb-4 uppercase">· SYSTEM ACCESS ·</span>
          <h1 className="font-serif text-4xl mb-2">ADMIN</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-center font-mono tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-dot text-center uppercase tracking-tight">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-background font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>

        <div className="mt-24 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-secondary text-xs font-dot tracking-widest hover:text-primary transition-colors uppercase"
          >
            ← Return to Public Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
