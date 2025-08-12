import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from '../integrations/supabase/client';

export default function Reviews() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-10">
      <Helmet>
        <title>Referencias | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Reseñas verificadas de familias. Deja tu referencia (moderación antes de publicar)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Referencias</h1>
      <div className="grid gap-4">
        <article className="border rounded-xl p-4">
          <h2 className="font-heading">María — Sevilla</h2>
          <p className="text-muted-foreground">★★★★★ · "Muy responsable y cariñosa."</p>
        </article>
        <article className="border rounded-xl p-4">
          <h2 className="font-heading">Juan — Triana</h2>
          <p className="text-muted-foreground">★★★★☆ · "Conecta muy bien con los peques."</p>
        </article>
      </div>

      <div className="mt-8 border rounded-xl p-4">
        <h2 className="font-heading text-xl mb-2">Dejar una referencia</h2>
        {submitted ? (
          <p className="text-primary">¡Gracias! Tu reseña quedará pendiente de moderación.</p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { data, error } = await supabase
                .from('reviews')
                .insert({
                  name: 'Juan',
                  review: 'Conecta muy bien con los peques.',
                  rating: 4,
                  status: 'pending',
                });

              if (error) {
                console.error('Error al enviar la reseña:', error);
              } else {
                setSubmitted(true);
              }
            }}
            className="grid gap-3"
            aria-label="Formulario de referencia"
          >
            <input required aria-label="Nombre" placeholder="Nombre" className="border rounded-md p-2" />
            <input required type="number" min={1} max={5} aria-label="Rating" placeholder="Rating 1–5" className="border rounded-md p-2" />
            <textarea required aria-label="Comentario" placeholder="Comentario" className="border rounded-md p-2" />
            <Button type="submit">Enviar reseña</Button>
          </form>
        )}
      </div>
    </section>
  );
}
