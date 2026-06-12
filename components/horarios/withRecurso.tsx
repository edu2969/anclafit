"use client";

import React, { useCallback, useEffect, useState } from "react";

// Props que el HOC inyecta al componente envuelto.
export interface RecursoProps<T extends { _id: string }> {
  items: T[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  // Crea un item; el _id lo genera Mongo y vuelve en el item creado.
  crear: (data: Omit<T, "_id">) => Promise<void>;
  // Actualiza un item de forma optimista y persiste los campos enviados.
  actualizar: (id: string, data: Partial<Omit<T, "_id">>) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
}

/**
 * HOC que dota a un componente de sección de un CRUD completo contra
 * `endpoint` (GET/POST en `endpoint`, PUT/DELETE en `endpoint/:id`).
 *
 * Uso:
 *   const Seccion = withRecurso<HorarioHabil>("/api/horarios/habiles")(Vista);
 */
export function withRecurso<T extends { _id: string }>(endpoint: string) {
  return function <P extends RecursoProps<T>>(
    Wrapped: React.ComponentType<P>
  ): React.FC<Omit<P, keyof RecursoProps<T>>> {
    const ConRecurso: React.FC<Omit<P, keyof RecursoProps<T>>> = (props) => {
      const [items, setItems] = useState<T[]>([]);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        let activo = true;

        (async () => {
          try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("No se pudo cargar la información");

            const json = await res.json();
            if (activo) setItems((json.data as T[]) ?? []);
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

      const crear = useCallback(async (data: Omit<T, "_id">) => {
        setSaving(true);
        setError(null);
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("No se pudo crear");

          const json = await res.json();
          setItems((prev) => [...prev, json.data as T]);
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setSaving(false);
        }
      }, []);

      const actualizar = useCallback(
        async (id: string, data: Partial<Omit<T, "_id">>) => {
          // Actualización optimista.
          const previo = await new Promise<T[]>((resolve) => {
            setItems((prev) => {
              resolve(prev);
              return prev.map((it) =>
                it._id === id ? { ...it, ...data } : it
              );
            });
          });

          setSaving(true);
          setError(null);
          try {
            const res = await fetch(`${endpoint}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("No se pudo guardar");
          } catch (e) {
            // Revertir si falla.
            setItems(previo);
            setError((e as Error).message);
          } finally {
            setSaving(false);
          }
        },
        []
      );

      const eliminar = useCallback(async (id: string) => {
        const previo = await new Promise<T[]>((resolve) => {
          setItems((prev) => {
            resolve(prev);
            return prev.filter((it) => it._id !== id);
          });
        });

        setSaving(true);
        setError(null);
        try {
          const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("No se pudo eliminar");
        } catch (e) {
          setItems(previo);
          setError((e as Error).message);
        } finally {
          setSaving(false);
        }
      }, []);

      return (
        <Wrapped
          {...(props as P)}
          items={items}
          loading={loading}
          saving={saving}
          error={error}
          crear={crear}
          actualizar={actualizar}
          eliminar={eliminar}
        />
      );
    };

    ConRecurso.displayName = `withRecurso(${
      Wrapped.displayName || Wrapped.name || "Componente"
    })`;

    return ConRecurso;
  };
}
