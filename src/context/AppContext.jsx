import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'sces_user',
  FEEDBACKS: 'sces_feedbacks',
  DOUBTS: 'sces_doubts',
  ENGAGEMENT: 'sces_engagement',
  DARK_MODE: 'sces_dark_mode',
};

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load(STORAGE_KEYS.USER, null));
  const [feedbacks, setFeedbacks] = useState(() => load(STORAGE_KEYS.FEEDBACKS, []));
  const [doubts, setDoubts] = useState(() => load(STORAGE_KEYS.DOUBTS, []));
  const [engagement, setEngagement] = useState(() =>
    load(STORAGE_KEYS.ENGAGEMENT, { fast: 0, slow: 0, good: 0, history: [] })
  );
  const [darkMode, setDarkMode] = useState(() => load(STORAGE_KEYS.DARK_MODE, false));
  const [page, setPage] = useState('dashboard');

  // Persist
  useEffect(() => { save(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { save(STORAGE_KEYS.FEEDBACKS, feedbacks); }, [feedbacks]);
  useEffect(() => { save(STORAGE_KEYS.DOUBTS, doubts); }, [doubts]);
  useEffect(() => { save(STORAGE_KEYS.ENGAGEMENT, engagement); }, [engagement]);
  useEffect(() => { save(STORAGE_KEYS.DARK_MODE, darkMode); }, [darkMode]);

  // Dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const login = useCallback((name) => {
    setUser({ name, joinedAt: new Date().toISOString() });
    setPage('dashboard');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPage('dashboard');
  }, []);

  const addFeedback = useCallback((fb) => {
    setFeedbacks(prev => [{ ...fb, id: Date.now(), date: new Date().toISOString() }, ...prev]);
  }, []);

  const deleteFeedback = useCallback((id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  }, []);

  const addDoubt = useCallback((text) => {
    setDoubts(prev => [
      { id: Date.now(), text, votes: 0, date: new Date().toISOString() },
      ...prev
    ]);
  }, []);

  const upvoteDoubt = useCallback((id) => {
    setDoubts(prev =>
      prev.map(d => d.id === id ? { ...d, votes: d.votes + 1 } : d)
        .sort((a, b) => b.votes - a.votes)
    );
  }, []);

  const recordEngagement = useCallback((type) => {
    setEngagement(prev => {
      const updated = {
        ...prev,
        [type]: prev[type] + 1,
        history: [
          ...prev.history,
          { type, date: new Date().toISOString() }
        ].slice(-50),
      };
      return updated;
    });
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  const totalEngagement = engagement.fast + engagement.slow + engagement.good;

  const engagementLevel = totalEngagement === 0 ? 'No data' :
    engagement.good / totalEngagement > 0.5 ? 'High 🎯' :
    engagement.fast / totalEngagement > 0.4 ? 'Rushed 🚀' : 'Low 🐢';

  return (
    <AppContext.Provider value={{
      user, login, logout,
      feedbacks, addFeedback, deleteFeedback, setFeedbacks,
      doubts, addDoubt, upvoteDoubt,
      engagement, recordEngagement, totalEngagement,
      darkMode, setDarkMode,
      page, setPage,
      avgRating, engagementLevel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
