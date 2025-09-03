import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const perks = [
	{ price: "13 €/h", title: "Cerca del metro", desc: "Aplica si la vivienda está a distancia cómoda (andando) de una estación de metro." },
	{ price: "15 €/h", title: "Lejos del metro", desc: "Desplazamiento mayor. Incluye tiempo y coste adicional del trayecto." },
];

export default function PricingFaq() {
	return (
		<section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
			<Helmet>
				<title>Tarifas y FAQ | Cuidadora — Cuidadora en Sevilla</title>
				<meta
					name="description"
					content="13€/h cerca del metro y 15€/h lejos del metro. Preguntas frecuentes sobre reservas y política de cancelación."
				/>
				<link rel="canonical" href={window.location.href} />
			</Helmet>

			<div className="w-full max-w-5xl grid gap-12">
				<header className="text-center space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
						Tarifas & Preguntas
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
						Dos niveles simples según la ubicación. Transparente y sin sorpresas.
					</p>
				</header>

				{/* Tarjetas de precios */}
				<div className="grid gap-6 sm:grid-cols-2">
					{perks.map((p) => (
						<div
							key={p.price}
							className="relative glass-card rounded-2xl p-6 md:p-7 overflow-hidden shadow-lg border border-white/50 dark:border-white/10"
						>
							<div className="absolute inset-0 opacity-[0.10] pointer-events-none bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.7),transparent_65%)]" />
							<div className="relative z-10 flex flex-col gap-3">
								<div className="flex items-baseline justify-between">
									<h2 className="font-heading text-2xl font-bold text-primary">{p.price}</h2>
									<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/30 backdrop-blur">
										{p.title}
									</span>
								</div>
								<p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
								<ul className="mt-1 text-xs text-muted-foreground space-y-1">
									<li className="flex gap-2">
										<span className="text-primary">•</span> Sin cargos ocultos.
									</li>
									<li className="flex gap-2">
										<span className="text-primary">•</span> Se calcula el precio estimado al reservar.
									</li>
								</ul>
							</div>
						</div>
					))}
				</div>

				{/* FAQ */}
				<div className="grid gap-6">
					<h2 className="font-heading text-2xl md:text-3xl font-semibold gradient-text">
						Preguntas frecuentes
					</h2>
					<div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg">
						<Accordion type="single" collapsible className="space-y-2">
							<AccordionItem value="reserva" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">¿Cómo reservo?</AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									Desde la página de Reservas en 3 pasos: eliges día/horas, tus datos y confirmas.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="cancelacion" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">Política de cancelación</AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									Avísame con al menos 24h y no habrá coste. Si surge algo urgente, intenta comunicarlo lo antes
									posible.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="bebes" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">¿Atención a bebés?</AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									Sí. Estimulación temprana básica, observación de hitos y rutinas de descanso.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="mascotas" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">¿Mascotas en casa?</AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									Sin problema. Indica especie y cualquier cuidado especial al reservar.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="horas" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">¿Número mínimo de horas?</AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									No fijo, pero lo habitual son bloques de 2–3 horas para aprovechar mejor la dinámica.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="ubicacion" className="border rounded-xl px-3">
								<AccordionTrigger className="text-sm font-medium">¿Cómo se decide “cerca del metro”? </AccordionTrigger>
								<AccordionContent className="text-sm text-muted-foreground">
									Si la caminata es razonable (≈10–12 min) desde una estación. Si excede claramente, se aplica la
									tarifa de 15 €/h.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>

				{/* Nota final */}
				<div className="text-center text-xs text-muted-foreground">
					¿Otra duda? Usa el formulario de Contacto y te respondo pronto.
				</div>
			</div>
		</section>
	);
}
