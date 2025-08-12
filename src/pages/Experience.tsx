import { Helmet } from "react-helmet-async";

export default function Experience() {
  return (
    <section className="py-10">
      <Helmet>
        <title>Experiencia | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Casos reales, edades y tareas realizadas. Próximamente con fotos (placeholders por ahora)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Experiencia</h1>
      <p className="text-muted-foreground">Pronto verás tarjetas y timeline con trabajos realizados. (Espacio para fotos)</p>
    </section>
  );
}
