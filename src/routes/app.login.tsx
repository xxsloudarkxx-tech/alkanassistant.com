import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/alkan-app/ui/Button";
import { Input } from "@/components/alkan-app/ui/Input";
import { Card, CardBody } from "@/components/alkan-app/ui/Card";

export const Route = createFileRoute("/app/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Acceso · Alkan Platform" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión, manda al dashboard
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/app", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      toast.error("No se pudo iniciar sesión");
      return;
    }
    toast.success("Bienvenido");
    navigate({ to: "/app", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center">
          <div className="alkan-eyebrow mb-2">Alkan Platform · Internal</div>
          <h1 className="alkan-h1">Inicia sesión</h1>
          <p
            style={{
              marginTop: 8,
              color: "var(--ink-muted)",
              fontSize: 13,
              fontFamily: "var(--font-sans)",
            }}
          >
            Acceso restringido al equipo Alkan.
          </p>
        </div>

        <Card accent="gold">
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="don.miguel@alkanassistant.com"
              />
              <Input
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error ?? undefined}
              />
              <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="mt-5 flex items-center justify-between">
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            ← Landing
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            v3 · Fase A
          </span>
        </div>
      </div>
    </div>
  );
}