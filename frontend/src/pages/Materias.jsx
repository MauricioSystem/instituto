import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Materias = () => {
  const { usuario } = useContext(AuthContext);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', horario: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await api.get('/materias');
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/materias', formData);
      setShowModal(false);
      setFormData({ nombre: '', horario: '' });
      cargarMaterias();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear materia');
    }
  };

  const handleMatricular = async (materiaId) => {
    try {
      await api.post('/materias/matricular', { materia_id: materiaId });
      alert('Te has matriculado exitosamente');
      cargarMaterias();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al matricularse');
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">Materias</h1>
            {usuario?.rol === 'docente' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Crear Materia
              </button>
            )}
          </div>
          <div className="card-body">
            {showModal && usuario?.rol === 'docente' && (
              <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Crear Materia</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="nombre" className="form-label">Nombre:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="horario" className="form-label">Horario:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="horario"
                            value={formData.horario}
                            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            placeholder="Ej: Lunes y Miércoles 10:00-12:00"
                            required
                          />
                        </div>
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Crear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Horario</th>
                    <th>Docente</th>
                    <th>Estudiantes</th>
                    {usuario?.rol === 'estudiante' && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {materias.length === 0 ? (
                    <tr>
                      <td colSpan={usuario?.rol === 'estudiante' ? 6 : 5} className="text-center">
                        No hay materias disponibles
                      </td>
                    </tr>
                  ) : (
                    materias.map((materia) => (
                      <tr key={materia.id}>
                        <td>{materia.id}</td>
                        <td>{materia.nombre}</td>
                        <td>{materia.horario}</td>
                        <td>{materia.docente_nombre || 'N/A'}</td>
                        <td>
                          <span className="badge bg-info">{materia.cantidad_estudiantes || 0}</span>
                        </td>
                        {usuario?.rol === 'estudiante' && (
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleMatricular(materia.id)}
                            >
                              Matricularse
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materias;

