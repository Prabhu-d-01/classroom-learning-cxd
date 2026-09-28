import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { SendHorizonal, Trash2 } from 'lucide-react';

function FeedbackCard({ fb, onDelete }) {
  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            {fb.lecture || 'Lecture Feedback'}
          </p>
          <StarRating value={fb.rating} readonly />
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-info">{fb.rating}/5 ★</span>
          <button
            onClick={() => onDelete(fb.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fb.comment && (
        <p className="text-sm rounded-xl p-3 mb-3" style={{
          color: 'var(--text-secondary)',
          background: 'var(--bg-primary)',
          borderLeft: '3px solid #6366f1',
        }}>
          "{fb.comment}"
        </p>
      )}
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {new Date(fb.date).toLocaleString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </p>
    </div>
  );
}

export default function FeedbackPage() {
  const { feedbacks, addFeedback, avgRating, deleteFeedback } = useApp();

  const [lecture, setLecture] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    addFeedback({ lecture: lecture.trim() || 'Today\'s Lecture', rating, comment: comment.trim() });
    toast.success('Feedback submitted! Thanks 🙌');
    setLecture(''); setRating(0); setComment('');
  };

  const handleDelete = (id) => {
    deleteFeedback(id);
    toast.success('Feedback removed');
  };

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: feedbacks.filter(f => f.rating === star).length,
    pct: feedbacks.length ? Math.round((feedbacks.filter(f => f.rating === star).length / feedbacks.length) * 100) : 0,
  }));

  const starColors = { 5: '#10b981', 4: '#6366f1', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <TopBar title="Lecture Feedback" />

      <main className="flex-1 p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 animate-fade-in-up">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Rate Today's Lecture
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Your feedback helps instructors improve their teaching quality.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Lecture / Topic Name <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Data Structures – Binary Trees"
                    value={lecture}
                    onChange={e => setLecture(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Comments <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    className="input-field"
                    style={{ resize: 'vertical', minHeight: 100 }}
                    placeholder="What did you like or what could be improved?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary flex items-center gap-2 self-start">
                  <SendHorizonal size={16} />
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Average rating card */}
            <div className="card p-5 animate-fade-in-up text-center" style={{ animationDelay: '80ms' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Average Rating</p>
              <div className="text-5xl font-extrabold gradient-text mb-2">{avgRating}</div>
              <StarRating value={Math.round(Number(avgRating) || 0)} readonly />
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                Based on {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Distribution */}
            <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
              <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Rating Distribution</h3>
              {distribution.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold w-8 text-right" style={{ color: starColors[star] }}>{star}★</span>
                  <div className="progress-bar flex-1">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: starColors[star] }} />
                  </div>
                  <span className="text-xs font-semibold w-6" style={{ color: 'var(--text-secondary)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback list */}
        {feedbacks.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              Previous Feedback ({feedbacks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {feedbacks.map(fb => (
                <FeedbackCard key={fb.id} fb={fb} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {feedbacks.length === 0 && (
          <div className="card p-12 flex flex-col items-center gap-3 animate-fade-in">
            <span className="text-5xl">📝</span>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No Feedback Yet</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Be the first to rate a lecture!</p>
          </div>
        )}
      </main>
    </div>
  );
}
