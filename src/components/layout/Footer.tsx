export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto py-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-heading text-lg">Lucero Rodriguez Morales</p>
          <p className="text-muted-foreground">Cuidadora infantil en Sevilla</p>
        </div>
        <div className="flex items-center gap-4 md:justify-end">
          <a href="tel:+34999999999" className="underline text-primary">Llamar</a>
          <a href="https://wa.me/34999999999" target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Lucero. Todos los derechos reservados.
      </div>
    </footer>
  );
}
