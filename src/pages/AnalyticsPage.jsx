import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const ENGAGEMENT_COLORS = { good: '#10b981', fast: '#ef4444', slow: '#f59e0b' };

function EmptyChart({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-2">
      <span className="text-3xl">📉</span>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {subtitle && <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CustomTooltipStyle({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: 'var(--shadow)',
      fontSize: 13,
      color: 'var(--text-primary)',
    }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { feedbacks, engagement, doubts, totalEngagement } = useApp();

  /* ── Rating over time ── */
  const ratingData = feedbacks.map((f, i) => ({
    name: new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    rating: f.rating,
    avg: parseFloat(
      (feedbacks.slice(0, i + 1).reduce((s, x) => s + x.rating, 0) / (i + 1)).toFixed(2)
    ),
  })).reverse();

  /* ── Engagement trend (group by day) ── */
  const engByDay = {};
  (engagement.history || []).forEach(e => {
    const d = new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!engByDay[d]) engByDay[d] = { date: d, good: 0, fast: 0, slow: 0 };
    engByDay[d][e.type]++;
  });
  const engagementData = Object.values(engByDay);

  /* ── Pie: current engagement split ── */
  const pieData = [
    { name: 'Good Pace 👍', value: engagement.good || 0, color: '#10b981' },
    { name: 'Too Fast 🚀',  value: engagement.fast || 0, color: '#ef4444' },
    { name: 'Too Slow 🐢',  value: engagement.slow || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  /* ── Rating distribution bar ── */
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star: `${star}★`,
    count: feedbacks.filter(f => f.rating === star).length,
  }));

  /* ── Summary stats ── */
  const summaryStats = [
    { label: 'Total Feedbacks',     value: feedbacks.length,    color: '#6366f1', emoji: '📋' },
    { label: 'Avg Rating',          value: feedbacks.length ? (feedbacks.reduce((s,f)=>s+f.rating,0)/feedbacks.length).toFixed(1) + '★' : '—', color: '#f59e0b', emoji: '⭐' },
    { label: 'Total Doubts',        value: doubts.length,       color: '#8b5cf6', emoji: '❓' },
    { label: 'Engagement Responses',value: totalEngagement,     color: '#10b981', emoji: '⚡' },
    { label: 'Top Doubt Votes',     value: doubts.length ? Math.max(...doubts.map(d=>d.votes)) : 0, color: '#f43f5e', emoji: '🔥' },
    { label: 'Good Pace %',         value: totalEngagement ? `${Math.round((engagement.good/totalEngagement)*100)}%` : '—', color: '#10b981', emoji: '👍' },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <TopBar title="Analytics Dashboard" />

      <main className="flex-1 p-6 flex flex-col gap-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaryStats.map(({ label, value, color, emoji }, i) => (
            <div
              key={label}
              className="card p-4 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Row 1: Rating area + Engagement stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard
            title="📈 Ratings Over Time"
            subtitle="Individual ratings and running average"
            delay={0}
          >
            {ratingData.length < 2 ? (
              <EmptyChart message="Need at least 2 feedbacks to show trend" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={ratingData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltipStyle />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="rating" stroke="#6366f1" strokeWidth={2} fill="url(#ratingGrad)" name="Rating" dot={{ r: 4, fill: '#6366f1' }} />
                  <Area type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} fill="url(#avgGrad)" name="Running Avg" dot={false} strokeDasharray="5 3" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="⚡ Engagement Trend"
            subtitle="Daily engagement response breakdown"
            delay={80}
          >
            {engagementData.length === 0 ? (
              <EmptyChart message="No engagement data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltipStyle />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                  <Bar dataKey="good" name="Good Pace" fill="#10b981" radius={[4,4,0,0]} stackId="a" />
                  <Bar dataKey="fast" name="Too Fast"  fill="#ef4444" radius={[4,4,0,0]} stackId="a" />
                  <Bar dataKey="slow" name="Too Slow"  fill="#f59e0b" radius={[4,4,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 2: Rating distribution + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard
            title="⭐ Rating Distribution"
            subtitle="How students rated lectures by star count"
            delay={160}
          >
            {feedbacks.length === 0 ? (
              <EmptyChart message="No feedback submitted yet" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ratingDist} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="star" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<CustomTooltipStyle />} />
                  <Bar dataKey="count" name="Count" radius={[0,6,6,0]}>
                    {ratingDist.map((entry, i) => (
                      <Cell key={i} fill={['#10b981','#6366f1','#f59e0b','#f97316','#ef4444'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="🍩 Engagement Share"
            subtitle="Overall breakdown of all engagement responses"
            delay={240}
          >
            {pieData.length === 0 ? (
              <EmptyChart message="No engagement data yet" />
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipStyle />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 flex-1">
                  {pieData.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                      <div className="flex-1">
                        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {value} ({totalEngagement > 0 ? Math.round((value/totalEngagement)*100) : 0}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
