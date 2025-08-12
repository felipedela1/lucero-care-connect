import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/experiencia", label: "Experiencia" },
  { to: "/referencias", label: "Referencias" },
  { to: "/reservas", label: "Reservas" },
  { to: "/tarifas-faq", label: "Tarifas y FAQ" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [hc, setHc] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (hc) root.classList.add("hc");
    else root.classList.remove("hc");
  }, [hc]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-xl">Lucero</span>
          <span aria-hidden className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">Cuidadora en Sevilla</span>
        </Link>
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
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/reservas" aria-label="Reservar ahora">Reservar ahora</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2" aria-label="Modo alto contraste">
            <span className="text-xs text-muted-foreground">Alto contraste</span>
            <Switch checked={hc} onCheckedChange={setHc} aria-label="Activar alto contraste" />
          </div>
        </div>
      </nav>
    </header>
  );
}
