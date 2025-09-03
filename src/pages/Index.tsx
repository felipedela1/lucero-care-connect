import { Helmet } from "react-helmet-async";
import ServiceCarousel from "@/components/ServiceCarousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Check if user is already logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          console.log("User already logged in");
          return;
        }

        // Attempt auto-login with provided credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "felipedelacruzgoon@gmail.com",
          password: "Qwerty1",
        });

        if (error) {
          console.error("Auto-login failed:", error.message);
        } else {
          console.log("Auto-login successful");
        }
      } catch (err) {
        console.error("Auto-login error:", err);
      }
    };

    autoLogin();
  }, []);

  return (
    <>
      <Helmet>
        <title>Lucero Rodriguez Morales | Cuidadora en Sevilla</title>
        <meta
          name="description"
          content="Cuidado con cariño, confianza y experiencia en Sevilla. Apoyo flexible: tardes, noches y fines de semana."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section className="pt-10 md:pt-16">
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-12 shadow-[var(--shadow-elev)]"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          <div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <h1 className="font-heading text-3xl md:text-5xl leading-tight text-white">
            Cuidado con cariño y confianza en Sevilla.
          </h1>
          <p className="mt-3 text-lg md:text-xl text-white/90">
            Tardes, noches y fines de semana, adaptado a tu familia.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" variant="cta">
              <Link to="/reservas">Reservar ahora</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/tarifas-faq">Ver tarifas</Link>
            </Button>
          </div>
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/80 backdrop-blur p-4 border">
              <dt className="text-sm text-muted-foreground">Edad</dt>
              <dd className="font-heading text-xl">27 años</dd>
            </div>
            <div className="rounded-xl bg-white/80 backdrop-blur p-4 border">
              <dt className="text-sm text-muted-foreground">Estudiando</dt>
              <dd className="font-heading text-xl">Psicología infantil</dd>
            </div>
            <div className="rounded-xl bg-white/80 backdrop-blur p-4 border">
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
