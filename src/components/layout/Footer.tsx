export default function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[radial-gradient(circle_at_25%_35%,hsl(var(--primary)/0.55),transparent_60%),radial-gradient(circle_at_80%_65%,hsl(var(--accent)/0.45),transparent_65%)]" />
      <div className="glass-card mx-auto max-w-7xl rounded-3xl px-6 md:px-10 py-12 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl opacity-60 pointer-events-none" />
        <div className="grid gap-10 md:grid-cols-3 relative z-10">
          <div className="space-y-3">
            <p className="font-heading text-2xl font-bold gradient-text leading-none">Cuidadora</p>
            <p className="text-sm text-muted-foreground">
              Cuidado infantil cercano en Sevilla. Rutinas sanas, juego creativo y tranquilidad para la familia.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="tel:+34999999999"
                className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold shadow hover:scale-[1.03] transition"
              >
                Llamar
              </a>
              <a
                href="https://wa.me/34999999999"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-green-500 text-white shadow hover:bg-green-600 transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-8 text-sm">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Navegación</h3>
              <ul className="space-y-1.5">
                <li><a className="underline-fx hover:text-primary transition" href="/sobre-mi">Sobre mí</a></li>
                <li><a className="underline-fx hover:text-primary transition" href="/experiencia">Experiencia</a></li>
                <li><a className="underline-fx hover:text-primary transition" href="/tarifas-faq">Tarifas</a></li>
                <li><a className="underline-fx hover:text-primary transition" href="/reservas">Reservar</a></li>
                <li><a className="underline-fx hover:text-primary transition" href="/referencias">Referencias</a></li>
                <li><a className="underline-fx hover:text-primary transition" href="/contacto">Contacto</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Contacto</h3>
              <ul className="space-y-1.5">
                <li><span className="text-muted-foreground">Sevilla (centro / metro)</span></li>
                <li><a className="hover:text-primary transition" href="mailto:info@example.com">info@example.com</a></li>
                <li><span className="text-muted-foreground text-xs">Horario flexible según reserva</span></li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Actualizaciones</h3>
            <p className="text-sm text-muted-foreground">
              Próximamente más recursos para familias (rutinas, guías y actividades).
            </p>
            <form onSubmit={(e)=>{e.preventDefault();}} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Tu email"
                className="input-modern w-full text-xs"
                aria-label="Email boletín"
              />
              <button
                type="submit"
                className="btn-gradient rounded-xl px-4 py-2 text-xs font-semibold shadow disabled:opacity-50"
              >
                Unirme
              </button>
            </form>
            <p className="text-[10px] text-muted-foreground">
              Sin spam. Solo avisos relevantes.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/30 dark:border-white/10 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Felipe de la Cruz Gozalbes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
