import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AppLayout from './components/layout/AppLayout';
import PageTransition from './components/layout/PageTransition';
import AuthTimeoutScreen from './components/AuthTimeoutScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { Suspense, lazy, useState, useEffect } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Learn = lazy(() => import('./pages/Learn'));
const News = lazy(() => import('./pages/News'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const CommunityFeed = lazy(() => import('./pages/CommunityFeed'));
const Profile = lazy(() => import('./pages/Profile'));
const Journal = lazy(() => import('./pages/Journal'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-48">
    <div className="w-7 h-7 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, checkAppState, forceUnauthenticated } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  // Show timeout screen if loading takes too long (WebView / slow network)
  useEffect(() => {
    if (isLoadingAuth || isLoadingPublicSettings) {
      const timer = setTimeout(() => setShowTimeout(true), 15000);
      return () => clearTimeout(timer);
    }
    setShowTimeout(false);
  }, [isLoadingAuth, isLoadingPublicSettings]);

  // Redirect to login if auth is required — side effect, not during render
  useEffect(() => {
    if (authError?.type === 'auth_required') {
      navigateToLogin();
    }
  }, [authError, navigateToLogin]);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    if (showTimeout) {
      return <AuthTimeoutScreen onRetry={() => checkAppState()} onContinue={forceUnauthenticated} />;
    }
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // auth_required is handled by useEffect above; show spinner while redirecting
    if (authError.type === 'auth_required') {
      return (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      );
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Login /></Suspense></ErrorBoundary>} />
      <Route path="/register" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Register /></Suspense></ErrorBoundary>} />
      <Route path="/forgot-password" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense></ErrorBoundary>} />
      <Route path="/reset-password" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><ResetPassword /></Suspense></ErrorBoundary>} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><PageTransition><Home /></PageTransition></Suspense>} />
        <Route path="/learn" element={<Suspense fallback={<PageLoader />}><PageTransition><Learn /></PageTransition></Suspense>} />
        <Route path="/alerts" element={<Suspense fallback={<PageLoader />}><PageTransition><News /></PageTransition></Suspense>} />
        <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><PageTransition><Dashboard /></PageTransition></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><PageTransition><Admin /></PageTransition></Suspense>} />
        <Route path="/community" element={<Suspense fallback={<PageLoader />}><PageTransition><CommunityFeed /></PageTransition></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><PageTransition><Profile /></PageTransition></Suspense>} />
        <Route path="/journal" element={<Suspense fallback={<PageLoader />}><PageTransition><Journal /></PageTransition></Suspense>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App