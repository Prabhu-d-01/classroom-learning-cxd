export default function StatCard({ icon, label, value, sub, color, delay = 0 }) {
  const colors = {
    indigo:  { bg: 'rgba(99,102,241,0.1)',  border: '#6366f1', text: '#6366f1' },
    violet:  { bg: 'rgba(139,92,246,0.1)',  border: '#8b5cf6', text: '#8b5cf6' },
    emerald: { bg: 'rgba(16,185,129,0.1)',  border: '#10b981', text: '#10b981' },
    rose:    { bg: 'rgba(244,63,94,0.1)',   border: '#f43f5e', text: '#f43f5e' },
    amber:   { bg: 'rgba(245,158,11,0.1)',  border: '#f59e0b', text: '#f59e0b' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div
      className="card stat-card p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, '--stat-color': c.text }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text }}
        >
          {icon}
        </div>
        {sub && (
          <span className="badge badge-info text-xs">{sub}</span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: c.text }}>
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
