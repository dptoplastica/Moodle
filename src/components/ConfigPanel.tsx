import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Settings } from 'lucide-react';

export default function ConfigPanel() {
  const { state, updateSubjectInfo } = useApp();
  const [subjectName, setSubjectName] = useState(state.subjectName);
  const [courseName, setCourseName] = useState(state.courseName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSubjectInfo(subjectName, courseName);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('eduLOMLOE_state');
      localStorage.removeItem('eduLOMLOE_currentUser');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Datos de la asignatura</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la asignatura</label>
            <input
              type="text"
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Biología y Geología"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
            <select
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1º Bachillerato">1º Bachillerato</option>
              <option value="2º Bachillerato">2º Bachillerato</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
          <select className="w-full px-4 py-2 border rounded-lg">
            <option>General</option>
            <option>Ciencias y Tecnología</option>
            <option>Humanidades y Ciencias Sociales</option>
            <option>Artes</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar cambios
        </button>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            ✓ Configuración guardada correctamente
          </div>
        )}
      </div>

      {/* Información LOMLOE */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Marco LOMLOE</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Ley Orgánica 3/2020 (LOMLOE)</strong> - Modificación de la LOE.
            Esta plataforma sigue los principios de la legislación educativa vigente para Bachillerato.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Situaciones de Aprendizaje</h4>
              <p className="text-blue-700 text-xs">
                Contextualizaciones que permiten al estudiante construir su aprendizaje a través de la indagación, 
                el razonamiento, el diálogo y la colaboración, produciendo un resultado que dé respuesta a un propósito definido.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Competencias Clave</h4>
              <p className="text-green-700 text-xs">
                8 competencias: CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC. 
                Desempeños que se consideran imprescindibles para que el alumnado progrese con garantía de éxito.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Criterios de Evaluación</h4>
              <p className="text-purple-700 text-xs">
                Referentes para valorar el grado de adquisición de las competencias específicas. 
                Vinculados directamente con los saberes y las competencias clave.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Calificación</h4>
              <p className="text-orange-700 text-xs">
                Escala numérica de 1 a 10 sin decimales: 
                Insuficiente (1-4), Suficiente (5), Bien (6), Notable (7-8), Sobresaliente (9-10).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-700 mb-4">Zona de peligro</h3>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción eliminará todos los datos de la plataforma incluyendo alumnos, calificaciones y situaciones de aprendizaje.
        </p>
        <button
          onClick={handleResetData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          Borrar todos los datos
        </button>
      </div>
    </div>
  );
}
