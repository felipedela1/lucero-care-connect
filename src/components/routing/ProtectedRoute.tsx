import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserRole from "@/hooks/useUserRole";

/**
 * ProtectedRoute
 * - Envuelve rutas que requieren rol específico.
 */
export default function ProtectedRoute({
  allow,
  children,
}: {
  allow: string[];
  children: ReactNode;
}) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <div style={{ padding: 24 }}>Cargando…</div>;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
