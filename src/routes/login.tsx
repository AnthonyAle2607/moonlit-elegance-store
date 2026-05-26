import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Acceso · Noir & Or" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email && password) {
        localStorage.setItem("mock_auth", "true");
        toast.success("Bienvenida de vuelta");
        navigate({ to: "/atelier-privado" });
      }
    } catch (err: unknown) {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-lg border border-border/60 bg-card/80 p-8 shadow-elegant">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary text-center">Acceso privado</p>
        <h1 className="mt-3 text-center font-serif text-3xl">Iniciar sesión</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Panel reservado para administración.
        </p>

        <form onSubmit={handle} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-input/50 px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-input/50 px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-3 text-xs uppercase tracking-[0.3em] text-primary-foreground hover:glow-ruby transition-all disabled:opacity-50"
          >
            {loading ? "..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
