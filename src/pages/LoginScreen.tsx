import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Intentando login con:", { email, password });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Respuesta signInWithPassword:", { data, error });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Obtener el usuario logueado
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log("Resultado getUser:", { userData, userError });

    const user = userData?.user;

    if (user) {
      const { error: insertError } = await supabase
        .from("profiles")
        .upsert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          email: user.email,
          role: "familia",
        }], { onConflict: "id" }); // Solo actualiza si existe, si no lo crea
      console.log("Resultado upsert profiles:", { insertError });
    }

    navigate("/", { replace: true });
    setLoading(false);
  };

  const handleGuestLogin = () => {
    localStorage.setItem("user_role", "guest");
    navigate("/inicio", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Acceder</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Bloque de botones con espaciamiento uniforme */}
          <div className="space-y-2">
            {/* 1) Login */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : "Login"}
            </Button>

            {/* 2) Registro */}
            <Button className="w-full" asChild type="button">
              <Link to="/registro" aria-label="Crear cuenta nueva">
                Registro
              </Link>
            </Button>

            {/* 3) Invitado */}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGuestLogin}
            >
              Continuar como invitado
            </Button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
