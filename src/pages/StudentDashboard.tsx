import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPETENCIAS_CLAVE, NIVELES_ADQUISICION, getCalificacionLOMLOE } from '../types';
import { BookOpen, LogOut, User, ClipboardList, BarChart3, ChevronRight, Play, FileText, ExternalLink, Image, Video, Music } from 'lucide-react';

type Tab = 'inicio' | 'contenido' | 'notas' | 'competencias';

export default function StudentDashboard() {
  const { state, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [selectedSituacion, setSelectedSituacion] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  if (!currentUser) return null;

  const studentCalificaciones = state.calificaciones.filter(c => c.studentId === currentUser.id);
  const studentInformes = state.informes.filter(i => i.studentId === currentUser.id);

  const getStudentAverage = (evaluacion: number) => {
    const cals = studentCalificaciones.filter(c => c.evaluacion === evaluacion);
    if (cals.length === 0) return null;
    const total = cals.reduce((acc, c) => acc + (c.score / c.maxScore) * 10, 0);
    return Math.round((total / cals.length) * 100) / 100;
  };

  const getFinalAverage = () => {
    const ev1 = getStudentAverage(1) || 0;
    const ev2 = getStudentAverage(2) || 0;
    const ev3 = getStudentAverage(3) || 0;
    const count = [ev1, ev2, ev3].filter(v => v > 0).length;
    if (count === 0) return null;
    return Math.round(((ev1 + ev2 + ev3) / count) * 100) / 100;
  };

  const tabs = [
    { id: 'inicio' as Tab, label: 'Inicio', icon: BookOpen },
    { id: 'contenido' as Tab, label: 'Contenidos', icon: FileText },
    { id: 'notas' as Tab, label: 'Mis Notas', icon: ClipboardList },
    { id: 'competencias' as Tab, label: 'Competencias', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">¡Hola, {currentUser.fullName}!</h2>
              <p className="text-indigo-100">{state.subjectName} - {state.courseName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <BookOpen className="w-8 h-8 text-indigo-500 mb-2" />
                <p className="text-3xl font-bold text-gray-800">{state.situaciones.length}</p>
                <p className="text-sm text-gray-500">Situaciones de Aprendizaje</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <ClipboardList className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-3xl font-bold text-gray-800">{studentCalificaciones.length}</p>
                <p className="text-sm text-gray-500">Actividades calificadas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-3xl font-bold text-gray-800">
                  {getFinalAverage() !== null ? getFinalAverage()?.toFixed(1) : '-'}
                </p>
                <p className="text-sm text-gray-500">Nota media</p>
              </div>
            </div>

            {/* Situaciones de aprendizaje */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Situaciones de Aprendizaje</h3>
              <div className="space-y-3">
                {state.situaciones.sort((a, b) => a.order - b.order).map((sit, index) => (
                  <button
                    key={sit.id}
                    onClick={() => { setActiveTab('contenido'); setSelectedSituacion(sit.id); }}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-800">{sit.title}</h4>
                        <p className="text-sm text-gray-500">{sit.actividades.length} actividades · {sit.contenidos.length} contenidos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
                {state.situaciones.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No hay contenidos disponibles todavía</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'contenido':
        if (selectedSituacion) {
          const sit = state.situaciones.find(s => s.id === selectedSituacion);
          if (!sit) return <p>Situación no encontrada</p>;

          return (
            <div className="space-y-6">
              <button
                onClick={() => { setSelectedSituacion(null); setSelectedContent(null); }}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
              >
                ← Volver a situaciones
              </button>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{sit.title}</h2>
                <p className="text-gray-600 mb-4">{sit.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                    Duración: {sit.duracion || 'N/A'}
                  </span>
                  {sit.competenciasClave.map(cc => (
                    <span key={cc} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                      {cc}
                    </span>
                  ))}
                </div>
                {sit.productoFinal && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      <strong>Producto final:</strong> {sit.productoFinal}
                    </p>
                  </div>
                )}
              </div>

              {/* Contenidos/Saberes */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contenidos / Saberes</h3>
                <div className="space-y-3">
                  {sit.contenidos.map((c, i) => (
                    <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                          {c.type === 'text' && <FileText className="w-4 h-4 text-gray-600" />}
                          {c.type === 'image' && <Image className="w-4 h-4 text-blue-600" />}
                          {c.type === 'video' && <Video className="w-4 h-4 text-red-600" />}
                          {c.type === 'audio' && <Music className="w-4 h-4 text-purple-600" />}
                          {c.type === 'link' && <ExternalLink className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{c.title}</h4>
                          {c.description && <p className="text-sm text-gray-500">{c.description}</p>}
                          {c.type === 'text' && c.content && (
                            <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded" dangerouslySetInnerHTML={{ __html: c.content }} />
                          )}
                          {c.url && (
                            <div className="mt-2">
                              {c.type === 'image' && (
                                <img src={c.url} alt={c.title} className="max-w-full rounded-lg border" />
                              )}
                              {c.type === 'video' && (
                                <div className="aspect-video rounded-lg overflow-hidden border">
                                  <iframe src={c.url} className="w-full h-full" allowFullScreen title={c.title} />
                                </div>
                              )}
                              {c.type === 'audio' && (
                                <audio controls src={c.url} className="w-full" />
                              )}
                              {c.type === 'link' && (
                                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> {c.url}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sit.contenidos.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No hay contenidos disponibles</p>
                  )}
                </div>
              </div>

              {/* Actividades */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividades</h3>
                <div className="space-y-3">
                  {sit.actividades.map((a, i) => {
                    const cal = studentCalificaciones.find(c => c.actividadId === a.id);
                    return (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{a.title}</h4>
                            <p className="text-sm text-gray-500">{a.description}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                {a.type === 'test' ? 'Test' : a.type === 'essay' ? 'Redacción' : a.type === 'project' ? 'Proyecto' : a.type === 'oral' ? 'Oral' : 'Práctica'}
                              </span>
                              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                Máx: {a.maxScore} pts
                              </span>
                            </div>
                          </div>
                          {cal && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-800">{cal.score}/{cal.maxScore}</p>
                              <p className="text-xs text-gray-500">{getCalificacionLOMLOE((cal.score / cal.maxScore) * 10)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {sit.actividades.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No hay actividades disponibles</p>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // Lista de situaciones
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Contenidos</h2>
            <div className="space-y-3">
              {state.situaciones.sort((a, b) => a.order - b.order).map((sit, index) => (
                <button
                  key={sit.id}
                  onClick={() => setSelectedSituacion(sit.id)}
                  className="w-full flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">{sit.title}</h4>
                      <p className="text-sm text-gray-500">{sit.contenidos.length} contenidos · {sit.actividades.length} actividades</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
              {state.situaciones.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay contenidos disponibles todavía</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'notas':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Calificaciones</h2>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3].map(ev => (
                <div key={ev} className="bg-white rounded-xl shadow-sm border p-4">
                  <p className="text-sm text-gray-500">{ev}ª Evaluación</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getStudentAverage(ev) !== null ? getStudentAverage(ev)?.toFixed(1) : '-'}
                  </p>
                  {getStudentAverage(ev) !== null && (
                    <p className="text-xs text-gray-500">{getCalificacionLOMLOE(getStudentAverage(ev)!)}</p>
                  )}
                </div>
              ))}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-sm text-indigo-100">Nota Final</p>
                <p className="text-2xl font-bold">
                  {getFinalAverage() !== null ? getFinalAverage()?.toFixed(1) : '-'}
                </p>
                {getFinalAverage() !== null && (
                  <p className="text-xs text-indigo-100">{getCalificacionLOMLOE(getFinalAverage()!)}</p>
                )}
              </div>
            </div>

            {/* Detalle por evaluaciones */}
            {[1, 2, 3].map(ev => {
              const cals = studentCalificaciones.filter(c => c.evaluacion === ev);
              if (cals.length === 0) return null;
              return (
                <div key={ev} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800">{ev}ª Evaluación</h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Actividad</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Situación</th>
                        <th className="text-center py-2 px-4 text-sm font-medium text-gray-500">Nota</th>
                        <th className="text-center py-2 px-4 text-sm font-medium text-gray-500">Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cals.map(cal => {
                        const sit = state.situaciones.find(s => s.id === cal.situacionId);
                        const act = sit?.actividades.find(a => a.id === cal.actividadId);
                        const nota = (cal.score / cal.maxScore) * 10;
                        return (
                          <tr key={cal.id} className="border-t">
                            <td className="py-2 px-4 text-sm">{act?.title || 'N/A'}</td>
                            <td className="py-2 px-4 text-sm text-gray-500">{sit?.title || 'N/A'}</td>
                            <td className="py-2 px-4 text-sm text-center">{cal.score}/{cal.maxScore}</td>
                            <td className="py-2 px-4 text-sm text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                nota >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {nota.toFixed(1)} - {getCalificacionLOMLOE(nota)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {studentCalificaciones.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aún no tienes calificaciones registradas</p>
              </div>
            )}
          </div>
        );

      case 'competencias':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mi Informe de Competencias</h2>
            <p className="text-gray-600">Grado de adquisición de las competencias clave según la LOMLOE</p>

            {[1, 2, 3].map(ev => {
              const informes = studentInformes.filter(i => i.evaluacion === ev);
              if (informes.length === 0) return null;
              return (
                <div key={ev} className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{ev}ª Evaluación</h3>
                  <div className="grid gap-3">
                    {informes.map(inf => {
                      const cc = COMPETENCIAS_CLAVE.find(c => c.code === inf.competenciaClave);
                      const nivel = NIVELES_ADQUISICION.find(n => n.level === inf.nivel);
                      return (
                        <div key={inf.competenciaClave} className="flex items-center gap-4 p-3 border rounded-lg">
                          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                            {inf.competenciaClave}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{cc?.name}</p>
                            {inf.observaciones && <p className="text-xs text-gray-500">{inf.observaciones}</p>}
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                            inf.nivel === 1 ? 'bg-red-50 text-red-700 border-red-200' :
                            inf.nivel === 2 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            inf.nivel === 3 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {nivel?.letter} - {nivel?.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {studentInformes.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aún no hay informes de competencias disponibles</p>
              </div>
            )}

            {/* Leyenda */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Niveles de adquisición</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {NIVELES_ADQUISICION.map(n => (
                  <div key={n.level} className={`p-3 rounded-lg border text-center ${
                    n.level === 1 ? 'bg-red-50 border-red-200' :
                    n.level === 2 ? 'bg-yellow-50 border-yellow-200' :
                    n.level === 3 ? 'bg-blue-50 border-blue-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="font-bold text-lg">{n.letter}</div>
                    <div className="text-xs font-medium">{n.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">EduLOMLOE</h1>
              <p className="text-xs text-gray-500">Alumno</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedSituacion(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
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
              <User className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 truncate">{currentUser.fullName}</p>
              <p className="text-xs text-gray-500">{state.subjectName}</p>
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
