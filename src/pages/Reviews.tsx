import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const staticReviews = [
	{
		name: "Ana García — Triana",
		rating: 5,
		text: "Cuidadora es muy responsable y cariñosa. Mis hijos la adoran y siempre están deseando que vuelva.",
	},
	{
		name: "Carlos Ruiz — Nervión",
		rating: 4,
		text: "Muy atenta en las noches y fines de semana. Mi hija se siente segura y feliz con ella.",
	},
	{
		name: "María López — Los Remedios",
		rating: 5,
		text: "Gran dedicación y formación en primeros auxilios. Confianza total para cuidar a nuestro bebé.",
	},
	{
		name: "Sofía Torres — Macarena",
		rating: 5,
		text: "Siempre propone actividades divertidas y educativas. Muy recomendable para familias.",
	},
	{
		name: "Familia Amiga — Sevilla",
		rating: 4,
		text: "Ha cuidado a los hijos de nuestros amigos varias veces. Trato excelente y mucha paciencia.",
	},
];

function Stars({ n }: { n: number }) {
	return (
		<div className="flex gap-0.5 text-sm justify-center md:justify-start">
			{Array.from({ length: 5 }).map((_, i) => (
				<span
					key={i}
					className={
						i < n
							? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]"
							: "text-gray-300 dark:text-gray-600"
					}
				>
					★
				</span>
			))}
		</div>
	);
}

export default function Reviews() {
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [rating, setRating] = useState(5);
	const [form, setForm] = useState({ name: "", comment: "" });
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	return (
		<section className="app-gradient-bg min-h-screen py-14 px-4 flex flex-col items-center w-full">
			<Helmet>
				<title>Referencias | Cuidadora — Cuidadora en Sevilla</title>
				<meta
					name="description"
					content="Reseñas verificadas de familias. Deja tu referencia (moderación antes de publicar)."
				/>
				<link rel="canonical" href={window.location.href} />
			</Helmet>

			<div className="w-full max-w-5xl grid gap-10">
				<header className="text-center space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text animate-float">
						Referencias
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
						Opiniones de familias y cuidadores. Puedes enviar la tuya; se revisará
						antes de publicarse.
					</p>
				</header>

				<div className="grid md:grid-cols-3 gap-6">
					{/* Listado de reseñas */}
					<div className="md:col-span-2 grid gap-5">
						{staticReviews.map((r, i) => (
							<article
								key={i}
								className="relative glass-card rounded-2xl p-5 md:p-6 overflow-hidden"
							>
								<div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.6),transparent_60%)]" />
								<div className="relative z-10 space-y-2">
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
										<h2 className="font-semibold text-sm md:text-base text-foreground">
											{r.name}
										</h2>
										<Stars n={r.rating} />
									</div>
									<p className="text-muted-foreground text-sm leading-relaxed">
										“{r.text}”
									</p>
								</div>
							</article>
						))}
					</div>

					{/* Formulario */}
					<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col gap-4 h-fit">
						<h2 className="text-lg font-semibold underline-fx">
							Dejar una referencia
						</h2>

						{submitted ? (
							<div className="text-center text-green-600 text-sm">
								¡Gracias! Tu reseña está pendiente de moderación.
							</div>
						) : (
							<form
								className="grid gap-4"
								onSubmit={async (e) => {
									e.preventDefault();
									setError(null);
									setSuccess(null);
									setLoading(true);
									try {
										const { error: insertError } = await supabase
											.from("reviews")
											.insert({
												// Ajusta claves reales
												booking_id: null,
												name: form.name.trim(),
												rating,
												comment: form.comment.trim(),
												is_approved: false,
											});
										if (insertError) {
											setError(insertError.message || "Error al enviar.");
										} else {
											setSubmitted(true);
											setSuccess("Enviado. Gracias por tu tiempo.");
										}
									} finally {
										setLoading(false);
									}
								}}
							>
								<div className="grid gap-1">
									<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
										Nombre
									</label>
									<input
										required
										className="input-modern"
										value={form.name}
										onChange={(e) =>
											setForm({ ...form, name: e.target.value })
										}
										placeholder="Tu nombre o familia"
									/>
								</div>

								<div className="grid gap-1">
									<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
										Valoración
									</label>
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((n) => (
												<button
													key={n}
													type="button"
													onClick={() => setRating(n)}
													className={`w-9 h-9 rounded-full text-sm font-medium transition
                            ${
															n <= rating
																? "bg-yellow-400 text-gray-900 shadow"
																: "bg-white/50 dark:bg-white/10 text-gray-500"
														} hover:scale-105`}
													aria-label={`Puntuar ${n} estrellas`}
												>
													{n <= rating ? "★" : "☆"}
												</button>
											))}
										</div>
										<span className="text-xs text-muted-foreground">
											{rating}/5
										</span>
									</div>
								</div>

								<div className="grid gap-1">
									<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
										Comentario
									</label>
									<textarea
										required
										rows={5}
										className="input-modern resize-none"
										value={form.comment}
										onChange={(e) =>
											setForm({ ...form, comment: e.target.value })
										}
										placeholder="Describe tu experiencia..."
									/>
								</div>

								{error && (
									<div className="text-red-500 text-xs">{error}</div>
								)}
								{success && (
									<div className="text-green-600 text-xs">{success}</div>
								)}

								<button
									type="submit"
									disabled={loading}
									className="btn-gradient rounded-xl px-5 py-3 font-semibold shadow-md focus-ring-vivid disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? "Enviando..." : "Enviar reseña"}
								</button>

								<p className="text-[10px] text-center text-muted-foreground">
									Se revisará antes de mostrarse públicamente.
								</p>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
