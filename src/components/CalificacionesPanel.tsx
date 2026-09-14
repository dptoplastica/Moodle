import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calificacion, getCalificacionLOMLOE, getCalificacionLetter } from '../types';
import { Save, Trash2, Plus } from 'lucide-react';

export default function CalificacionesPanel() {
  const { state, addCalificacion, updateCalificacion, deleteCalificacion } = useApp();
  const students = state.users.filter(u => u.role === 'student');
  const [selectedStudent, setSelectedStudent] = useState<string>(students[0]?.id || '');
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<1 | 2 | 3>(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formSituacion, setFormSituacion] = useState('');
  const [formActividad, setFormActividad] = useState('');
  const [formScore, setFormScore] = useState(0);
  const [formMaxScore, setFormMaxScore] = useState(10);
  const [formObservaciones, setFormObservaciones] = useState('');

  const studentCalificaciones = state.calificaciones.filter(
    c => c.studentId === selectedStudent && c.evaluacion === selectedEvaluacion
  );

  const getStudentAverage = (studentId: string, evaluacion: number) => {
    const cals = state.calificaciones.filter(c => c.studentId === studentId && c.evaluacion === evaluacion);
    if (cals.length === 0) return null;
    const total = cals.reduce((acc, c) => acc + (c.score / c.maxScore) * 10, 0);
    return Math.round((total / cals.length) * 100) / 100;
  };

  const getStudentFinalAverage = (studentId: string) => {
    const ev1 = getStudentAverage(studentId, 1) || 0;
    const ev2 = getStudentAverage(studentId, 2) || 0;
    const ev3 = getStudentAverage(studentId, 3) || 0;
    const count = [ev1, ev2, ev3].filter(v => v > 0).length;
    if (count === 0) return null;
    return Math.round(((ev1 + ev2 + ev3) / count) * 100) / 100;
  };

  const handleAddCalificacion = () => {
    const actividad = state.situaciones
      .flatMap(s => s.actividades)
      .find(a => a.id === formActividad);

    const cal: Calificacion = {
      id: `cal_${Date.now()}`,
      studentId: selectedStudent,
      actividadId: formActividad,
      situacionId: formSituacion,
      score: formScore,
      maxScore: formMaxScore || actividad?.maxScore || 10,
      evaluacion: selectedEvaluacion,
      fecha: new Date().toISOString().split('T')[0],
      observaciones: formObservaciones,
    };

    if (editingId) {
      updateCalificacion({ ...cal, id: editingId });
      setEditingId(null);
    } else {
      addCalificacion(cal);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowAddForm(false);
    setFormSituacion('');
    setFormActividad('');
    setFormScore(0);
    setFormMaxScore(10);
    setFormObservaciones('');
  };

  const startEdit = (cal: Calificacion) => {
    setEditingId(cal.id);
    setFormSituacion(cal.situacionId);
    setFormActividad(cal.actividadId);
    setFormScore(cal.score);
    setFormMaxScore(cal.maxScore);
    setFormObservaciones(cal.observaciones || '');
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cuaderno de Calificaciones</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
            <select
              value={selectedEvaluacion}
              onChange={e => setSelectedEvaluacion(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={1}>1ª Evaluación</option>
              <option value={2}>2ª Evaluación</option>
              <option value={3}>3ª Evaluación</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Añadir Calificación
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Editar Calificación' : 'Nueva Calificación'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situación de Aprendizaje</label>
              <select
                value={formSituacion}
                onChange={e => { setFormSituacion(e.target.value); setFormActividad(''); }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Seleccionar</option>
                {state.situaciones.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
              <select
                value={formActividad}
                onChange={e => {
                  setFormActividad(e.target.value);
                  const act = state.situaciones.flatMap(s => s.actividades).find(a => a.id === e.target.value);
                  if (act) setFormMaxScore(act.maxScore);
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Seleccionar</option>
                {state.situaciones
                  .filter(s => s.id === formSituacion || !formSituacion)
                  .flatMap(s => s.actividades)
                  .map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota ({formScore}/{formMaxScore})</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formScore}
                  onChange={e => setFormScore(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                  min={0}
                  max={formMaxScore}
                  step={0.5}
                />
                <span className="flex items-center text-gray-500">/ {formMaxScore}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Equivale a: {((formScore / formMaxScore) * 10).toFixed(1)} → {getCalificacionLOMLOE((formScore / formMaxScore) * 10)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <input
                type="text"
                value={formObservaciones}
                onChange={e => setFormObservaciones(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Observaciones sobre la calificación"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddCalificacion} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      )}

      {/* Calificaciones Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Calificaciones - {selectedEvaluacion}ª Evaluación
          </h3>
        </div>
        {studentCalificaciones.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay calificaciones registradas para esta evaluación
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actividad</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Situación</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Nota</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Equivale</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Observaciones</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {studentCalificaciones.map(cal => {
                  const situacion = state.situaciones.find(s => s.id === cal.situacionId);
                  const actividad = situacion?.actividades.find(a => a.id === cal.actividadId);
                  const equivale = (cal.score / cal.maxScore) * 10;
                  return (
                    <tr key={cal.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{actividad?.title || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{situacion?.title || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium">
                        {cal.score}/{cal.maxScore}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          equivale >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {equivale.toFixed(1)} - {getCalificacionLOMLOE(equivale)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{cal.observaciones || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => startEdit(cal)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => deleteCalificacion(cal.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen por evaluaciones */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de notas - Todos los alumnos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Alumno</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">1ª Eval.</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">2ª Eval.</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">3ª Eval.</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Final</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const ev1 = getStudentAverage(s.id, 1);
                const ev2 = getStudentAverage(s.id, 2);
                const ev3 = getStudentAverage(s.id, 3);
                const final = getStudentFinalAverage(s.id);
                return (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{s.fullName}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      {ev1 !== null ? (
                        <span className={`px-2 py-1 rounded ${ev1 >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {ev1.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {ev2 !== null ? (
                        <span className={`px-2 py-1 rounded ${ev2 >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {ev2.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {ev3 !== null ? (
                        <span className={`px-2 py-1 rounded ${ev3 >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {ev3.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {final !== null ? (
                        <span className={`px-2 py-1 rounded font-bold ${final >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {final.toFixed(1)} - {getCalificacionLOMLOE(final)}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
