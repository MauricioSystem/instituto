import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Materias from './pages/Materias';
import MisMaterias from './pages/MisMaterias';
import Pagos from './pages/Pagos';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute requiredRole="admin">
                  <Usuarios />
                </PrivateRoute>
              }
            />
            <Route
              path="/materias"
              element={
                <PrivateRoute>
                  <Materias />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-materias"
              element={
                <PrivateRoute requiredRole="estudiante">
                  <MisMaterias />
                </PrivateRoute>
              }
            />
            <Route
              path="/pagos"
              element={
                <PrivateRoute>
                  <Pagos />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

