import { recursoColeccion } from "@/lib/horariosApi";

export const dynamic = "force-dynamic";

const { GET, POST } = recursoColeccion("horarios_clases");

export { GET, POST };
