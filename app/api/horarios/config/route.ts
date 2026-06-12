import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import type { ConfigHorarios } from "@/types/horarios";

export const dynamic = "force-dynamic";

const COLECCION = "config_horarios";
// Documento único de configuración.
const CLAVE = "horarios";

const DEFAULTS: ConfigHorarios = {
  horasCancelacion: 6,
};

export async function GET() {
  const db = await connectDB();
  const doc = await db.collection(COLECCION).findOne({ clave: CLAVE });

  const data: ConfigHorarios = {
    horasCancelacion: doc?.horasCancelacion ?? DEFAULTS.horasCancelacion,
  };

  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const horasCancelacion = Number(body.horasCancelacion);

  if (!Number.isFinite(horasCancelacion) || horasCancelacion < 1) {
    return NextResponse.json(
      { error: "horasCancelacion inválido" },
      { status: 400 }
    );
  }

  const db = await connectDB();
  await db
    .collection(COLECCION)
    .updateOne(
      { clave: CLAVE },
      { $set: { clave: CLAVE, horasCancelacion } },
      { upsert: true }
    );

  return NextResponse.json({ ok: true });
}
