"use client";

import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
  Clock,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Vista = 'dia' | 'semana';

interface Alumno {
  id: number;
  nombre: string;
}

interface Clase {
  horario: string;
  alumnos: Alumno[];
}

const HORARIOS = [
  '07:30 - 08:30',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
];

const DIAS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const NOMBRES = [
  'Sofía',
  'Martina',
  'Vicente',
  'Tomás',
  'Josefa',
  'Benjamín',
  'Florencia',
  'Ignacio',
  'Catalina',
  'Matías',
  'Antonia',
  'Emilia',
  'Lucas',
  'Amanda',
];

const generarAlumnos = (): Alumno[] => {
  return NOMBRES.map((nombre, index) => ({
    id: index + 1,
    nombre,
  }));
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generarSemana = () => {
  const alumnos = generarAlumnos();

  const semana: Record<string, Clase[]> = {};

  DIAS.forEach((dia) => {
    semana[dia] = HORARIOS.map((horario) => {
      const cantidad = random(4, 14);

      const mezclados = [...alumnos]
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidad);

      return {
        horario,
        alumnos: mezclados,
      };
    });
  });

  return semana;
};

const Entrenador: React.FC = () => {
  const [vista, setVista] = useState<Vista>('dia');
  const [diaActual, setDiaActual] = useState(0);
  const [direccion, setDireccion] = useState(1);

  const semana = useMemo(() => generarSemana(), []);

  const siguienteDia = () => {
    setDireccion(1);
    setDiaActual((prev) => (prev + 1) % DIAS.length);
  };

  const anteriorDia = () => {
    setDireccion(-1);
    setDiaActual((prev) =>
      prev === 0 ? DIAS.length - 1 : prev - 1
    );
  };

  const variantesDia = {
    enter: (direccion: number) => ({
      x: direccion > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direccion: number) => ({
      x: direccion > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-2 md:p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-2 flex flex-col gap-4 rounded-3xl bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Tu panel
            </h1>

            <p className="mt-1 text-slate-400">
              Gestión de clases y alumnos registrados
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setVista('dia')}
              className={`rounded-2xl px-5 py-3 font-semibold transition ${
                vista === 'dia'
                  ? 'bg-[#D5D318] text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vista Día
            </button>

            <button
              onClick={() => setVista('semana')}
              className={`rounded-2xl px-5 py-3 font-semibold transition ${
                vista === 'semana'
                  ? 'bg-[#D5D318] text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vista Semana
            </button>
          </div>
        </div>

        {/* NAV */}
        {vista === 'dia' && <div className="mb-8 flex items-center justify-between">
          <button
            onClick={anteriorDia}
            className="flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 transition hover:bg-slate-700"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-4">
            <CalendarDays className="text-[#D5D318]" />

            <span className="text-2xl font-bold">
              {DIAS[diaActual]}
            </span>
          </div>

          <button
            onClick={siguienteDia}
            className="flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 transition hover:bg-slate-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>}

        {/* VISTA DÍA */}
        <AnimatePresence mode="wait" custom={direccion}>
          {vista === 'dia' ? (
            <motion.div
              key={`dia-${diaActual}`}
              custom={direccion}
              variants={variantesDia}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.35,
                ease: 'easeInOut',
              }}
              className="grid gap-5"
            >
              {semana[DIAS[diaActual]].map((clase, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.01,
                    y: -2,
                  }}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-800 shadow-2xl"
                >
                  <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-[#D5D318]/20 px-3 py-1 text-sm font-bold text-[#D5D318]">
                          {clase.horario}
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <Users size={16} />

                          <span>
                            {clase.alumnos.length} alumnos
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {clase.alumnos.map((alumno) => (
                          <div
                            key={alumno.id}
                            className="rounded-xl bg-slate-700 px-3 py-2 text-sm text-slate-100"
                          >
                            {alumno.nombre}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-[#D5D318]/10">
                      <div className="text-center mt-4">
                        <div className="text-3xl font-black text-[#D5D318]">
                          {clase.alumnos.length}
                        </div>

                        <div className="text-xs uppercase tracking-wider text-slate-400">
                          inscritos
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* VISTA SEMANA */
            <motion.div
              key="semana"
              initial={{
                opacity: 0,
                rotateX: -15,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                rotateX: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotateX: 15,
                scale: 0.95,
              }}
              transition={{
                duration: 0.45,
                ease: 'easeInOut',
              }}
              className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="grid grid-cols-7 border-b border-slate-800">
                <div className="border-r border-slate-800 p-4 font-bold text-slate-500">
                  <span className="md:hidden"><Clock size={24}/></span>
                  <span className="hidden md:block">
                    Horario
                  </span>
                </div>

                {DIAS.map((dia) => (<>
                  <div
                    key={`dia_${dia}`}
                    className="border-r border-slate-800 p-4 text-center font-bold text-[#D5D318]"
                  >
                    <span className="md:hidden">{dia.charAt(0)}</span>
                    <span className="hidden md:block">{dia}</span>
                  </div>
                  </>
                ))}
              </div>

              {HORARIOS.map((horario) => (
                <div
                  key={horario}
                  className="grid grid-cols-7 border-b border-slate-800 last:border-none"
                >
                  <div className="border-r border-slate-800 p-1 md:p-4 font-semibold text-slate-300 text-sm">
                    <span className="w-full px-1 bg-slate-600 rounded-t-md">{horario.split(' - ')[0]}</span><br/>
                    <span className="w-full px-1 bg-slate-600 rounded-b-md">{horario.split(' - ')[1]}</span>
                  </div>

                  {DIAS.map((dia) => {
                    const clase = semana[dia].find(
                      (c) => c.horario === horario
                    );

                    return (
                      <motion.div
                        key={`${dia}-${horario}`}
                        whileHover={{
                          scale: 1.03,
                          backgroundColor:
                            'rgba(34,211,238,0.12)',
                        }}
                        className="border-r border-slate-800 p-4 text-center transition last:border-none"
                      >
                        <div className="mx-auto flex w-8 h-8 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#D5D318]/15 text-xl font-black text-[#D5D318]">
                          {clase?.alumnos.length}
                        </div>

                        <div className="mt-2 text-xs text-slate-500">
                          registrados
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Entrenador;