"use client";

import React from "react";
import { FiPlus, FiTrash2, FiArrowRight, FiLoader } from "react-icons/fi";

import { withRecurso, type RecursoProps } from "./withRecurso";
import { HORAS, type HorarioHabil } from "@/types/horarios";

type Props = RecursoProps<HorarioHabil>;

const HorariosHabilesView: React.FC<Props> = ({
  items,
  loading,
  saving,
  error,
  crear,
  actualizar,
  eliminar,
}) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 mb-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Horarios Hábiles Globales</h2>
          <p className="mt-1 text-sm text-slate-400">
            Horarios en que la aplicación está disponible para todos los
            usuarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saving && (
            <FiLoader className="animate-spin text-slate-400" size={20} />
          )}
          <button
            onClick={() => crear({ inicio: "08:00", termino: "09:00" })}
            className="flex items-center gap-2 rounded-2xl bg-slate-700 px-5 py-3 font-bold transition hover:bg-slate-600"
          >
            <FiPlus />
            Agregar
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-slate-500">
              Sin horarios hábiles configurados.
            </p>
          )}

          {items.map((rango) => {
            const invalido = rango.termino <= rango.inicio;

            return (
              <div key={rango._id} className="flex gap-4 items-center">
                <select
                  value={rango.inicio}
                  onChange={(e) =>
                    actualizar(rango._id, { inicio: e.target.value })
                  }
                  className={`rounded-2xl border-2 bg-slate-900 px-4 py-2 text-white outline-none ${
                    invalido ? "border-red-500" : "border-[#D5D318]"
                  }`}
                >
                  {HORAS.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>

                <div className="text-slate-500">
                  <FiArrowRight size={20} />
                </div>

                <select
                  value={rango.termino}
                  onChange={(e) =>
                    actualizar(rango._id, { termino: e.target.value })
                  }
                  className={`rounded-2xl border-2 bg-slate-900 px-4 py-2 text-white outline-none ${
                    invalido ? "border-red-500" : "border-[#D5D318]"
                  }`}
                >
                  {HORAS.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => eliminar(rango._id)}
                  className="flex h-12 w-12 items-center justify-center text-red-400 transition hover:bg-red-500/25 rounded-2xl"
                >
                  <FiTrash2 size={20} />
                </button>

                {invalido && (
                  <span className="text-red-400 text-sm">Inválido</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HorariosHabiles = withRecurso<HorarioHabil>("/api/horarios/habiles")(
  HorariosHabilesView
);

export default HorariosHabiles;
