import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FeedbackPage  from './pages/FeedbackPage';
import DoubtsPage    from './pages/DoubtsPage';
import EngagementPage from './pages/EngagementPage';
import AnalyticsPage  from './pages/AnalyticsPage';
import Sidebar from './components/Sidebar';

const PAGE_MAP = {
  dashboard:  <DashboardPage />,
  feedback:   <FeedbackPage />,
  doubts:     <DoubtsPage />,
  engagement: <EngagementPage />,
  analytics:  <AnalyticsPage />,
};

function AppShell() {
  const { user, page, darkMode } = useApp();

  if (!user) return <LoginPage />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {PAGE_MAP[page] || <DashboardPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'custom-toast',
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: 'white' } },
        }}
      />
    </AppProvider>
  );
}
