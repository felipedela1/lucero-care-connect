import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section className="py-10">
      <Helmet>
        <title>Contacto | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Escríbeme por WhatsApp o envía el formulario. Click-to-call disponible." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Contacto</h1>
      <form className="grid gap-3 max-w-lg" aria-label="Formulario de contacto" onSubmit={(e)=>{e.preventDefault();console.log('Contacto enviado (simulado)')}}>
        <input required aria-label="Nombre" placeholder="Nombre" className="border rounded-md p-2" />
        <input required type="email" aria-label="Email" placeholder="Email" className="border rounded-md p-2" />
        <input required aria-label="Teléfono" placeholder="Teléfono" className="border rounded-md p-2" />
        <textarea required aria-label="Mensaje" placeholder="Mensaje" className="border rounded-md p-2" />
        <Button type="submit">Enviar</Button>
      </form>
      <div className="mt-6 flex gap-4">
        <a href="tel:+34999999999" className="underline text-primary">Llamar</a>
        <a href="https://wa.me/34999999999" target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>
      </div>
    </section>
  );
}
