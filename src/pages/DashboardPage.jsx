import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { BarChart2, Clock, TrendingUp, Star, AlertCircle, Zap } from 'lucide-react';

function QuickActionBtn({ emoji, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl w-full text-left transition-all duration-200"
      style={{
        background: 'var(--bg-primary)',
        border: '1.5px solid var(--border)',
        color: 'var(--text-primary)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = `${color}15`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function ActivityItem({ icon: Icon, text, time, color }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}
      >
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{text}</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, feedbacks, doubts, engagement, avgRating, engagementLevel, setPage, totalEngagement } = useApp();

  const joinDate = user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '—';

  const pendingDoubts = doubts.filter(d => d.votes === 0).length;

  // Build activity feed from recent actions
  const activities = [];
  feedbacks.slice(0, 3).forEach(f => activities.push({
    icon: Star, color: '#f59e0b',
    text: `You rated a lecture ${f.rating}★`,
    time: new Date(f.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
  }));
  doubts.slice(0, 2).forEach(d => activities.push({
    icon: AlertCircle, color: '#6366f1',
    text: `Doubt submitted: "${d.text.slice(0, 35)}…"`,
    time: new Date(d.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
  }));
  engagement.history.slice(-2).forEach(e => activities.push({
    icon: Zap, color: '#10b981',
    text: `Engagement response: ${e.type === 'fast' ? 'Too Fast 🚀' : e.type === 'slow' ? 'Too Slow 🐢' : 'Good Pace 👍'}`,
    time: new Date(e.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
  }));
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <TopBar title="Dashboard" />

      <main className="flex-1 p-6 flex flex-col gap-6">

        {/* Hero welcome banner */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          }}
        >
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 80, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div className="relative z-10">
            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Member since {joinDate}
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', maxWidth: 380 }}>
              Track your classroom engagement, submit feedback, and collaborate with peers in real-time.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2 relative z-10">
            <div className="text-5xl font-extrabold text-white opacity-20 select-none">SCES</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="⚡" label="Engagement Level"  value={engagementLevel}       color="indigo"  delay={0}   />
          <StatCard icon="⭐" label="Avg Lecture Rating" value={avgRating !== '—' ? `${avgRating}/5` : '—'}  color="amber"   delay={80}  />
          <StatCard icon="❓" label="Pending Doubts"    value={pendingDoubts}         color="violet"  delay={160} sub={doubts.length > 0 ? `${doubts.length} total` : null} />
          <StatCard icon="📋" label="Feedbacks Given"   value={feedbacks.length}      color="emerald" delay={240} />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>⚡</span> Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <QuickActionBtn emoji="📝" label="Rate Today's Lecture" onClick={() => setPage('feedback')} color="#f59e0b" />
              <QuickActionBtn emoji="❓" label="Submit a Doubt"        onClick={() => setPage('doubts')}   color="#6366f1" />
              <QuickActionBtn emoji="🚀" label="Log Engagement"        onClick={() => setPage('engagement')} color="#10b981" />
              <QuickActionBtn emoji="📊" label="View Analytics"        onClick={() => setPage('analytics')} color="#8b5cf6" />
            </div>
          </div>

          {/* Engagement summary */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>📈</span> Engagement Stats
            </h3>
            {totalEngagement === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <span className="text-3xl">🏁</span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No engagement data yet</p>
                <button className="btn-secondary text-xs mt-2" onClick={() => setPage('engagement')}>Log Now</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {[
                  { key: 'good', label: 'Good Pace 👍', color: '#10b981' },
                  { key: 'fast', label: 'Too Fast 🚀',  color: '#ef4444' },
                  { key: 'slow', label: 'Too Slow 🐢',  color: '#f59e0b' },
                ].map(({ key, label, color }) => {
                  const pct = totalEngagement > 0 ? Math.round((engagement[key] / totalEngagement) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
                        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Based on {totalEngagement} response{totalEngagement !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '220ms' }}>
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>🕒</span> Recent Activity
            </h3>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <span className="text-3xl">🌱</span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No activity yet. Start exploring!</p>
              </div>
            ) : (
              <div>
                {activities.slice(0, 5).map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doubts highlight */}
        {doubts.length > 0 && (
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '280ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>🔥</span> Top Doubts
              </h3>
              <button className="btn-secondary text-xs py-1.5 px-3" onClick={() => setPage('doubts')}>
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...doubts].sort((a, b) => b.votes - a.votes).slice(0, 3).map(d => (
                <div
                  key={d.id}
                  className="rounded-xl p-4"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1.5px solid var(--border)',
                  }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    {d.text.length > 80 ? d.text.slice(0, 80) + '…' : d.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(d.date).toLocaleDateString('en-IN')}
                    </span>
                    <span className="badge badge-info">
                      ▲ {d.votes} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
