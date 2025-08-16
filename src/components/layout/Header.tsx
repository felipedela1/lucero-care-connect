import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useUserRole from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, Sun, Moon } from "lucide-react";

/** Items de navegación visibles para todos (slugs unificados con Footer) */
const navItems = [
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/experiencia", label: "Experiencia" },
  { to: "/referencias", label: "Referencias" },
  { to: "/tarifas-faq", label: "Tarifas" },
  { to: "/reservas", label: "Reservas" },
  { to: "/contacto", label: "Contacto" },
];

/**
 * Header
 * - Dibuja la barra superior con branding, navegación, login/logout y preferencia de tema (persistida).
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

  /** Log de depuración para ver el rol y estado de carga del hook (puedes quitarlo en prod) */
  useEffect(() => {
    console.log("[Header] role:", role, "isLoading:", isLoading);
  }, [role, isLoading]);

  /** Efecto: aplica la clase "dark" al <html> y persiste preferencia */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Efecto: inicializa sesión y se suscribe a cambios de auth (login/logout/refresh) */
  useEffect(() => {
    initSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      setHasSession(!!session);
      setUserEmail(session?.user?.email ?? null);
      console.log("[Header] auth state:", _evt, "email:", session?.user?.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const navLinkBase =
    "relative inline-flex items-center gap-1 px-4 h-10 rounded-xl text-sm font-medium tracking-wide leading-none transition focus:outline-none focus:ring-2 focus:ring-primary/40";
  const navLinkActive =
    "bg-primary text-white shadow-md after:absolute after:inset-0 after:rounded-xl after:ring-1 after:ring-white/15";
  const navLinkIdle =
    "bg-white/55 dark:bg-white/10 backdrop-blur text-foreground/80 hover:bg-primary/12 hover:shadow-sm hover:text-foreground";

  return (
    <header className="sticky top-0 z-50">
      <div className="relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent">
        <div className="absolute inset-0 backdrop-blur-xl bg-background/70 dark:bg-background/55 supports-[backdrop-filter]:bg-background/55" />
        <nav className="relative mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 md:px-6 h-[72px]">
           {/* Branding */}
           <Link
             to="/inicio"
             className="flex items-center gap-2 group"
             aria-label="Ir a inicio"
           >
            <span className="font-heading text-[1.45rem] font-bold gradient-text tracking-tight select-none leading-none">
              Lucero
            </span>
            <span className="hidden md:inline text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition translate-y-[1px] select-none">
               Cuidado infantil en Sevilla
            </span>
           </Link>
           {/* Desktop nav */}
           <ul className="hidden lg:flex items-center gap-1.5">
             {navItems.map((item) => (
               <li key={item.to}>
                 <NavLink
                   to={item.to}
                   end
                   className={({ isActive }) =>
                     `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`
                   }
                 >
                  <span className="relative z-10">{item.label}</span>
                  {!location.pathname.startsWith(item.to) && (
                    <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-primary/10 via-accent/10 to-transparent" />
                  )}
                 </NavLink>
               </li>
             ))}
             {!isLoading && role === "admin" && (
               <li>
                 <NavLink
                   to="/admin-availability"
                   className={({ isActive }) =>
                     `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`
                   }
                 >
                   Admin
                 </NavLink>
               </li>
             )}
           </ul>
           {/* Right actions */}
           <div className="flex items-center gap-2">
             <button
               onClick={toggleTheme}
               aria-label="Cambiar tema"
               className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/55 dark:bg-white/10 backdrop-blur text-foreground hover:bg-primary/15 transition focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
             >
               {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <div className="hidden md:block">
               <Button
                 asChild
                 className="btn-gradient rounded-xl px-5 shadow-md hover:shadow-lg transition leading-none h-10 !text-sm font-semibold"
               >
                 <Link to="/reservas">Reservar</Link>
               </Button>
             </div>
             <div className="hidden md:flex items-center gap-2">
               {hasSession ? (
                 <>
                   {userEmail && (
                     <span
                       className="max-w-[150px] truncate text-[11px] text-muted-foreground"
                       title={userEmail}
                     >
                       {userEmail}
                     </span>
                   )}
                   <Button
                     variant="outline"
                     onClick={handleLogout}
                     className="rounded-xl text-[11px] h-9 px-4 bg-white/55 dark:bg-white/10 hover:bg-primary/12 border-none shadow-sm"
                   >
                     Salir
                   </Button>
                 </>
               ) : (
                 <Button
                   variant="outline"
                   asChild
                   className="rounded-xl text-[11px] h-9 px-4 bg-white/55 dark:bg-white/10 hover:bg-primary/12 border-none shadow-sm"
                 >
                   <Link to="/Login">Inicia Sesión</Link>
                 </Button>
               )}
             </div>
             <button
               className="lg:hidden h-11 w-11 rounded-xl inline-flex items-center justify-center bg-white/55 dark:bg-white/10 backdrop-blur hover:bg-primary/15 transition focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
               aria-label="Menú"
               aria-expanded={mobileMenuOpen}
               onClick={() => setMobileMenuOpen((o) => !o)}
             >
               {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
             </button>
           </div>
         </nav>
         {mobileMenuOpen && (
           <div className="lg:hidden absolute inset-x-0 top-full px-4 pb-6 z-40" role="dialog" aria-modal="true">
             <div className="glass-card rounded-2xl p-5 shadow-xl">
               <ul className="flex flex-col gap-1.5 mb-4">
                 {navItems.map((item) => (
                   <li key={item.to}>
                     <NavLink
                       to={item.to}
                       end
                       onClick={() => setMobileMenuOpen(false)}
                       className={({ isActive }) =>
                         `block w-full text-sm px-4 py-3 rounded-xl font-medium transition ${
                           isActive
                             ? "bg-primary text-white shadow-md"
                             : "bg-white/55 dark:bg-white/10 hover:bg-primary/12"
                         }`
                       }
                     >
                       {item.label}
                     </NavLink>
                   </li>
                 ))}
                 {!isLoading && role === "admin" && (
                   <li>
                     <NavLink
                       to="/admin-availability"
                       onClick={() => setMobileMenuOpen(false)}
                       className={({ isActive }) =>
                         `block w-full text-sm px-4 py-3 rounded-xl font-medium transition ${
                           isActive
                             ? "bg-primary text-white shadow-md"
                             : "bg-white/55 dark:bg-white/10 hover:bg-primary/12"
                         }`
                       }
                     >
                       Admin
                     </NavLink>
                   </li>
                 )}
               </ul>
               <div className="flex flex-col gap-2">
                 {hasSession ? (
                   <Button
                     onClick={() => {
                       handleLogout();
                       setMobileMenuOpen(false);
                     }}
                     className="btn-gradient rounded-xl w-full h-10 leading-none !text-sm"
                   >
                     Cerrar sesión
                   </Button>
                 ) : (
                   <Button
                     asChild
                     className="btn-gradient rounded-xl w-full h-10 leading-none !text-sm"
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <Link to="/Login">Inicia Sesión</Link>
                   </Button>
                 )}
                 <Button
                   asChild
                   variant="outline"
                   className="rounded-xl w-full h-10 leading-none bg-white/55 dark:bg-white/10 hover:bg-primary/12 border-none shadow-sm !text-sm"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <Link to="/reservas">Reservar ahora</Link>
                 </Button>
               </div>
             </div>
           </div>
         )}
       </div>
     </header>
  );
}
