import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Lista usuarios (sin datos sensibles) para asignar a horarios y mostrar
// avatares. Por defecto entrega solo deportistas; ?role=ALL para todos.
//
// El nombre/apellido viven en la colección `profiles` (relacionada por
// `profiles.userId` -> `users._id`), por eso se hace el join aquí.
export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  const filtro =
    role === "ALL" ? {} : role ? { role } : { role: "DEPORTISTA" };

  const db = await connectDB();
  const users = await db
    .collection("users")
    .find(filtro, { projection: { password: 0 } })
    .toArray();

  // Perfiles de los usuarios obtenidos, indexados por userId (string).
  const userIds = users.map((u) => u._id);
  const profiles = userIds.length
    ? await db
        .collection("profiles")
        .find({ userId: { $in: userIds } })
        .toArray()
    : [];

  const perfilPorUserId = new Map(
    profiles.map((p) => [p.userId?.toString(), p])
  );

  const data = users.map((u) => {
    const perfil = perfilPorUserId.get(u._id.toString());
    const nombreCompleto = [perfil?.nombre, perfil?.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      _id: u._id.toString(),
      // Nombre del perfil; si no hay, cae al email para no mostrar "?".
      name: nombreCompleto || u.email || "",
      email: u.email ?? "",
      role: u.role ?? "DEPORTISTA",
      // avatarUrl puede no existir aún en users/profiles → null (usa iniciales).
      image: u.avatarUrl ?? u.image ?? perfil?.avatarUrl ?? null,
    };
  });

  return NextResponse.json({ data });
}
