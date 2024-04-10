import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, CssBaseline } from '@mui/material';
import { AnnualRecordProvider } from './components/context/AnnualRecordContext';
import NotificationIcon from './components/NotificationIcon';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import AdminDashboard from './components/AdminDashboard';
import TrackingList from './components/TrackingList';
import Establishments from './components/Establishments';
import Inspection from './components/Inspection';
import RecordListPage from './components/RecordListPage';
import ReportsPage from './components/ReportsPage';
import Certificate from './components/Certificate';
// Ensure this is the correct import path for your theme
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import useAuthTokenCheck from './hooks/useAuthTokenCheck';
import { checkIsLoggedIn } from './utils/authUtils';

import logoImage from './mainlogo.png';

function App() {
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  useAuthTokenCheck(setShouldNavigate);

  useEffect(() => {
    // Redirect to /login only if shouldNavigate is true and the user is not on /signup
    if (shouldNavigate && window.location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [shouldNavigate, navigate]);

  const isLoggedIn = checkIsLoggedIn();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnnualRecordProvider>
        <Routes>
          {isLoggedIn ? (
            <Route path="*" element={
              <Box sx={{ display: 'flex', minHeight: '110vh' }}>
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                  <Toolbar>
                    <img src={logoImage} alt="logo" style={{ height: '64px' }} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                      Welcome Admin
                    </Typography>
                    <IconButton color="inherit">
                      <NotificationIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '240px', marginTop: '64px' }}>
                  <Routes>
                    <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/tracking-list" element={<ProtectedRoute><TrackingList /></ProtectedRoute>} />
                    <Route path="/establishments" element={<ProtectedRoute><Establishments /></ProtectedRoute>} />
                    <Route path="/inspection" element={<ProtectedRoute><Inspection /></ProtectedRoute>} />
                    <Route path="/fsic-positive-negative" element={<ProtectedRoute><RecordListPage /></ProtectedRoute>} />
                    <Route path="/fsic-positive" element={<ProtectedRoute><RecordListPage listType="Positive" /></ProtectedRoute>} />
                    <Route path="/fsic-negative" element={<ProtectedRoute><RecordListPage listType="Negative" /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                    <Route path="/certificates" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                    {/* Add other protected routes as needed */}
                    <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                  </Routes>
                </Box>
              </Box>
            }/>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </AnnualRecordProvider>
    </ThemeProvider>
  );
}

export default App;