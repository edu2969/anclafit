// Tipos compartidos para la configuración de horarios.

export interface RangoHorario {
  // id local (cliente) para las keys de React dentro de un documento.
  id: string;
  inicio: string;
  termino: string;
}

export interface HorarioDia {
  dia: string;
  rangos: RangoHorario[];
}

// Horario de clases nombrado (colección: horarios_clases).
export interface HorarioClase {
  _id: string;
  nombre: string;
  // "Horario especial": no todos los alumnos pueden tomar esta clase.
  especial: boolean;
  dias: HorarioDia[];
  // Deportistas (user ids) permitidos para tomar este horario.
  allowedIds?: string[];
  // Deportistas (user ids) bloqueados para este horario.
  blockedIds?: string[];
}

// Usuario en versión reducida para listados/avatares (colección: users).
export interface UsuarioBasico {
  _id: string;
  name: string;
  email: string;
  role: "DEPORTISTA" | "ENTRENADOR";
  image?: string;
}

// Rango horario hábil global (colección: horarios_habiles).
export interface HorarioHabil {
  _id: string;
  inicio: string;
  termino: string;
}

// Bloqueo por fecha/hora específica (colección: bloqueos_horarios).
export interface BloqueoHorario {
  _id: string;
  nombre: string;
  fechaInicio: string;
  horaInicio: string;
  fechaFin: string;
  horaFin: string;
}

// Configuración singleton (colección: config_horarios).
export interface ConfigHorarios {
  horasCancelacion: number;
}

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export const generarHoras = (): string[] => {
  const horas: string[] = [];

  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");

      horas.push(`${hh}:${mm}`);
    }
  }

  return horas;
};

export const HORAS = generarHoras();
