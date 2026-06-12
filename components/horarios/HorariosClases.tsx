"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiChevronDown,
  FiEdit2,
  FiStar,
} from "react-icons/fi";

import { withRecurso, type RecursoProps } from "./withRecurso";
import {
  DIAS_SEMANA,
  HORAS,
  type HorarioClase,
  type HorarioDia,
  type RangoHorario,
} from "@/types/horarios";

type Props = RecursoProps<HorarioClase>;

const nuevoRangoId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

const HorariosClasesView: React.FC<Props> = ({
  items,
  loading,
  saving,
  error,
  crear,
  actualizar,
  eliminar,
}) => {
  // Estado del formulario de creación.
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEspecial, setNuevoEspecial] = useState(false);

  // Estado de UI (no persistido).
  const [colapsados, setColapsados] = useState<Set<string>>(new Set());
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const toggleColapsar = (id: string) => {
    setColapsados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const crearHorario = () => {
    const nombre = nuevoNombre.trim();
    if (!nombre) return;

    crear({
      nombre,
      especial: nuevoEspecial,
      dias: DIAS_SEMANA.map((dia) => ({ dia, rangos: [] })),
    });

    setNuevoNombre("");
    setNuevoEspecial(false);
  };

  // Recalcula los días de una clase y persiste el cambio.
  const actualizarDias = (
    clase: HorarioClase,
    fn: (dias: HorarioDia[]) => HorarioDia[]
  ) => {
    actualizar(clase._id, { dias: fn(clase.dias) });
  };

  const agregarRango = (clase: HorarioClase, dia: string) => {
    actualizarDias(clase, (dias) =>
      dias.map((d) =>
        d.dia === dia
          ? {
              ...d,
              rangos: [
                ...d.rangos,
                { id: nuevoRangoId(), inicio: "08:00", termino: "09:00" },
              ],
            }
          : d
      )
    );
  };

  const actualizarRango = (
    clase: HorarioClase,
    dia: string,
    rangoId: string,
    field: keyof Omit<RangoHorario, "id">,
    value: string
  ) => {
    actualizarDias(clase, (dias) =>
      dias.map((d) =>
        d.dia === dia
          ? {
              ...d,
              rangos: d.rangos.map((r) =>
                r.id === rangoId ? { ...r, [field]: value } : r
              ),
            }
          : d
      )
    );
  };

  const eliminarRango = (clase: HorarioClase, dia: string, rangoId: string) => {
    actualizarDias(clase, (dias) =>
      dias.map((d) =>
        d.dia === dia
          ? { ...d, rangos: d.rangos.filter((r) => r.id !== rangoId) }
          : d
      )
    );
  };

  const guardarNombre = (clase: HorarioClase) => {
    const nombre = nombreEditado.trim();
    if (nombre && nombre !== clase.nombre) {
      actualizar(clase._id, { nombre });
    }
    setEditandoId(null);
    setNombreEditado("");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Horarios de Clases</h2>
        {saving && (
          <FiLoader className="animate-spin text-slate-400" size={20} />
        )}
      </div>

      {/* Formulario de creación */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:flex-row md:items-center">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && crearHorario()}
          placeholder="Nombre del horario"
          className="flex-1 rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-[#D5D318]"
        />

        <label className="flex cursor-pointer items-center gap-2 px-2 text-sm font-semibold text-slate-300 select-none">
          <input
            type="checkbox"
            checked={nuevoEspecial}
            onChange={(e) => setNuevoEspecial(e.target.checked)}
            className="h-5 w-5 accent-[#D5D318]"
          />
          Horario especial
          <span
            className="text-slate-500"
            title="No todos los alumnos podrán tomar esta clase."
          >
            <FiStar size={14} />
          </span>
        </label>

        <button
          onClick={crearHorario}
          disabled={!nuevoNombre.trim()}
          className="flex items-center gap-2 rounded-2xl bg-[#D5D318] px-5 py-3 font-bold text-slate-900 transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          <FiPlus size={20} />
          Agregar Horario
        </button>
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
            <p className="text-sm text-slate-500">
              Aún no hay horarios de clases. Crea el primero arriba.
            </p>
          )}

          {items.map((clase) => {
            const expandido = !colapsados.has(clase._id);
            const totalRangos = clase.dias.reduce(
              (acc, d) => acc + d.rangos.length,
              0
            );

            return (
              <div
                key={clase._id}
                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
              >
                {/* Header de la clase */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => toggleColapsar(clase._id)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <FiChevronDown
                      size={24}
                      className={`transition ${
                        expandido ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                    <div className="text-left">
                      {editandoId === clase._id ? (
                        <input
                          autoFocus
                          type="text"
                          value={nombreEditado}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          onBlur={() => guardarNombre(clase)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") guardarNombre(clase);
                          }}
                          className="rounded-lg border-2 border-[#D5D318] bg-slate-900 px-3 py-1 text-xl font-bold text-white outline-none"
                        />
                      ) : (
                        <h3 className="flex items-center gap-2 text-xl font-bold">
                          {clase.nombre}
                          {clase.especial && (
                            <span className="flex items-center gap-1 rounded-full bg-[#D5D318]/20 px-2 py-0.5 text-xs font-semibold text-[#D5D318]">
                              <FiStar size={12} />
                              Especial
                            </span>
                          )}
                        </h3>
                      )}
                      <p className="text-sm text-slate-400">
                        {totalRangos} intervalos configurados
                      </p>
                    </div>
                  </button>

                  {/* Toggle especial */}
                  <label
                    className="mr-2 flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-300 select-none"
                    title="No todos los alumnos podrán tomar esta clase."
                  >
                    <input
                      type="checkbox"
                      checked={clase.especial}
                      onChange={(e) =>
                        actualizar(clase._id, { especial: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#D5D318]"
                    />
                    Especial
                  </label>

                  <button
                    onClick={() => {
                      setEditandoId(clase._id);
                      setNombreEditado(clase.nombre);
                    }}
                    className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-[#D5D318]"
                  >
                    <FiEdit2 size={18} />
                  </button>

                  <button
                    onClick={() => eliminar(clase._id)}
                    className="flex h-10 w-10 items-center justify-center text-red-400 transition hover:bg-red-500/25 rounded-lg"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                {/* Contenido expandido */}
                {expandido && (
                  <div className="mt-4 space-y-4 pl-8 border-l-2 border-slate-700">
                    {clase.dias.map((diaCfg) => (
                      <div
                        key={diaCfg.dia}
                        className="rounded-2xl bg-slate-900 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-[#D5D318]">
                            {diaCfg.dia}
                          </h4>
                          <button
                            onClick={() => agregarRango(clase, diaCfg.dia)}
                            className="text-xs flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 transition hover:bg-slate-700"
                          >
                            <FiPlus size={14} />
                            Rango
                          </button>
                        </div>

                        <div className="space-y-2">
                          {diaCfg.rangos.length === 0 && (
                            <p className="text-xs text-slate-500">
                              Sin rangos.
                            </p>
                          )}

                          {diaCfg.rangos.map((rango) => {
                            const invalido = rango.termino <= rango.inicio;

                            return (
                              <div
                                key={rango.id}
                                className="flex gap-2 items-center"
                              >
                                <select
                                  value={rango.inicio}
                                  onChange={(e) =>
                                    actualizarRango(
                                      clase,
                                      diaCfg.dia,
                                      rango.id,
                                      "inicio",
                                      e.target.value
                                    )
                                  }
                                  className={`text-sm rounded-lg border-2 bg-slate-800 px-3 py-1 text-white outline-none ${
                                    invalido
                                      ? "border-red-500"
                                      : "border-slate-600"
                                  }`}
                                >
                                  {HORAS.map((hora) => (
                                    <option key={hora} value={hora}>
                                      {hora}
                                    </option>
                                  ))}
                                </select>

                                <div className="text-slate-500">→</div>

                                <select
                                  value={rango.termino}
                                  onChange={(e) =>
                                    actualizarRango(
                                      clase,
                                      diaCfg.dia,
                                      rango.id,
                                      "termino",
                                      e.target.value
                                    )
                                  }
                                  className={`text-sm rounded-lg border-2 bg-slate-800 px-3 py-1 text-white outline-none ${
                                    invalido
                                      ? "border-red-500"
                                      : "border-slate-600"
                                  }`}
                                >
                                  {HORAS.map((hora) => (
                                    <option key={hora} value={hora}>
                                      {hora}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  onClick={() =>
                                    eliminarRango(clase, diaCfg.dia, rango.id)
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-red-400 transition hover:bg-red-500/25 rounded-lg"
                                >
                                  <FiTrash2 size={16} />
                                </button>

                                {invalido && (
                                  <div className="text-xs text-red-400">
                                    *Inválido
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HorariosClases = withRecurso<HorarioClase>("/api/horarios/clases")(
  HorariosClasesView
);

export default HorariosClases;
