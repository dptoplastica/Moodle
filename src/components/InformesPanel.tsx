import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPETENCIAS_CLAVE, NIVELES_ADQUISICION, InformeCompetencia } from '../types';
import { Save, FileText, Download } from 'lucide-react';

export default function InformesPanel() {
  const { state, addInforme, updateInforme } = useApp();
  const students = state.users.filter(u => u.role === 'student');
  const [selectedStudent, setSelectedStudent] = useState<string>(students[0]?.id || '');
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<number>(1);
  const [informes, setInformes] = useState<Record<string, { nivel: number; observaciones: string }>>(() => {
    const initial: Record<string, { nivel: number; observaciones: string }> = {};
    COMPETENCIAS_CLAVE.forEach(cc => {
      const existing = state.informes.find(
        i => i.studentId === selectedStudent && i.competenciaClave === cc.code && i.evaluacion === selectedEvaluacion
      );
      initial[cc.code] = {
        nivel: existing?.nivel || 0,
        observaciones: existing?.observaciones || '',
      };
    });
    return initial;
  });

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
    const newInformes: Record<string, { nivel: number; observaciones: string }> = {};
    COMPETENCIAS_CLAVE.forEach(cc => {
      const existing = state.informes.find(
        i => i.studentId === studentId && i.competenciaClave === cc.code && i.evaluacion === selectedEvaluacion
      );
      newInformes[cc.code] = {
        nivel: existing?.nivel || 0,
        observaciones: existing?.observaciones || '',
      };
    });
    setInformes(newInformes);
  };

  const handleEvaluacionChange = (eval_: number) => {
    setSelectedEvaluacion(eval_);
    const newInformes: Record<string, { nivel: number; observaciones: string }> = {};
    COMPETENCIAS_CLAVE.forEach(cc => {
      const existing = state.informes.find(
        i => i.studentId === selectedStudent && i.competenciaClave === cc.code && i.evaluacion === eval_
      );
      newInformes[cc.code] = {
        nivel: existing?.nivel || 0,
        observaciones: existing?.observaciones || '',
      };
    });
    setInformes(newInformes);
  };

  const handleSave = () => {
    COMPETENCIAS_CLAVE.forEach(cc => {
      const informe: InformeCompetencia = {
        studentId: selectedStudent,
        competenciaClave: cc.code,
        nivel: informes[cc.code].nivel,
        evaluacion: selectedEvaluacion as 1 | 2 | 3 | 'final',
        observaciones: informes[cc.code].observaciones,
      };
      
      const existing = state.informes.find(
        i => i.studentId === selectedStudent && i.competenciaClave === cc.code && i.evaluacion === selectedEvaluacion
      );
      
      if (existing) {
        updateInforme(informe);
      } else {
        addInforme(informe);
      }
    });
    alert('Informe guardado correctamente');
  };

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-red-100 text-red-700 border-red-200';
      case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 3: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 4: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Informes de Competencias</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
            <select
              value={selectedStudent}
              onChange={e => handleStudentChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={selectedEvaluacion}
              onChange={e => handleEvaluacionChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={1}>1ª Evaluación</option>
              <option value={2}>2ª Evaluación</option>
              <option value={3}>3ª Evaluación</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Informe
            </button>
          </div>
        </div>
      </div>

      {/* Competencias Grid */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Grado de adquisición de competencias clave - LOMLOE
        </h3>
        <div className="grid gap-4">
          {COMPETENCIAS_CLAVE.map(cc => (
            <div key={cc.code} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                      {cc.code}
                    </span>
                    <h4 className="font-medium text-gray-800">{cc.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{cc.description}</p>
                </div>
              </div>

              {/* Nivel selector */}
              <div className="flex gap-2 mb-3">
                {NIVELES_ADQUISICION.map(n => (
                  <button
                    key={n.level}
                    onClick={() => setInformes(prev => ({
                      ...prev,
                      [cc.code]: { ...prev[cc.code], nivel: n.level }
                    }))}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      informes[cc.code].nivel === n.level
                        ? getNivelColor(n.level) + ' border-2'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold">{n.letter}</div>
                    <div className="text-xs">{n.name}</div>
                  </button>
                ))}
              </div>

              {/* Observaciones */}
              <textarea
                value={informes[cc.code].observaciones}
                onChange={e => setInformes(prev => ({
                  ...prev,
                  [cc.code]: { ...prev[cc.code], observaciones: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={2}
                placeholder="Observaciones sobre el grado de adquisición..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Leyenda - Niveles de adquisición LOMLOE</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NIVELES_ADQUISICION.map(n => (
            <div key={n.level} className={`p-3 rounded-lg border ${getNivelColor(n.level)}`}>
              <div className="font-bold text-lg">{n.letter}</div>
              <div className="text-sm font-medium">{n.name}</div>
              <div className="text-xs mt-1">{n.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
