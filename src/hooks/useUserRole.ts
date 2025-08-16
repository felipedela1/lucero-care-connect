// src/hooks/useUserRole.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbUserRole = Database["public"]["Enums"]["user_role"];
type UserRole = Database["public"]["Enums"]["user_role"] | "admin" | "guest";

async function fetchUserRole(): Promise<UserRole | null> {
  // Check localStorage for guest role
  //const localRole = localStorage.getItem("user_role");
  //if (localRole === "guest") {
  //  return "guest";
  //}
  const { data: sessData, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) {
    console.warn("[useUserRole] getSession error:", sessErr);
    return null;
  }
  if (!sessData?.session) {
    console.warn("[useUserRole] Sin sesión (session === null)");
    return null;
  }

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    console.warn("[useUserRole] getUser error o user null:", userErr);
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id) // <- si en tu tabla es user_id, cámbialo aquí
    .single();

  if (error) {
    console.warn("[useUserRole] Error leyendo profiles.role:", error);
    return null;
  }
  if (!data) {
    console.warn("[useUserRole] No hay fila en profiles para", user.id);
    return null;
  }

  return (data.role as UserRole) ?? null;
}

export default function useUserRole() {
  const query = useQuery({
    queryKey: ["user-role"],
    queryFn: fetchUserRole,
    staleTime: 30_000,
  });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      query.refetch();
    });    async function fetchUserRole(): Promise<UserRole | null> {
    
      const { data: sessData, error: sessErr } = await supabase.auth.getSession();
      if (sessErr) {
        console.warn("[useUserRole] getSession error:", sessErr);
        return null;
      }
      if (!sessData?.session) {
        console.warn("[useUserRole] Sin sesión (session === null)");
        return null;
      }
    
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        console.warn("[useUserRole] getUser error o user null:", userErr);
        return null;
      }
    
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    
      if (error) {
        console.warn("[useUserRole] Error leyendo profiles.role:", error);
        return null;
      }
      if (!data) {
        console.warn("[useUserRole] No hay fila en profiles para", user.id);
        return null;
      }
    
      return (data.role as UserRole) ?? null;
    }
    return () => sub.subscription.unsubscribe();
  }, [query]);

  return { role: query.data, isLoading: query.isLoading };
}
