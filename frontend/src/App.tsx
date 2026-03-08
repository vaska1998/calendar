import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarPage from './pages/calendar/CalendarPage';
import ProfilePage from './pages/profile/ProfilePage.tsx';
import { getCookie } from './utils/cookie.ts';
import { type AuthCredentialsWithClaims, parseTokenCredentials } from './utils/token.ts';
import { AppUserProvider } from './providers/AppUserProvider.tsx';
import { useAppUser } from './contexts/user.context.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import Login from './pages/auth/Login.tsx';
import React from 'react';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthorized } = useAppUser();
  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const cookieJson = getCookie('calendar_credentials');
  const user: AuthCredentialsWithClaims | null = parseTokenCredentials(cookieJson);

  return (
    <AppUserProvider user={user}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/calendar" replace /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CalendarPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AppUserProvider>
  );
}

export default App;
