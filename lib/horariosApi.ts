import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Document } from "mongodb";

import { connectDB } from "@/lib/mongodb";

type ParamsCtx = { params: Promise<{ id: string }> };

// Convierte el _id (ObjectId) a string para el cliente.
const serialize = (doc: Document) => {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
};

// Handlers de colección: GET (listar) y POST (crear).
export function recursoColeccion(coleccion: string) {
  async function GET() {
    const db = await connectDB();
    const docs = await db.collection(coleccion).find().toArray();

    return NextResponse.json({ data: docs.map(serialize) });
  }

  async function POST(req: NextRequest) {
    const body = await req.json();
    // Nunca confiar en un _id entrante: Mongo lo genera.
    const { _id, ...rest } = body;
    void _id;

    const db = await connectDB();
    const result = await db.collection(coleccion).insertOne({
      ...rest,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { data: { _id: result.insertedId.toString(), ...rest } },
      { status: 201 }
    );
  }

  return { GET, POST };
}

// Handlers de item: PUT (actualizar) y DELETE (eliminar).
export function recursoItem(coleccion: string) {
  async function PUT(req: NextRequest, ctx: ParamsCtx) {
    const { id } = await ctx.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { _id, createdAt, ...rest } = body;
    void _id;
    void createdAt;

    const db = await connectDB();
    const result = await db
      .collection(coleccion)
      .updateOne({ _id: new ObjectId(id) }, { $set: rest });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "No encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  async function DELETE(_req: NextRequest, ctx: ParamsCtx) {
    const { id } = await ctx.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const db = await connectDB();
    const result = await db
      .collection(coleccion)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  return { PUT, DELETE };
}
