import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";

const experiences = [
	{
		lugar: "Familia García (Triana)",
		periodo: "Marzo - Mayo 2024",
		descripcion:
			"Cuidado de dos hermanos (3 y 7 años): apoyo en deberes, juegos estructurados, cenas y refuerzo de hábitos.",
		focos: ["Rutinas", "Juego creativo", "Deberes"],
	},
	{
		lugar: "Familia Ruiz (Nervión)",
		periodo: "Junio - Agosto 2024",
		descripcion:
			"Canguro nocturno y fines de semana para una niña de 5 años. Lectura guiada, relajación y acompañamiento emocional.",
		focos: ["Nocturno", "Sueño", "Lectura"],
	},
	{
		lugar: "Familia López (Los Remedios)",
		periodo: "Septiembre - Noviembre 2024",
		descripcion:
			"Cuidado de un bebé de 10 meses. Estimulación temprana, observación de hitos y apoyo doméstico ligero.",
		focos: ["Bebés", "Estimulación", "Apoyo hogar"],
	},
	{
		lugar: "Familia Torres (Macarena)",
		periodo: "Diciembre 2024 - Febrero 2025",
		descripcion:
			"Tardes y recogida del cole para dos niños (6 y 8). Actividades lúdicas y socialización en exterior.",
		focos: ["Cole", "Parque", "Social"],
	},
];

const familiares = [
	"Primos pequeños (2 y 4 años) en reuniones prolongadas.",
	"Sobrina de 6 años en vacaciones escolares.",
	"Hijos de amigos en eventos y celebraciones.",
];

export default function Experience() {
	const [current, setCurrent] = useState(0);
	const exp = experiences[current];

	const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
	const goNext = () => setCurrent((c) => Math.min(experiences.length - 1, c + 1));

	// Navegación con teclado
	const handleKey = useCallback((e: KeyboardEvent) => {
		if (e.key === "ArrowLeft") goPrev();
		if (e.key === "ArrowRight") goNext();
	}, []);
	useEffect(() => {
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [handleKey]);

	return (
		<section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
			<Helmet>
				<title>Experiencia | Lucero — Cuidadora en Sevilla</title>
				<meta
					name="description"
					content="Casos reales, edades y tareas realizadas. Más de 3 meses en cada familia y cuidado de familiares y amigos."
				/>
				<link rel="canonical" href={window.location.href} />
			</Helmet>

			<div className="w-full max-w-5xl grid gap-10">
				<header className="text-center space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
						Experiencia
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
						Más de{" "}
						<strong className="text-foreground">3 meses continuados</strong> con
						cada familia, adaptándome a edades, ritmos y necesidades. Cuidado
						cercano también de familiares y amigos.
					</p>
				</header>

				{/* Carrusel */}
				<div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
					<div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.6),transparent_60%)]" />
					<div className="flex items-center gap-4 relative z-10">
						<button
							className="btn-gradient w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed focus-ring-vivid"
							onClick={goPrev}
							disabled={current === 0}
							aria-label="Anterior experiencia"
							type="button"
						>
							←
						</button>

						<div className="flex-1">
							<div className="transition-all">
								<div className="rounded-xl bg-white/65 dark:bg-white/10 backdrop-blur border border-white/40 dark:border-white/10 p-6 md:p-7 shadow-sm">
									<h2 className="font-heading text-xl md:text-2xl font-semibold mb-1 text-primary text-center">
										{exp.lugar}
									</h2>
									<div className="flex flex-wrap gap-2 justify-center mb-3">
										{exp.focos.map((f) => (
											<span
												key={f}
												className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/30 backdrop-blur"
											>
												{f}
											</span>
										))}
									</div>
									<p className="text-xs uppercase tracking-wide text-primary/70 text-center mb-3 font-medium">
										{exp.periodo}
									</p>
									<p className="text-sm text-center text-muted-foreground leading-relaxed">
										{exp.descripcion}
									</p>
								</div>
							</div>
							{/* Barra de progreso */}
							<div className="mt-6 flex items-center gap-3">
								<div className="flex-1 h-1 rounded bg-primary/15 overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-primary to-accent transition-all"
										style={{
											width: `${((current + 1) / experiences.length) * 100}%`,
										}}
									/>
								</div>
								<span className="text-xs font-medium text-muted-foreground tabular-nums">
									{current + 1}/{experiences.length}
								</span>
							</div>
							{/* Dots */}
							<div className="flex justify-center gap-2 mt-4">
								{experiences.map((_, idx) => (
									<button
										key={idx}
										type="button"
										onClick={() => setCurrent(idx)}
										aria-label={`Ir a experiencia ${idx + 1}`}
										className={`w-3 h-3 rounded-full transition-all ${
											current === idx
												? "bg-primary scale-110 shadow"
												: "bg-primary/30 hover:bg-primary/50"
										}`}
									/>
								))}
							</div>
						</div>

						<button
							className="btn-gradient w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed focus-ring-vivid"
							onClick={goNext}
							disabled={current === experiences.length - 1}
							aria-label="Siguiente experiencia"
							type="button"
						>
							→
						</button>
					</div>
				</div>

				{/* Familiares y amigos */}
				<div className="glass-card rounded-2xl p-6 md:p-8 grid gap-5">
					<h3 className="text-lg font-semibold underline-fx text-center">
						Cuidado de familiares y amigos
					</h3>
					<ul className="grid gap-3 text-sm text-muted-foreground">
						{familiares.map((txt, i) => (
							<li key={i} className="flex gap-3">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary shadow" />
								<span>{txt}</span>
							</li>
						))}
					</ul>
					<div className="text-center text-xs text-muted-foreground">
						Referencias disponibles bajo solicitud.
					</div>
				</div>
			</div>
		</section>
	);
}
