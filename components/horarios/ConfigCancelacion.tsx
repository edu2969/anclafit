"use client";

import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

import type { ConfigHorarios } from "@/types/horarios";

const ConfigCancelacion: React.FC = () => {
  const [horasCancelacion, setHorasCancelacion] = useState(6);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        const res = await fetch("/api/horarios/config");
        if (!res.ok) throw new Error("No se pudo cargar la configuración");

        const json = await res.json();
        const data = json.data as ConfigHorarios;
        if (activo) setHorasCancelacion(data.horasCancelacion);
      } catch (e) {
        if (activo) setError((e as Error).message);
      } finally {
        if (activo) setLoading(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  const guardar = async () => {
    setSaving(true);
    setGuardado(false);
    setError(null);
    try {
      const res = await fetch("/api/horarios/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horasCancelacion }),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      setGuardado(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <h3 className="text-xl font-bold">Política de Cancelación</h3>

        <p className="mt-2 text-sm text-slate-400">
          Los deportistas tienen cierta cantidad de horas para cancelar o
          reagendar.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Horas límite
          </label>

          <input
            type="number"
            min={1}
            value={horasCancelacion}
            disabled={loading}
            onChange={(e) => {
              setHorasCancelacion(Number(e.target.value));
              setGuardado(false);
            }}
            className="w-full rounded-2xl border-2 border-[#D5D318] bg-slate-900 px-4 py-4 text-white outline-none disabled:opacity-60"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Si el alumno cancela fuera de este rango, pierde la clase.
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={guardar}
            disabled={saving || loading}
            className="flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-[#D5D318] px-6 py-3 font-black text-slate-900 transition hover:scale-[1.02] disabled:opacity-70"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar política"
            )}
          </button>

          {guardado && !saving && (
            <span className="text-sm text-emerald-400">Guardado ✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigCancelacion;
