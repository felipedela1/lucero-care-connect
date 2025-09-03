import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section className="app-gradient-bg py-14 px-4 flex flex-col items-center w-full">
      <Helmet>
        <title>Contacto | Cuidadora — Cuidadora en Sevilla</title>
        <meta name="description" content="Escríbeme por WhatsApp o envía el formulario. Click-to-call disponible." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="w-full max-w-5xl grid gap-10">
        <header className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
            Contacto
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Envíame un mensaje o usa los accesos directos para hablar conmigo por teléfono o WhatsApp.
          </p>
        </header>

        <div className="grid md:grid-cols-5 gap-8">
          <form
            className="md:col-span-3 glass-card rounded-2xl p-6 md:p-8 grid gap-4"
            aria-label="Formulario de contacto"
            onSubmit={(e)=>{e.preventDefault(); /* enviar */}}
          >
            <div className="grid gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nombre</label>
              <input required aria-label="Nombre" placeholder="Tu nombre" className="input-modern" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</label>
              <input required type="email" aria-label="Email" placeholder="tu@email.com" className="input-modern" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Teléfono</label>
              <input required aria-label="Teléfono" placeholder="+34 ..." className="input-modern" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mensaje</label>
              <textarea required rows={5} aria-label="Mensaje" placeholder="Cuéntame qué necesitas..." className="input-modern resize-none" />
            </div>
            <button
              type="submit"
              className="btn-gradient rounded-xl px-5 py-3 font-semibold shadow-md focus-ring-vivid animate-ring"
            >
              Enviar mensaje
            </button>
          </form>

          <aside className="md:col-span-2 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold underline-fx">Accesos rápidos</h2>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="tel:+34999999999"
                  className="btn-gradient rounded-lg px-4 py-2 text-center font-medium shadow hover:shadow-lg"
                >
                  Llamar
                </a>
                <a
                  href="https://wa.me/34999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-4 py-2 font-medium bg-green-500 text-white shadow hover:bg-green-600 transition"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:info@example.com"
                  className="rounded-lg px-4 py-2 font-medium bg-accent/80 text-foreground shadow hover:bg-accent transition"
                >
                  Email directo
                </a>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3 text-sm">
              <h3 className="font-medium underline-fx">Privacidad</h3>
              <p className="text-muted-foreground">
                Tus datos se usan solo para responder a tu consulta. No se comparten con terceros.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
