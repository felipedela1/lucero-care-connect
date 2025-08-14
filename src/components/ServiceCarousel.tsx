import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Moon, School } from "lucide-react";

const services = [
  {
    title: "Canguro tardes",
    icon: Baby,
    desc: "Apoyo después del cole con merienda, deberes y juego creativo.",
  },
  {
    title: "Noches y fines de semana",
    icon: Moon,
    desc: "Cuidado responsable para planes de noche o descanso de fin de semana.",
  },
  {
    title: "Recogida del cole",
    icon: School,
    desc: "Recogida segura y rutinas hasta la llegada de la familia.",
  },
];

export default function ServiceCarousel() {
  return (
    <section aria-labelledby="servicios" className="my-12">
      <h2 id="servicios" className="font-heading text-2xl mb-4">Servicios</h2>
      <div className="block md:hidden space-y-4">
        {services.map((s) => (
          <Card key={s.title} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <s.icon className="h-5 w-5 text-primary" />
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Carousel className="hidden md:block w-full">
        <CarouselContent>
          {services.map((s) => (
            <CarouselItem key={s.title} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <s.icon className="h-5 w-5 text-primary" />
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
