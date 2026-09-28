import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import toast from 'react-hot-toast';
import { ChevronUp, Send, Flame } from 'lucide-react';

function DoubtCard({ doubt, onUpvote, rank }) {
  const isTop = rank === 0;
  return (
    <div
      className="card p-5 animate-fade-in-up flex gap-4"
      style={{
        border: isTop ? '1.5px solid rgba(239,68,68,0.4)' : '1px solid var(--border)',
        animationDelay: `${rank * 60}ms`,
      }}
    >
      {/* Upvote column */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onUpvote(doubt.id)}
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1.5px solid rgba(99,102,241,0.3)',
            color: '#6366f1',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#6366f1';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
            e.currentTarget.style.color = '#6366f1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronUp size={18} strokeWidth={2.5} />
        </button>
        <span className="font-extrabold text-lg" style={{ color: '#6366f1' }}>
          {doubt.votes}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-medium text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {doubt.text}
          </p>
          {isTop && (
            <span className="badge badge-danger flex-shrink-0 flex items-center gap-1">
              <Flame size={10} /> Hot
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-info">Anonymous 🎭</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {new Date(doubt.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DoubtsPage() {
  const { doubts, addDoubt, upvoteDoubt } = useApp();
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('votes'); // 'votes' | 'recent'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) { toast.error('Please enter your doubt'); return; }
    if (text.trim().length < 5) { toast.error('Please be more descriptive'); return; }
    addDoubt(text.trim());
    setText('');
    toast.success('Doubt submitted anonymously 🎭');
  };

  const sorted = [...doubts].sort((a, b) =>
    filter === 'votes' ? b.votes - a.votes : new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <TopBar title="Anonymous Doubts" />

      <main className="flex-1 p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Submit form */}
          <div className="lg:col-span-2">
            <div className="card p-6 animate-fade-in-up sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1.5px solid rgba(99,102,241,0.3)' }}>
                  🎭
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Ask Anonymously</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Your identity is never revealed</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  className="input-field"
                  style={{ resize: 'vertical', minHeight: 120 }}
                  placeholder="What's confusing you? Ask anything…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {text.length}/500 characters
                  </span>
                  <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                    <Send size={14} />
                    Submit
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-primary)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>{doubts.length}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Doubts</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-primary)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                      {doubts.reduce((s, d) => s + d.votes, 0)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Upvotes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doubts list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Community Doubts {doubts.length > 0 && `(${doubts.length})`}
              </h3>
              {doubts.length > 1 && (
                <div className="flex gap-2">
                  {['votes', 'recent'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: filter === f ? '#6366f1' : 'var(--bg-card)',
                        color: filter === f ? 'white' : 'var(--text-secondary)',
                        border: `1.5px solid ${filter === f ? '#6366f1' : 'var(--border)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      {f === 'votes' ? '▲ Top Voted' : '🕒 Recent'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {sorted.length === 0 ? (
              <div className="card p-12 flex flex-col items-center gap-3">
                <span className="text-5xl">🤔</span>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No Doubts Yet</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Be brave — ask the first question!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sorted.map((d, i) => (
                  <DoubtCard key={d.id} doubt={d} onUpvote={upvoteDoubt} rank={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
