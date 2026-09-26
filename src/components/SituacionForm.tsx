import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SituacionAprendizaje, ContenidoMultimedia, Actividad, CriterioEvaluacion, COMPETENCIAS_CLAVE } from '../types';
import { Plus, Trash2, ArrowLeft, Save, Image, Video, Music, Link, FileText } from 'lucide-react';

interface Props {
  situacion?: SituacionAprendizaje;
  onClose: () => void;
}

export default function SituacionForm({ situacion, onClose }: Props) {
  const { addSituacion, updateSituacion, state } = useApp();
  const [title, setTitle] = useState(situacion?.title || '');
  const [description, setDescription] = useState(situacion?.description || '');
  const [order, setOrder] = useState(situacion?.order || state.situaciones.length + 1);
  const [duracion, setDuracion] = useState(situacion?.duracion || '');
  const [productoFinal, setProductoFinal] = useState(situacion?.productoFinal || '');
  const [competenciasClave, setCompetenciasClave] = useState<string[]>(situacion?.competenciasClave || []);
  const [contenidos, setContenidos] = useState<ContenidoMultimedia[]>(situacion?.contenidos || []);
  const [actividades, setActividades] = useState<Actividad[]>(situacion?.actividades || []);
  const [criterios, setCriterios] = useState<CriterioEvaluacion[]>(situacion?.criteriosEvaluacion || []);
  const [activeSection, setActiveSection] = useState<'general' | 'contenidos' | 'actividades' | 'criterios'>('general');

  const addContenido = () => {
    setContenidos([...contenidos, { type: 'text', title: '', content: '' }]);
  };

  const updateContenido = (index: number, field: keyof ContenidoMultimedia, value: string) => {
    const updated = [...contenidos];
    (updated[index] as any)[field] = value;
    setContenidos(updated);
  };

  const removeContenido = (index: number) => {
    setContenidos(contenidos.filter((_, i) => i !== index));
  };

  const addActividad = () => {
    setActividades([...actividades, {
      id: `act_${Date.now()}`,
      title: '',
      description: '',
      type: 'test',
      criterioEvaluacion: '',
      maxScore: 10,
    }]);
  };

  const updateActividad = (index: number, field: keyof Actividad, value: any) => {
    const updated = [...actividades];
    (updated[index] as any)[field] = value;
    setActividades(updated);
  };

  const removeActividad = (index: number) => {
    setActividades(actividades.filter((_, i) => i !== index));
  };

  const addCriterio = () => {
    setCriterios([...criterios, {
      id: `crit_${Date.now()}`,
      code: '',
      description: '',
      competenciaClave: '',
      peso: 10,
    }]);
  };

  const updateCriterio = (index: number, field: keyof CriterioEvaluacion, value: any) => {
    const updated = [...criterios];
    (updated[index] as any)[field] = value;
    setCriterios(updated);
  };

  const removeCriterio = (index: number) => {
    setCriterios(criterios.filter((_, i) => i !== index));
  };

  const toggleCompetencia = (code: string) => {
    setCompetenciasClave(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    const situacionData: SituacionAprendizaje = {
      id: situacion?.id || `sa_${Date.now()}`,
      title,
      description,
      order,
      duracion,
      productoFinal,
      competenciasClave,
      contenidos,
      actividades,
      criteriosEvaluacion: criterios,
    };

    if (situacion) {
      updateSituacion(situacionData);
    } else {
      addSituacion(situacionData);
    }
    onClose();
  };

  const sections = [
    { id: 'general' as const, label: 'General' },
    { id: 'contenidos' as const, label: 'Contenidos/Saberes' },
    { id: 'actividades' as const, label: 'Actividades' },
    { id: 'criterios' as const, label: 'Criterios de Evaluación' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {situacion ? 'Editar Situación de Aprendizaje' : 'Nueva Situación de Aprendizaje'}
        </h2>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* General Section */}
      {activeSection === 'general' && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Título de la situación de aprendizaje"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Descripción de la situación de aprendizaje"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración estimada</label>
              <input
                type="text"
                value={duracion}
                onChange={e => setDuracion(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: 3 semanas"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto final</label>
            <input
              type="text"
              value={productoFinal}
              onChange={e => setProductoFinal(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Producto esperado del alumno"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Competencias Clave</label>
            <div className="grid grid-cols-2 gap-2">
              {COMPETENCIAS_CLAVE.map(cc => (
                <label key={cc.code} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={competenciasClave.includes(cc.code)}
                    onChange={() => toggleCompetencia(cc.code)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-sm">
                    <strong>{cc.code}</strong> - {cc.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenidos Section */}
      {activeSection === 'contenidos' && (
        <div className="space-y-4">
          <button onClick={addContenido} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir Contenido/Saber
          </button>
          {contenidos.map((c, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-800">Contenido {i + 1}</h4>
                <button onClick={() => removeContenido(i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={c.type}
                    onChange={e => updateContenido(i, 'type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="text">Texto</option>
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="link">Enlace externo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={c.title}
                    onChange={e => updateContenido(i, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Título del contenido"
                  />
                </div>
              </div>
              {c.type === 'text' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (HTML permitido)</label>
                  <textarea
                    value={c.content || ''}
                    onChange={e => updateContenido(i, 'content', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Contenido teórico..."
                  />
                </div>
              )}
              {(c.type === 'image' || c.type === 'video' || c.type === 'audio' || c.type === 'link') && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={c.url || ''}
                    onChange={e => updateContenido(i, 'url', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>
              )}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={c.description || ''}
                  onChange={e => updateContenido(i, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descripción breve"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actividades Section */}
      {activeSection === 'actividades' && (
        <div className="space-y-4">
          <button onClick={addActividad} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir Actividad
          </button>
          {actividades.map((a, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-800">Actividad {i + 1}</h4>
                <button onClick={() => removeActividad(i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={a.title}
                    onChange={e => updateActividad(i, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Nombre de la actividad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={a.type}
                    onChange={e => updateActividad(i, 'type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="test">Test/Cuestionario</option>
                    <option value="essay">Redacción/Essay</option>
                    <option value="project">Proyecto</option>
                    <option value="oral">Exposición oral</option>
                    <option value="practical">Actividad práctica</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación máxima</label>
                  <input
                    type="number"
                    value={a.maxScore}
                    onChange={e => updateActividad(i, 'maxScore', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Criterio de evaluación</label>
                  <select
                    value={a.criterioEvaluacion}
                    onChange={e => updateActividad(i, 'criterioEvaluacion', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccionar criterio</option>
                    {criterios.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.description}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={a.description}
                  onChange={e => updateActividad(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descripción de la actividad"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Criterios Section */}
      {activeSection === 'criterios' && (
        <div className="space-y-4">
          <button onClick={addCriterio} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir Criterio de Evaluación
          </button>
          {criterios.map((c, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-800">Criterio {i + 1}</h4>
                <button onClick={() => removeCriterio(i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input
                    type="text"
                    value={c.code}
                    onChange={e => updateCriterio(i, 'code', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="CE.1.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competencia clave</label>
                  <select
                    value={c.competenciaClave}
                    onChange={e => updateCriterio(i, 'competenciaClave', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccionar</option>
                    {COMPETENCIAS_CLAVE.map(cc => (
                      <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
                  <input
                    type="number"
                    value={c.peso}
                    onChange={e => updateCriterio(i, 'peso', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del criterio</label>
                <textarea
                  value={c.description}
                  onChange={e => updateCriterio(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descripción del criterio de evaluación"
                />
              </div>
            </div>
          ))}
          {criterios.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Peso total:</strong> {criterios.reduce((acc, c) => acc + c.peso, 0)}%
                {criterios.reduce((acc, c) => acc + c.peso, 0) !== 100 && (
                  <span className="text-red-600"> (debe sumar 100%)</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
      </div>
    </div>
  );
}
