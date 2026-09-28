import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import toast from 'react-hot-toast';

const BUTTONS = [
  {
    key: 'fast',
    emoji: '🚀',
    label: 'Too Fast',
    desc: 'The lecture pace is too fast to follow',
    cls: 'fast',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
  },
  {
    key: 'slow',
    emoji: '🐢',
    label: 'Too Slow',
    desc: 'The pace could be a bit faster',
    cls: 'slow',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    key: 'good',
    emoji: '👍',
    label: 'Good Pace',
    desc: "The pace is perfect, I'm following along",
    cls: 'good',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
];

export default function EngagementPage() {
  const { engagement, recordEngagement, totalEngagement } = useApp();
  const [selected, setSelected] = useState(null);
  const [cooldown, setCooldown] = useState(false);

  const handleClick = (key) => {
    if (cooldown) { toast.error('Please wait a moment before responding again ⏳'); return; }
    setSelected(key);
    recordEngagement(key);
    toast.success(`Response recorded: ${BUTTONS.find(b => b.key === key).label} ${BUTTONS.find(b => b.key === key).emoji}`);
    setCooldown(true);
    setTimeout(() => { setCooldown(false); setSelected(null); }, 3000);
  };

  const recentHistory = [...(engagement.history || [])].reverse().slice(0, 10);

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <TopBar title="Real-Time Engagement" />

      <main className="flex-1 p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="card p-6 animate-fade-in-up text-center" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
          border: '1.5px solid rgba(99,102,241,0.2)',
        }}>
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            How's the lecture going?
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tap below to let your instructor know about the lecture pace in real-time.
            Your response is instant and anonymous.
          </p>
        </div>

        {/* Engagement buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BUTTONS.map(({ key, emoji, label, desc, cls, color, bg }) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`engage-btn ${cls} ${selected === key ? 'selected' : ''}`}
              style={{ padding: '1.5rem', textAlign: 'center' }}
            >
              <div className="text-5xl mb-3" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}>
                {emoji}
              </div>
              <div className="text-lg font-bold mb-1">{label}</div>
              <div className="text-xs font-normal opacity-75">{desc}</div>
              <div className="mt-3 text-2xl font-extrabold" style={{ color }}>
                {engagement[key] || 0}
                <span className="text-xs font-normal ml-1" style={{ color: 'inherit', opacity: 0.7 }}>
                  {engagement[key] === 1 ? 'response' : 'responses'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Stats */}
        {totalEngagement > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Progress bars */}
            <div className="card p-6 animate-fade-in-up">
              <h3 className="font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
                📊 Response Breakdown
              </h3>
              <div className="flex flex-col gap-5">
                {BUTTONS.map(({ key, emoji, label, color }) => {
                  const val = engagement[key] || 0;
                  const pct = totalEngagement > 0 ? Math.round((val / totalEngagement) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {emoji} {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color }}>
                            {val} ({pct}%)
                          </span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Total responses: {totalEngagement}
                </p>
              </div>
            </div>

            {/* Recent history */}
            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                🕒 Recent Responses
              </h3>
              {recentHistory.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No history yet</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {recentHistory.map((item, i) => {
                    const btn = BUTTONS.find(b => b.key === item.type);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl animate-slide-in"
                        style={{
                          background: btn?.bg || 'var(--bg-primary)',
                          animationDelay: `${i * 40}ms`,
                        }}
                      >
                        <span className="text-xl">{btn?.emoji}</span>
                        <div className="flex-1">
                          <span className="text-sm font-semibold" style={{ color: btn?.color }}>
                            {btn?.label}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(item.date).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cooldown indicator */}
        {cooldown && (
          <div
            className="card p-4 text-center animate-fade-in"
            style={{ border: '1.5px solid rgba(99,102,241,0.3)' }}
          >
            <p className="text-sm" style={{ color: 'var(--accent)' }}>
              ✅ Response recorded! You can respond again in a few seconds…
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
