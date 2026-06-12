"use client";

import React, { useMemo } from 'react';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from 'framer-motion';

interface ClaseDeportista {
  dia: string;
  horario: string;
  asistio: boolean;
}

interface Semana {
  semana: string;
  clases: ClaseDeportista[];
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

const generarSemanas = (): Semana[] => {
  return Array.from({ length: 4 }, (_, index) => {
    const diasSeleccionados = [...DIAS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const clases: ClaseDeportista[] = diasSeleccionados.map(
      (dia) => ({
        dia,
        horario:
          HORARIOS[
            Math.floor(Math.random() * HORARIOS.length)
          ],
        asistio: Math.random() > 0.2,
      })
    );

    return {
      semana: `Semana ${index + 1}`,
      clases,
    };
  });
};

const ProgressBar = ({
  porcentaje,
}: {
  porcentaje: number;
}) => {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${porcentaje}%` }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
      />
    </div>
  );
};

const Deportista: React.FC = () => {
  const semanas = useMemo(() => generarSemanas(), []);

  const mesActual = new Date().toLocaleDateString(
    'es-CL',
    {
      month: 'long',
    }
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-0 pd:p-6 text-white">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 rounded-3xl rounded-t-none md:rounded-t-3xl bg-linear-to-r from-cyan-500 to-blue-600 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-xl">
              <FiCalendar size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-black capitalize">
                {mesActual}
              </h1>

              <p className="mt-1 text-cyan-100">
                Tus horarios y asistencias del mes
              </p>
            </div>
          </div>
        </motion.div>

        {/* SEMANAS */}
        <div className="space-y-8">
          {semanas.map((semana, index) => {
            const asistencias = semana.clases.filter(
              (c) => c.asistio
            ).length;

            const porcentaje = Math.round(
              (asistencias / 4) * 100
            );

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.12,
                }}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
              >
                {/* TOP */}
                <div className="border-b border-slate-800 p-6">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {semana.semana}
                      </h2>

                      <p className="mt-1 text-slate-400">
                        4 clases programadas
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cyan-500/15 px-5 py-3">
                      <div className="text-center">
                        <div className="text-3xl font-black text-cyan-300">
                          {porcentaje}%
                        </div>

                        <div className="text-xs uppercase tracking-wider text-slate-400">
                          asistencia
                        </div>
                      </div>
                    </div>
                  </div>

                  <ProgressBar porcentaje={porcentaje} />
                </div>

                {/* CLASES */}
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  {semana.clases.map((clase, i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                      }}
                      className={`rounded-2xl border p-5 transition ${
                        clase.asistio
                          ? 'border-cyan-500/20 bg-cyan-500/10'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {clase.dia}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-slate-300">
                            <FiClock size={16} />

                            <span>{clase.horario}</span>
                          </div>
                        </div>

                        {clase.asistio && (
                          <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-300">
                            <FiCheckCircle size={26} />
                          </div>
                        )}
                      </div>

                      <div
                        className={`inline-flex rounded-xl px-4 py-2 text-sm font-semibold ${
                          clase.asistio
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {clase.asistio
                          ? 'Asistencia registrada'
                          : 'Pendiente'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Deportista;