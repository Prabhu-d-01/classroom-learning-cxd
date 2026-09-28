import { Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopBar({ title }) {
  const { user, darkMode, setDarkMode } = useApp();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {user && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {greeting}, <span className="font-semibold" style={{ color: 'var(--accent)' }}>{user.name}</span> 👋
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search (decorative) */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: 'var(--bg-primary)',
            border: '1.5px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <Search size={15} />
          <span className="text-sm">Search…</span>
        </div>

        {/* Notification bell */}
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-primary)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: '#6366f1' }}
          />
        </button>

        {/* Avatar */}
        {user && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}
          >
            {user.name[0].toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
