"use client";

import React from "react";
import { FiPlus, FiTrash2, FiLoader } from "react-icons/fi";

import { withRecurso, type RecursoProps } from "./withRecurso";
import type { BloqueoHorario } from "@/types/horarios";

type Props = RecursoProps<BloqueoHorario>;

const hoyISO = () => new Date().toISOString().split("T")[0];

const BloqueosHorariosView: React.FC<Props> = ({
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
          <h2 className="text-2xl font-bold">Bloqueos de Horarios</h2>
          <p className="mt-1 text-sm text-slate-400">
            Bloqueos temporales por fechas/horas específicas (ej: feriados,
            mantenimiento).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saving && (
            <FiLoader className="animate-spin text-slate-400" size={20} />
          )}
          <button
            onClick={() =>
              crear({
                nombre: "Nuevo bloqueo",
                fechaInicio: hoyISO(),
                horaInicio: "00:00",
                fechaFin: hoyISO(),
                horaFin: "23:59",
              })
            }
            className="flex items-center gap-2 rounded-2xl bg-slate-700 px-5 py-3 font-bold transition hover:bg-slate-600"
          >
            <FiPlus />
            Agregar Bloqueo
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
        <div className="space-y-4">
          {items.length === 0 && (
            <p className="text-sm text-slate-500">Sin bloqueos configurados.</p>
          )}

          {items.map((bloqueo) => (
            <div
              key={bloqueo._id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nombre del bloqueo
                </label>
                <input
                  type="text"
                  defaultValue={bloqueo.nombre}
                  onBlur={(e) =>
                    e.target.value !== bloqueo.nombre &&
                    actualizar(bloqueo._id, { nombre: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={bloqueo.fechaInicio}
                    onChange={(e) =>
                      actualizar(bloqueo._id, { fechaInicio: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={bloqueo.horaInicio}
                    onChange={(e) =>
                      actualizar(bloqueo._id, { horaInicio: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={bloqueo.fechaFin}
                    onChange={(e) =>
                      actualizar(bloqueo._id, { fechaFin: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={bloqueo.horaFin}
                    onChange={(e) =>
                      actualizar(bloqueo._id, { horaFin: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => eliminar(bloqueo._id)}
                  className="flex items-center gap-2 text-red-400 transition hover:bg-red-500/25 rounded-lg px-3 py-2"
                >
                  <FiTrash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BloqueosHorarios = withRecurso<BloqueoHorario>(
  "/api/horarios/bloqueos"
)(BloqueosHorariosView);

export default BloqueosHorarios;
