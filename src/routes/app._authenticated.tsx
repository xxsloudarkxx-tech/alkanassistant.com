import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/alkan-app/Sidebar";

export const Route = createFileRoute("/app/_authenticated")({
  beforeLoad: async ({ location }) => {
    // Guard: requiere sesión activa
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/app/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedShell,
});

function AuthenticatedShell() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/app/login", replace: true });
      } else {
        setEmail(session.user.email ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar userEmail={email} />
      <main
        className="flex-1 min-w-0"
        style={{ background: "var(--surface)", overflowX: "hidden" }}
      >
        <Outlet />
      </main>
    </div>
  );
}