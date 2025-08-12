import { Helmet } from "react-helmet-async";
import ServiceCarousel from "@/components/ServiceCarousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Lucero Rodriguez Morales | Cuidadora en Sevilla</title>
        <meta name="description" content="Cuidado con cariño, confianza y experiencia en Sevilla. Apoyo flexible: tardes, noches y fines de semana." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section className="pt-10 md:pt-16">
        <div className="rounded-2xl p-8 md:p-12 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-[var(--shadow-elev)]">
          <h1 className="font-heading text-3xl md:text-5xl leading-tight">
            Hola, familias — soy <span className="text-primary">Lucero Rodriguez Morales</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground">
            Cuidado con cariño, confianza y experiencia en Sevilla. Apoyo flexible: tardes, noches y fines de semana.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg"><Link to="/reservas">Reservar ahora</Link></Button>
            <Button asChild variant="secondary" size="lg"><Link to="/tarifas-faq">Ver tarifas</Link></Button>
          </div>
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card p-4 border">
              <dt className="text-sm text-muted-foreground">Experiencia</dt>
              <dd className="font-heading text-xl">X años</dd>
            </div>
            <div className="rounded-xl bg-card p-4 border">
              <dt className="text-sm text-muted-foreground">Certificación</dt>
              <dd className="font-heading text-xl">Primeros auxilios pediátricos</dd>
            </div>
            <div className="rounded-xl bg-card p-4 border">
              <dt className="text-sm text-muted-foreground">Idiomas</dt>
              <dd className="font-heading text-xl">ES / EN</dd>
            </div>
          </dl>
        </div>
      </section>

      <ServiceCarousel />
    </>
  );
};

export default Index;
