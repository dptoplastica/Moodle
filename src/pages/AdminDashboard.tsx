import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Users, ClipboardList, BarChart3, Settings, LogOut, Plus, Trash2, Edit, Eye, FileText } from 'lucide-react';
import SituacionForm from '../components/SituacionForm';
import CalificacionesPanel from '../components/CalificacionesPanel';
import InformesPanel from '../components/InformesPanel';
import ConfigPanel from '../components/ConfigPanel';
import { getCalificacionLOMLOE } from '../types';

type Tab = 'dashboard' | 'situaciones' | 'calificaciones' | 'informes' | 'config';

export default function AdminDashboard() {
  const { state, logout, deleteSituacion } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingSituacion, setEditingSituacion] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const students = state.users.filter(u => u.role === 'student');
  const totalActividades = state.situaciones.reduce((acc, s) => acc + s.actividades.length, 0);
  const totalCalificaciones = state.calificaciones.length;

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Panel', icon: BarChart3 },
    { id: 'situaciones' as Tab, label: 'Situaciones de Aprendizaje', icon: BookOpen },
    { id: 'calificaciones' as Tab, label: 'Cuaderno', icon: ClipboardList },
    { id: 'informes' as Tab, label: 'Informes', icon: FileText },
    { id: 'config' as Tab, label: 'Configuración', icon: Settings },
  ];

  const renderContent = () => {
    if (showForm || editingSituacion) {
      return (
        <SituacionForm
          situacion={editingSituacion ? state.situaciones.find(s => s.id === editingSituacion) : undefined}
          onClose={() => { setShowForm(false); setEditingSituacion(null); }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <Users className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-3xl font-bold">{students.length}</p>
                <p className="text-blue-100">Alumnos inscritos</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <BookOpen className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-3xl font-bold">{state.situaciones.length}</p>
                <p className="text-green-100">Situaciones de Aprendizaje</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <ClipboardList className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-3xl font-bold">{totalActividades}</p>
                <p className="text-purple-100">Actividades creadas</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <BarChart3 className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-3xl font-bold">{totalCalificaciones}</p>
                <p className="text-orange-100">Calificaciones registradas</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de la asignatura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Asignatura</p>
                  <p className="text-lg font-semibold text-gray-800">{state.subjectName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Curso</p>
                  <p className="text-lg font-semibold text-gray-800">{state.courseName}</p>
                </div>
              </div>
            </div>

            {students.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Alumnos inscritos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Nombre</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Usuario</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">{s.fullName}</td>
                          <td className="py-2 px-3 text-sm text-gray-500">{s.username}</td>
                          <td className="py-2 px-3 text-sm text-gray-500">{s.email || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'situaciones':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Situaciones de Aprendizaje</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Situación
              </button>
            </div>

            {state.situaciones.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay situaciones de aprendizaje creadas</p>
                <p className="text-sm text-gray-400 mt-2">Crea tu primera situación de aprendizaje para comenzar</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {state.situaciones.sort((a, b) => a.order - b.order).map((sit, index) => (
                  <div key={sit.id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded">
                            SA {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">{sit.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{sit.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {sit.contenidos.length} contenidos
                          </span>
                          <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                            {sit.actividades.length} actividades
                          </span>
                          <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                            {sit.criteriosEvaluacion.length} criterios
                          </span>
                          <span className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded">
                            {sit.competenciasClave.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSituacion(sit.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm('¿Eliminar esta situación de aprendizaje?')) deleteSituacion(sit.id); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'calificaciones':
        return <CalificacionesPanel />;

      case 'informes':
        return <InformesPanel />;

      case 'config':
        return <ConfigPanel />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">EduLOMLOE</h1>
              <p className="text-xs text-gray-500">Profesor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); setEditingSituacion(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id && !showForm && !editingSituacion
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 text-sm font-medium">P</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Profesor</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

function GraduationCap(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
