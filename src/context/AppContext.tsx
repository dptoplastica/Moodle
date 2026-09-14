import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SituacionAprendizaje, Calificacion, InformeCompetencia, AppState } from '../types';

interface AppContextType {
  state: AppState;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, fullName: string, email: string) => boolean;
  logout: () => void;
  addSituacion: (situacion: SituacionAprendizaje) => void;
  updateSituacion: (situacion: SituacionAprendizaje) => void;
  deleteSituacion: (id: string) => void;
  addCalificacion: (calificacion: Calificacion) => void;
  updateCalificacion: (calificacion: Calificacion) => void;
  deleteCalificacion: (id: string) => void;
  addInforme: (informe: InformeCompetencia) => void;
  updateInforme: (informe: InformeCompetencia) => void;
  updateSubjectInfo: (subjectName: string, courseName: string) => void;
}

const defaultState: AppState = {
  users: [
    { id: 'admin1', username: 'admin', password: 'admin123', role: 'admin', fullName: 'Profesor Admin', email: 'admin@edu.es' }
  ],
  situaciones: [],
  calificaciones: [],
  informes: [],
  subjectName: 'Materia de Bachillerato',
  courseName: '1º Bachillerato',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('eduLOMLOE_state');
    return saved ? JSON.parse(saved) : defaultState;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduLOMLOE_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('eduLOMLOE_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduLOMLOE_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eduLOMLOE_currentUser');
    }
  }, [currentUser]);

  const login = (username: string, password: string): boolean => {
    const user = state.users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, fullName: string, email: string): boolean => {
    if (state.users.find(u => u.username === username)) return false;
    const newUser: User = {
      id: `student_${Date.now()}`,
      username,
      password,
      role: 'student',
      fullName,
      email,
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addSituacion = (situacion: SituacionAprendizaje) => {
    setState(prev => ({ ...prev, situaciones: [...prev.situaciones, situacion] }));
  };

  const updateSituacion = (situacion: SituacionAprendizaje) => {
    setState(prev => ({
      ...prev,
      situaciones: prev.situaciones.map(s => s.id === situacion.id ? situacion : s),
    }));
  };

  const deleteSituacion = (id: string) => {
    setState(prev => ({
      ...prev,
      situaciones: prev.situaciones.filter(s => s.id !== id),
      calificaciones: prev.calificaciones.filter(c => c.situacionId !== id),
    }));
  };

  const addCalificacion = (calificacion: Calificacion) => {
    setState(prev => ({ ...prev, calificaciones: [...prev.calificaciones, calificacion] }));
  };

  const updateCalificacion = (calificacion: Calificacion) => {
    setState(prev => ({
      ...prev,
      calificaciones: prev.calificaciones.map(c => c.id === calificacion.id ? calificacion : c),
    }));
  };

  const deleteCalificacion = (id: string) => {
    setState(prev => ({
      ...prev,
      calificaciones: prev.calificaciones.filter(c => c.id !== id),
    }));
  };

  const addInforme = (informe: InformeCompetencia) => {
    setState(prev => ({ ...prev, informes: [...prev.informes, informe] }));
  };

  const updateInforme = (informe: InformeCompetencia) => {
    setState(prev => ({
      ...prev,
      informes: prev.informes.map(i =>
        i.studentId === informe.studentId && i.competenciaClave === informe.competenciaClave && i.evaluacion === informe.evaluacion
          ? informe : i
      ),
    }));
  };

  const updateSubjectInfo = (subjectName: string, courseName: string) => {
    setState(prev => ({ ...prev, subjectName, courseName }));
  };

  return (
    <AppContext.Provider value={{
      state, currentUser, login, register, logout,
      addSituacion, updateSituacion, deleteSituacion,
      addCalificacion, updateCalificacion, deleteCalificacion,
      addInforme, updateInforme, updateSubjectInfo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
