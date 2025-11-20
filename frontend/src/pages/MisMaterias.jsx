import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const MisMaterias = () => {
  const { usuario } = useContext(AuthContext);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await api.get('/materias/estudiante/mis-materias');
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header">
            <h1 className="h3 mb-0">Mis Materias</h1>
          </div>
          <div className="card-body">
            {materias.length === 0 ? (
              <p className="text-muted">No estás matriculado en ninguna materia.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Horario</th>
                      <th>Docente</th>
                      <th>Fecha de Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((materia) => (
                      <tr key={materia.id}>
                        <td>{materia.id}</td>
                        <td>{materia.nombre}</td>
                        <td>{materia.horario}</td>
                        <td>{materia.docente_nombre || 'N/A'}</td>
                        <td>{new Date(materia.fecha_matricula).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisMaterias;

