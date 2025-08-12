import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  return (
    <section className="py-10">
      <Helmet>
        <title>Panel | Lucero — Cuidadora en Sevilla</title>
        <meta name="description" content="Panel privado para gestionar calendario, reservas y reseñas (requiere Supabase)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <h1 className="font-heading text-3xl mb-4">Panel de Lucero</h1>
      <p className="text-muted-foreground">Aquí podrás aprobar reservas, moderar reseñas y gestionar disponibilidad cuando conectemos Supabase.</p>
    </section>
  );
}
