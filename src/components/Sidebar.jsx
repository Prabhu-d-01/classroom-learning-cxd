import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Zap,
  LogOut,
  Sun,
  Moon,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'feedback',   label: 'Feedback',   icon: MessageSquare   },
  { id: 'doubts',     label: 'Doubts',     icon: HelpCircle      },
  { id: 'engagement', label: 'Engagement', icon: Zap             },
  { id: 'analytics',  label: 'Analytics',  icon: BarChart3       },
];

export default function Sidebar() {
  const { page, setPage, user, logout, darkMode, setDarkMode } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar flex flex-col h-screen sticky top-0 z-40 transition-all duration-300"
      style={{ width: collapsed ? 72 : 240, minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}
        >
          <GraduationCap size={20} color="white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-white text-sm leading-tight">SCES</div>
            <div className="text-xs" style={{ color: 'var(--text-sidebar)' }}>Classroom System</div>
          </div>
        )}
      </div>

      {/* User pill */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-2 rounded-xl p-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
            {user.name[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-sm font-semibold truncate">{user.name}</div>
            <div className="text-xs" style={{ color: 'var(--text-sidebar)' }}>Student</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`sidebar-link w-full ${page === id ? 'active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 flex flex-col gap-1 border-t border-white/10 pt-3">
        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className="sidebar-link w-full"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="sidebar-link w-full"
          style={{ color: '#f87171', justifyContent: collapsed ? 'center' : 'flex-start' }}
          title="Logout"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="sidebar-link w-full mt-1"
          style={{ justifyContent: collapsed ? 'center' : 'flex-end', opacity: 0.6 }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
