import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
      <Helmet>
        <title>Sobre mí | Cuidadora en Sevilla</title>
        <meta
          name="description"
          content="Conoce a Lucero: enfoque educativo, valores, formación y certificaciones para el cuidado infantil en Sevilla."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="w-full max-w-5xl grid gap-10">
        <header className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
            Sobre mí
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Soy <strong className="text-foreground">Lucero Rodríguez Morales</strong>, estudiante de psicología
            infantil (27 años). Apoyo familias fomentando hábitos sanos, juego creativo, vínculo seguro y
            tranquilidad para madres y padres.
          </p>
          <div className="flex justify-center">
            <button
              disabled
              className="btn-gradient opacity-70 cursor-not-allowed rounded-xl px-6 py-3 font-semibold shadow-md focus-ring-vivid"
              aria-disabled="true"
            >
              Descargar CV (pronto)
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold underline-fx">Valores</h2>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Seguridad emocional y confianza.</li>
              <li>Rutinas saludables y consistentes.</li>
              <li>Juego simbólico y creatividad guiada.</li>
              <li>Comunicación clara con la familia.</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold underline-fx">Enfoque</h2>
            <p className="text-sm text-muted-foreground">
              Combino actividades estructuradas (lectura, lógica, motricidad) con juego libre supervisado y guía
              emocional para favorecer autonomía y autoestima.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold underline-fx">Qué aporto</h2>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Planificación diaria flexible.</li>
              <li>Observación y reporte de progreso.</li>
              <li>Adaptación a alergias y necesidades.</li>
              <li>Gestión calmada de conflictos.</li>
            </ul>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold gradient-text">Formación</h3>
              <ul className="text-sm space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-primary shadow" />
                  <div>
                    <p className="font-medium text-foreground">Grado en Psicología Infantil (en curso)</p>
                    <p className="text-xs opacity-80">Foco en desarrollo socioemocional y aprendizaje temprano.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-primary shadow" />
                  <div>
                    <p className="font-medium text-foreground">Talleres primeros auxilios básicos</p>
                    <p className="text-xs opacity-80">Identificación temprana de señales de riesgo.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold gradient-text">Certificaciones</h3>
              <ul className="text-sm space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-primary shadow" />
                  <div>
                    <p className="font-medium text-foreground">Manipulación de alimentos (pend.)</p>
                    <p className="text-xs opacity-80">Planificado para registro oficial.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-primary shadow" />
                  <div>
                    <p className="font-medium text-foreground">Cert. apoyo educativo (pend.)</p>
                    <p className="text-xs opacity-80">En proceso de incorporación.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold gradient-text mb-3">Metodología diaria</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { t: "Acogida", d: "Revisión estado emocional y energía." },
                { t: "Actividad", d: "Juego guiado / tareas cognitivas ligeras." },
                { t: "Movimiento", d: "Dinámicas motrices o exterior." },
                { t: "Cierre", d: "Tranquilidad, orden y transición." }
              ].map(b => (
                <div
                  key={b.t}
                  className="rounded-xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur border border-white/40 dark:border-white/5 shadow-sm text-xs"
                >
                  <p className="font-medium text-foreground">{b.t}</p>
                  <p className="text-muted-foreground mt-1">{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Siempre abierta a adaptar rutinas a las necesidades concretas de cada familia.
          </div>
        </div>
      </div>
    </section>
  );
}
