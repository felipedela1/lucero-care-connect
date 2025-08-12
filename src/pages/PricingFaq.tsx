import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingFaq() {
  return (
    <section className="py-10">
      <Helmet>
        <title>Tarifas y FAQ | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="10€/h cerca del metro y 12€/h lejos del metro. Preguntas frecuentes sobre reservas y política de cancelación." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Tarifas</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border rounded-xl p-4">
          <h2 className="font-heading text-xl">10 €/h</h2>
          <p className="text-muted-foreground">Zona cerca del metro (la familia marca el toggle en la reserva).</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-heading text-xl">12 €/h</h2>
          <p className="text-muted-foreground">Zona lejos del metro.</p>
        </div>
      </div>

      <h2 className="font-heading text-2xl mt-8 mb-2">FAQ</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="reserva">
          <AccordionTrigger>¿Cómo reservo?</AccordionTrigger>
          <AccordionContent>Desde la página de Reservas en 3 pasos.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="cancelacion">
          <AccordionTrigger>Política de cancelación</AccordionTrigger>
          <AccordionContent>Avísame con la mayor antelación posible. Sin costes si se avisa con 24h.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="bebes">
          <AccordionTrigger>¿Atención a bebés?</AccordionTrigger>
          <AccordionContent>Sí, con formación en primeros auxilios pediátricos.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="mascotas">
          <AccordionTrigger>¿Mascotas?</AccordionTrigger>
          <AccordionContent>Sin problema, indícalo en la reserva.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
