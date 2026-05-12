"use client";

import React, { useMemo, useState } from 'react';

interface Pago {
  mes: string;
  fechaPago: string;
  monto: number;
  asistencias: number;
  totalPosible: number;
}

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const generarFechaCercanaAlPrimero = (year: number, month: number) => {
  const dia = Math.floor(Math.random() * 5) + 1;
  return new Date(year, month, dia).toLocaleDateString('es-CL');
};

const generarPagos = (): Pago[] => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const mesActual = hoy.getMonth();

  return Array.from({ length: mesActual + 1 }, (_, i) => {
    const asistencias = Math.floor(Math.random() * 17) + 1;
    const totalPosible = 16; // 4 clases por semana aprox.

    return {
      mes: meses[i],
      fechaPago: generarFechaCercanaAlPrimero(year, i),
      monto: 40000,
      asistencias,
      totalPosible,
    };
  }).reverse();
};

const ProgressCircle = ({ porcentaje }: { porcentaje: number }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (porcentaje / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg width="80" height="80" className="rotate-[-90deg]">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#22c55e"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
        {porcentaje}%
      </div>
    </div>
  );
};

const Modal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 text-center text-5xl">✅</div>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Pago recibido
        </h2>

        <p className="text-center text-gray-600">
          Tus clases han sido desbloqueadas para ser reservadas.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const Comprobante: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [subido, setSubido] = useState(false);

  const pagos = useMemo(() => generarPagos(), []);

  const mesActual = meses[new Date().getMonth()];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setMostrarModal(true);
      setSubido(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Debes cancelar tu cuota del mes de {mesActual}
          </h1>

          <p className="mb-6 text-gray-600">
            Sube tu comprobante de pago para desbloquear tus reservas.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 transition hover:border-green-500 hover:bg-green-50">
            <span className="mb-2 text-5xl">📤</span>

            <span className="font-medium text-gray-700">
              Haz click para subir tu comprobante
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        {subido && (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Historial de pagos
                </h2>

                <p className="text-gray-500">
                  Plan mensual · 4 clases semanales
                </p>
              </div>

              <div className="rounded-2xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                Membresía activa
              </div>
            </div>

            <div className="space-y-5">
              {pagos.map((pago, index) => {
                const porcentaje = Math.min(
                  100,
                  Math.round(
                    (pago.asistencias / pago.totalPosible) * 100
                  )
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {pago.mes}
                      </h3>

                      <div className="mt-2 space-y-1 text-gray-600">
                        <p>
                          💳 Pago realizado el <b>{pago.fechaPago}</b>
                        </p>

                        <p>
                          💰 Monto: <b>$40.000 CLP</b>
                        </p>

                        <p>
                          🏋️ Asistencias: <b>{pago.asistencias}</b> de{' '}
                          <b>{pago.totalPosible}</b>
                        </p>
                      </div>
                    </div>

                    <ProgressCircle porcentaje={porcentaje} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
};

export default Comprobante;