import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/25 selection:text-foreground">
      <Header />
      <main
        className="flex-1 w-full px-4 md:px-6 pt-4 pb-16 mx-auto max-w-7xl animate-[fadeIn_.4s_ease]"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
