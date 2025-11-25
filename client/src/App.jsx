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
import PatientPortal from './pages/PatientPortal';
import PharmacistPortal from './pages/PharmacistPortal';
import AdminPortal from './pages/AdminPortal';
import DeliveryPortal from './pages/DeliveryPortal';
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
                <Route path="/patient" element={<PatientPortal />} />
                <Route path="/pharmacist" element={<PharmacistPortal />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/delivery" element={<DeliveryPortal />} />
              </Routes>
            </div>
          </Router>
        </CatalogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;