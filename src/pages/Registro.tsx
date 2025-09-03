// src/pages/Registro.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * RegistroScreen
 * - Permite crear una cuenta con email y contraseña en Supabase.
 * - Si Supabase tiene "Confirm email" ACTIVADO: no habrá sesión inmediata y mostraremos mensaje para verificar email.
 * - Si "Confirm email" está DESACTIVADO: habrá sesión al instante; opcionalmente creamos perfil y navegamos.
 */
export default function RegistroScreen() {
  const navigate = useNavigate();

  // Campos del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  /**
   * handleRegister
   * - Valida contraseñas, llama a supabase.auth.signUp y gestiona los dos escenarios:
   *   1) Con verificación de email: mostrar aviso de "revisa tu correo".
   *   2) Sin verificación: hay sesión; crear perfil opcional y navegar.
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // Redirección tras confirmar email (si tu proyecto exige confirmación)
      const emailRedirectTo = `${window.location.origin}/inicio`;

      // Log de comprobación
      console.log("Datos para registro:", {
        email,
        password,
        fullName,
        emailRedirectTo,
        signUpPayload: {
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo,
          },
        },
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }, // metadata del usuario
          emailRedirectTo,               // adáptalo si quieres otra ruta
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Caso 1: Confirmación por email activada -> no hay session
      if (!data.session) {
        setInfo(
          "Registro creado. Revisa tu correo y confirma la cuenta para poder iniciar sesión."
        );
        return;
      }

      
      // Navegar una vez registrado y con sesión
      navigate("/inicio", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect auto-focus
   * - Coloca el foco en el email al cargar.
   */
  useEffect(() => {
    const el = document.getElementById("reg-email") as HTMLInputElement | null;
    el?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Nombre completo (opcional)</label>
            <input
              id="reg-fullname"
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Tu nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="reg-email"
              type="email"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="reg-password"
              type="password"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Repite la password</label>
            <input
              id="reg-password2"
              type="password"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="••••••••"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          {/* Botón principal */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarme"}
          </Button>
        </form>

        {/* Estados */}
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
        {info && <p className="text-green-600 dark:text-green-500 text-sm mt-2">{info}</p>}

        {/* Navegación secundaria */}
        <div className="mt-4 text-sm text-center">
          {" "}
          <Link to="/" className="text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300 underline">
            ¿Continuar como invitado?
          </Link>
        </div>
      </div>
    </div>
  );
}
