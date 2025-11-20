import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { usuario } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="card-title">Bienvenido, {usuario?.nombre}</h1>
            <p className="card-text">
              <strong>Rol:</strong> {usuario?.rol}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {usuario?.email}
            </p>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h2 className="card-title">Funcionalidades disponibles</h2>
            {usuario?.rol === 'admin' && (
              <div>
                <h3 className="h5 mt-3">Como Administrador puedes:</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Gestionar usuarios (crear docentes y estudiantes)</li>
                  <li className="list-group-item">Ver todas las materias</li>
                  <li className="list-group-item">Ver todos los pagos realizados</li>
                </ul>
              </div>
            )}

            {usuario?.rol === 'docente' && (
              <div>
                <h3 className="h5 mt-3">Como Docente puedes:</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Crear materias</li>
                  <li className="list-group-item">Ver tus materias y la cantidad de estudiantes</li>
                </ul>
              </div>
            )}

            {usuario?.rol === 'estudiante' && (
              <div>
                <h3 className="h5 mt-3">Como Estudiante puedes:</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Ver todas las materias disponibles</li>
                  <li className="list-group-item">Matricularte en materias</li>
                  <li className="list-group-item">Realizar pagos (50% o 100%)</li>
                  <li className="list-group-item">Ver tus materias y pagos</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
