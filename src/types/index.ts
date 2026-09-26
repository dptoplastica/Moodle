// Tipos para la aplicación EduLOMLOE

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'student';
  fullName: string;
  email?: string;
}

export interface CompetenciaClave {
  code: string;
  name: string;
  description: string;
}

export interface CriterioEvaluacion {
  id: string;
  code: string;
  description: string;
  competenciaClave: string;
  peso: number; // porcentaje 0-100
}

export interface ContenidoMultimedia {
  type: 'text' | 'image' | 'audio' | 'video' | 'link';
  title: string;
  url?: string;
  content?: string;
  description?: string;
}

export interface Actividad {
  id: string;
  title: string;
  description: string;
  type: 'test' | 'essay' | 'project' | 'oral' | 'practical';
  criterioEvaluacion: string;
  maxScore: number;
  questions?: Question[];
  rubric?: RubricItem[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open' | 'true_false';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface RubricItem {
  criterion: string;
  levels: {
    name: string;
    description: string;
    score: number;
  }[];
}

export interface SituacionAprendizaje {
  id: string;
  title: string;
  description: string;
  order: number;
  contenidos: ContenidoMultimedia[];
  actividades: Actividad[];
  criteriosEvaluacion: CriterioEvaluacion[];
  competenciasClave: string[];
  duracion: string;
  productoFinal?: string;
}

export interface Calificacion {
  id: string;
  studentId: string;
  actividadId: string;
  situacionId: string;
  score: number;
  maxScore: number;
  evaluacion: 1 | 2 | 3;
  fecha: string;
  observaciones?: string;
  autoCorregida?: boolean;
}

export interface InformeCompetencia {
  studentId: string;
  competenciaClave: string;
  nivel: number; // 1-4 (A, B, C, D)
  evaluacion: 1 | 2 | 3 | 'final';
  observaciones?: string;
}

export interface AppState {
  users: User[];
  situaciones: SituacionAprendizaje[];
  calificaciones: Calificacion[];
  informes: InformeCompetencia[];
  subjectName: string;
  courseName: string;
}

// Competencias clave LOMLOE
export const COMPETENCIAS_CLAVE: CompetenciaClave[] = [
  { code: 'CCL', name: 'Competencia en comunicación lingüística', description: 'Comunicación oral y escrita' },
  { code: 'CP', name: 'Competencia plurilingüe', description: 'Uso de varias lenguas' },
  { code: 'STEM', name: 'Competencia matemática y en ciencia, tecnología e ingeniería', description: 'Pensamiento científico y matemático' },
  { code: 'CD', name: 'Competencia digital', description: 'Uso de tecnologías digitales' },
  { code: 'CPSAA', name: 'Competencia personal, social y de aprender a aprender', description: 'Autonomía y aprendizaje permanente' },
  { code: 'CC', name: 'Competencia ciudadana', description: 'Participación cívica y social' },
  { code: 'CE', name: 'Competencia emprendedora', description: 'Iniciativa y emprendimiento' },
  { code: 'CCEC', name: 'Competencia en conciencia y expresión culturales', description: 'Apreciación y creación cultural' },
];

// Niveles de adquisición LOMLOE
export const NIVELES_ADQUISICION = [
  { level: 1, letter: 'A', name: 'Insuficiente', description: 'No ha adquirido la competencia' },
  { level: 2, letter: 'B', name: 'Suficiente', description: 'Adquisición básica de la competencia' },
  { level: 3, letter: 'C', name: 'Notable', description: 'Buena adquisición de la competencia' },
  { level: 4, letter: 'D', name: 'Sobresaliente', description: 'Excelente adquisición de la competencia' },
];

// Calificaciones numéricas LOMLOE
export const CALIFICACIONES_LOMLOE = [
  { min: 0, max: 4, grade: 'Insuficiente', letter: 'INS' },
  { min: 5, max: 5, grade: 'Suficiente', letter: 'SU' },
  { min: 6, max: 6, grade: 'Bien', letter: 'B' },
  { min: 7, max: 8, grade: 'Notable', letter: 'NT' },
  { min: 9, max: 10, grade: 'Sobresaliente', letter: 'SB' },
];

export function getCalificacionLOMLOE(score: number): string {
  if (score < 5) return 'Insuficiente';
  if (score < 6) return 'Suficiente';
  if (score < 7) return 'Bien';
  if (score < 9) return 'Notable';
  return 'Sobresaliente';
}

export function getCalificacionLetter(score: number): string {
  if (score < 5) return 'INS';
  if (score < 6) return 'SU';
  if (score < 7) return 'B';
  if (score < 9) return 'NT';
  return 'SB';
}
