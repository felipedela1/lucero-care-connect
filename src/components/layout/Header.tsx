import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import useUserRole from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

/** Items de navegación visibles para todos los usuarios */
const navItems = [
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/experiencia", label: "Experiencia" },
  { to: "/referencias", label: "Referencias" },
  { to: "/reservas", label: "Reservas" },
  { to: "/tarifas-faq", label: "Tarifas y FAQ" },
  { to: "/contacto", label: "Contacto" },
];

/**
 * Header
 * - Dibuja la barra superior con branding, navegación, login/logout y switch de tema.
 * - Muestra el enlace "Disponibilidad Admin" solo si el rol del usuario es "admin".
 */
export default function Header() {
  /** Estado del tema visual (light/dark) persistido en localStorage */
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  /** Hook de rol del usuario para controlar la visibilidad del enlace de admin */
  const { role, isLoading } = useUserRole();

  /** Estado de sesión: true si hay sesión activa (para mostrar Acceder / Cerrar sesión) */
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * initSession
   * - Lee la sesión actual desde Supabase y actualiza estado local.
   */
  async function initSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("[Header] getSession error:", error);
      setHasSession(false);
      setUserEmail(null);
      return;
    }
    const session = data?.session ?? null;
    setHasSession(!!session);
    setUserEmail(session?.user?.email ?? null);
  }

  /**
   * handleLogout
   * - Cierra la sesión actual y navega a la home.
   */
  async function handleLogout() {
    await supabase.auth.signOut();
    setHasSession(false);
    setUserEmail(null);
    navigate("/", { replace: true });
  }

  /** Log de depuración para ver el rol y estado de carga del hook */
  useEffect(() => {
    console.log("[Header] role:", role, "isLoading:", isLoading);
  }, [role, isLoading]);

  /** Efecto: aplica la clase "dark" al <html> y persiste preferencia */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Alterna entre tema claro y oscuro */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  /** Efecto: inicializa sesión y se suscribe a cambios de auth (login/logout/refresh) */
  useEffect(() => {
    initSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setHasSession(!!session);
      setUserEmail(session?.user?.email ?? null);
      console.log("[Header] auth state:", _evt, "email:", session?.user?.email);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="container mx-auto flex items-center justify-between py-3">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl">Lucero</span>
          <span aria-hidden className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">Cuidadora en Sevilla</span>
        </div>
        {/* Botón menú móvil */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring"
          aria-label="Abrir menú"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Navegación principal escritorio */}
        <ul className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                  }`
                }
                end
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {!isLoading && role === "admin" && (
            <li key="/admin-availability">
              <NavLink
                to="/admin-availability"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                  }`
                }
                end
              >
                Disponibilidad Admin
              </NavLink>
            </li>
          )}
        </ul>
        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-background shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-lg transition-colors ${
                      isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                    }`
                  }
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {!isLoading && role === "admin" && (
              <li key="/admin-availability">
                <NavLink
                  to="/admin-availability"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-lg transition-colors ${
                      isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                    }`
                  }
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Disponibilidad Admin
                </NavLink>
              </li>
            )}
          </ul>
        )}
        {/* Acciones: CTA + login/logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/reservas" aria-label="Reservar ahora">Reservar ahora</Link>
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {hasSession ? (
              <>
                {userEmail && (
                  <span className="text-xs text-muted-foreground max-w-[160px] truncate" title={userEmail}>
                    {userEmail}
                  </span>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/" aria-label="Registro">Registro</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
