import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Pagos = () => {
  const { usuario } = useContext(AuthContext);
  const [pagos, setPagos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [formData, setFormData] = useState({ materia_id: '', porcentaje: '50' });
  const [formDataAdmin, setFormDataAdmin] = useState({ docente_id: '', monto: '', descripcion: '', categoria: '' });
  const [error, setError] = useState('');
  const [totalPagado, setTotalPagado] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (formData.materia_id && usuario?.rol === 'estudiante') {
      cargarTotalPagado(formData.materia_id);
    } else {
      setTotalPagado(0);
    }
  }, [formData.materia_id]);

  const cargarDatos = async () => {
    try {
      if (usuario?.rol === 'admin') {
        const response = await api.get('/pagos');
        setPagos(response.data);
      } else if (usuario?.rol === 'docente') {
        const response = await api.get('/pagos/docente/mis-pagos');
        setPagos(response.data);
      } else {
        const response = await api.get('/pagos/mis-pagos');
        setPagos(response.data);
      }

      if (usuario?.rol === 'estudiante') {
        const materiasResponse = await api.get('/materias/estudiante/mis-materias');
        setMaterias(materiasResponse.data);
      }

      if (usuario?.rol === 'admin') {
        const docentesResponse = await api.get('/usuarios/rol/docente');
        setDocentes(docentesResponse.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarTotalPagado = async (materia_id) => {
    try {
      const response = await api.get(`/pagos/total-pagado/${materia_id}`);
      setTotalPagado(response.data.totalPagado);
    } catch (error) {
      console.error('Error al cargar total pagado:', error);
      setTotalPagado(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/pagos', formData);
      setShowModal(false);
      setFormData({ materia_id: '', porcentaje: '50' });
      cargarDatos();
      alert('Pago realizado exitosamente');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al realizar el pago');
    }
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/pagos/administrativo', formDataAdmin);
      setShowModalAdmin(false);
      setFormDataAdmin({ docente_id: '', monto: '', descripcion: '', categoria: '' });
      cargarDatos();
      alert('Pago administrativo registrado exitosamente');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar el pago');
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
            <h1 className="h3 mb-0">
              {usuario?.rol === 'admin' ? 'Todos los Pagos' : usuario?.rol === 'docente' ? 'Pagos de Mis Materias' : 'Mis Pagos'}
            </h1>
            <div>
              {usuario?.rol === 'admin' && (
                <button className="btn btn-success me-2" onClick={() => setShowModalAdmin(true)}>
                  Registrar Pago Administrativo
                </button>
              )}
              {usuario?.rol === 'estudiante' && (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  Realizar Pago
                </button>
              )}
            </div>
          </div>
          <div className="card-body">
            {showModalAdmin && usuario?.rol === 'admin' && (
              <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Registrar Pago Administrativo</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModalAdmin(false)}
                      ></button>
                    </div>
                    <form onSubmit={handleSubmitAdmin}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="categoria" className="form-label">Categoría:</label>
                          <select
                            className="form-select"
                            id="categoria"
                            value={formDataAdmin.categoria}
                            onChange={(e) => setFormDataAdmin({ ...formDataAdmin, categoria: e.target.value, docente_id: e.target.value !== 'Sueldo' ? '' : formDataAdmin.docente_id })}
                            required
                          >
                            <option value="">Seleccione una categoría</option>
                            <option value="Sueldo">Sueldo</option>
                            <option value="Servicios">Servicios (Luz, Agua, Internet)</option>
                            <option value="Infraestructura">Infraestructura</option>
                            <option value="Pagos Extra">Pagos Extra</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>
                        {formDataAdmin.categoria === 'Sueldo' && (
                          <div className="mb-3">
                            <label htmlFor="docente_id" className="form-label">Docente:</label>
                            <select
                              className="form-select"
                              id="docente_id"
                              value={formDataAdmin.docente_id}
                              onChange={(e) => setFormDataAdmin({ ...formDataAdmin, docente_id: e.target.value })}
                              required
                            >
                              <option value="">Seleccione un docente</option>
                              {docentes.map((docente) => (
                                <option key={docente.id} value={docente.id}>
                                  {docente.nombre} ({docente.email})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="mb-3">
                          <label htmlFor="monto" className="form-label">Monto:</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="form-control"
                            id="monto"
                            value={formDataAdmin.monto}
                            onChange={(e) => setFormDataAdmin({ ...formDataAdmin, monto: e.target.value })}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="descripcion" className="form-label">Descripción:</label>
                          <textarea
                            className="form-control"
                            id="descripcion"
                            rows="3"
                            value={formDataAdmin.descripcion}
                            onChange={(e) => setFormDataAdmin({ ...formDataAdmin, descripcion: e.target.value })}
                            placeholder="Descripción del pago..."
                            required
                          ></textarea>
                        </div>
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModalAdmin(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-success">
                          Registrar Pago
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {showModal && usuario?.rol === 'estudiante' && (
              <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Realizar Pago</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="materia_id" className="form-label">Materia:</label>
                          <select
                            className="form-select"
                            id="materia_id"
                            value={formData.materia_id}
                            onChange={(e) => setFormData({ ...formData, materia_id: e.target.value, porcentaje: '50' })}
                            required
                          >
                            <option value="">Seleccione una materia</option>
                            {materias.map((materia) => (
                              <option key={materia.id} value={materia.id}>
                                {materia.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.materia_id && totalPagado > 0 && (
                          <div className="mb-3">
                            <div className="alert alert-info">
                              Ya has pagado: <strong>{totalPagado}%</strong> de esta materia
                            </div>
                          </div>
                        )}
                        <div className="mb-3">
                          <label htmlFor="porcentaje" className="form-label">Porcentaje:</label>
                          <select
                            className="form-select"
                            id="porcentaje"
                            value={formData.porcentaje}
                            onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                            required
                            disabled={totalPagado >= 100}
                          >
                            {totalPagado === 0 && (
                              <>
                                <option value="50">50%</option>
                                <option value="100">100%</option>
                              </>
                            )}
                            {totalPagado === 50 && (
                              <option value="50">50% (completar pago)</option>
                            )}
                            {totalPagado >= 100 && (
                              <option value="">Ya pagado al 100%</option>
                            )}
                          </select>
                          {totalPagado >= 100 && (
                            <small className="form-text text-muted">
                              Ya has completado el pago del 100% de esta materia.
                            </small>
                          )}
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
                          Pagar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {pagos.length === 0 ? (
              <p className="text-muted">No hay pagos registrados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      {usuario?.rol === 'admin' && <th>Estudiante/Docente</th>}
                      {usuario?.rol === 'admin' && <th>Email</th>}
                      {usuario?.rol === 'docente' && <th>Estudiante</th>}
                      {usuario?.rol === 'docente' && <th>Email</th>}
                      <th>Materia/Categoría</th>
                      <th>Monto</th>
                      {usuario?.rol !== 'admin' && <th>Porcentaje</th>}
                      {usuario?.rol === 'admin' && <th>Descripción</th>}
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>
                          <span className={`badge ${pago.tipo_pago === 'administrativo' ? 'bg-warning' : 'bg-primary'}`}>
                            {pago.tipo_pago === 'administrativo' ? 'Administrativo' : 'Estudiante'}
                          </span>
                        </td>
                        {usuario?.rol === 'admin' && (
                          <>
                            <td>{pago.estudiante_nombre || pago.docente_nombre || '-'}</td>
                            <td>{pago.estudiante_email || '-'}</td>
                          </>
                        )}
                        {usuario?.rol === 'docente' && (
                          <>
                            <td>{pago.estudiante_nombre}</td>
                            <td>{pago.estudiante_email}</td>
                          </>
                        )}
                        <td>
                          {pago.tipo_pago === 'administrativo' ? (
                            <span className="badge bg-info">{pago.categoria}</span>
                          ) : (
                            pago.materia_nombre || '-'
                          )}
                        </td>
                        <td>${Number(pago.monto).toFixed(2)}</td>
                        {usuario?.rol !== 'admin' && (
                          <td>
                            {pago.porcentaje ? (
                              <span className="badge bg-success">{pago.porcentaje}%</span>
                            ) : (
                              '-'
                            )}
                          </td>
                        )}
                        {usuario?.rol === 'admin' && (
                          <td>{pago.descripcion || '-'}</td>
                        )}
                        <td>{new Date(pago.fecha_pago).toLocaleString()}</td>
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

export default Pagos;

