import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, darkMode, setDarkMode } = useApp();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Please enter your name to continue');
      return;
    }
    if (trimmed.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(trimmed);
      toast.success(`Welcome aboard, ${trimmed}! 🎉`);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: darkMode ? '#0f0e1a' : '#f0f4ff' }}
    >
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '20%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      {/* Dark mode toggle top-right */}
      <button
        onClick={() => setDarkMode(d => !d)}
        className="absolute top-6 right-6 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
        style={{
          background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
          color: darkMode ? '#e2e8f0' : '#1e293b',
          cursor: 'pointer',
        }}
        title="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <div
        className="animate-scale-in relative z-10 w-full mx-4"
        style={{ maxWidth: 440 }}
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: darkMode ? 'rgba(30,27,48,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.15)'}`,
            boxShadow: darkMode
              ? '0 24px 64px rgba(0,0,0,0.5)'
              : '0 24px 64px rgba(99,102,241,0.12)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              }}
            >
              <GraduationCap size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-1">Welcome to SCES</h1>
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
              Smart Classroom Experience System
            </p>
          </div>

          {/* Features row */}
          <div className="flex justify-center gap-4 mb-8">
            {['📊 Analytics', '💬 Feedback', '❓ Doubts'].map(f => (
              <span
                key={f}
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#6366f1',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Prabhu Pritam"
                className="input-field"
                autoFocus
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.03)',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-2"
              style={{ padding: '0.85rem', width: '100%', borderRadius: 14 }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span style={{
                    width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.7s linear infinite',
                  }} />
                  Entering…
                </span>
              ) : (
                <>
                  <Sparkles size={16} />
                  Enter Classroom
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-center mt-5" style={{ color: 'var(--text-secondary)' }}>
            No account needed · Data saved locally · 100% private
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
