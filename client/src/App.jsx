// client/src/App.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { lifecareTheme } from './themes/index';
import { CatalogProvider } from './contexts/CatalogContext';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import PatientPortal from './patient/PatientPortal';
import PharmacistPortal from './pharmacist/PharmacistPortal';
import AdminPortal from './admin/AdminPortal';
import DeliveryPortal from './pages/DeliveryPortal';
import About from './pages/About';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import Support from './pages/Support';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={lifecareTheme}>
      <CssBaseline />
      <AuthProvider>
        <CatalogProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/patient" element={<PatientPortal />} />
                <Route path="/pharmacist" element={<PharmacistPortal />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/delivery" element={<DeliveryPortal />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </div>
          </Router>
        </CatalogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;