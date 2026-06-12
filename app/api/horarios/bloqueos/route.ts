import { recursoColeccion } from "@/lib/horariosApi";

export const dynamic = "force-dynamic";

const { GET, POST } = recursoColeccion("bloqueos_horarios");

export { GET, POST };
