"use client";

import React from "react";
import { LuCalendarClock } from "react-icons/lu";

import HorariosClases from "./HorariosClases";
import HorariosHabiles from "./HorariosHabiles";
import BloqueosHorarios from "./BloqueosHorarios";
import ConfigCancelacion from "./ConfigCancelacion";

const HorarioConfig: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-0 md:p-8"
      style={{ backgroundImage: "url(/bgs/bg-01.png)" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="bg-slate-900/80 p-4 md:p-8">
          <div className="flex space-x-4 mb-8">
            <LuCalendarClock size={64} />
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                Horarios
              </h1>
              <p className="mt-2 text-slate-400">
                Administra horarios de clases, disponibilidad de la app y
                bloqueos especiales.
              </p>
            </div>
          </div>

          <HorariosClases />
          <HorariosHabiles />
          <BloqueosHorarios />
          <ConfigCancelacion />
        </div>
      </div>
    </div>
  );
};

export default HorarioConfig;
