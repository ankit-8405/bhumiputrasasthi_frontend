import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import BottomTabs from './components/BottomTabs';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mandi from './pages/Mandi';
import Chat from './pages/Chat';
import CommunityNew from './pages/CommunityNew';
import DoctorList from './pages/DoctorList';
import RogDetector from './pages/RogDetector';
import Profile from './pages/Profile';
import Training from './pages/Training';
import WeatherDetail from './pages/WeatherDetail';
import SoilTest from './pages/SoilTest';
import Consultation from './pages/Consultation';
import HelplineAdmin from './pages/HelplineAdmin';
import GovtSchemes from './pages/GovtSchemes';
import Irrigation from './pages/Irrigation';
import Machinery from './pages/Machinery';
import Storage from './pages/Storage';
import CropAdvisory from './pages/CropAdvisory';
import './App.css';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Main Layout Routes - Public */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/mandi" element={<Mandi />} />
                  <Route path="/training" element={<Training />} />
                  <Route path="/doctors" element={<DoctorList />} />
                  <Route path="/govt-schemes" element={<GovtSchemes />} />
                  <Route path="/irrigation" element={<Irrigation />} />
                  <Route path="/machinery" element={<Machinery />} />
                  <Route path="/storage" element={<Storage />} />
                  <Route path="/crop-advisory" element={<CropAdvisory />} />

                  {/* Protected Routes - Require Auth */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/community" element={<CommunityNew />} />
                    <Route path="/rog-detector" element={<RogDetector />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/soil-test" element={<SoilTest />} />
                    <Route path="/admin/helpline" element={<HelplineAdmin />} />
                  </Route>
                </Route>

                {/* Full Screen Routes (No Nav/Tabs) */}
                <Route path="/weather-detail" element={<WeatherDetail />} />
                <Route path="/consultation/:doctorId/:type" element={<Consultation />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomTabs />
    </>
  );
}

export default App;
