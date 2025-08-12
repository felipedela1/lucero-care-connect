import { Helmet } from "react-helmet-async";
//Primer commit
export default function About() {
  return (
    <section className="py-10">
      <Helmet>
        <title>Sobre mí | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Bio, enfoque educativo y valores de Lucero. Seguridad, rutinas saludables y juego creativo." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Sobre mí</h1>
      <p className="text-muted-foreground max-w-2xl">
        Soy Lucero Rodriguez Morales, educadora infantil con X años de experiencia. Me enfoco en juegos creativos,
        rutinas saludables y seguridad. Aquí podrás descargar mi CV y ver mi formación y certificaciones.
      </p>
      <div className="mt-6">
        <a href="#" aria-disabled className="underline text-primary">Descargar CV (PDF) — pronto</a>
      </div>
    </section>
  );
}
