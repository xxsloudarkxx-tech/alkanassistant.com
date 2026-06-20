import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { generateBlogPost, listBlogPosts, type BlogPostListItem } from "@/lib/blog.functions";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlog,
  head: () => ({
    meta: [
      { title: "Blog · Admin · Alkan" },
      { name: "description", content: "Panel interno para gestionar artículos del blog de Alkan Assistant." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const SUGGESTED = [
  "Cómo registrar tu Reseller Permit en WA y dejar de pagar Sales Tax por materiales",
  "Qué es el W-8BEN y por qué te conviene como contratista mexicano trabajando con GCs en USA",
  "Cómo armar un bid ganador para un GC sin perder margen",
  "L&I para fence contractors: licencias, bond y errores comunes",
  "Marketing en Facebook para fence y landscaping en Pierce County con $50 al mes",
];

function AdminBlog() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const generate = useServerFn(generateBlogPost);
  const list = useServerFn(listBlogPosts);

  async function refresh() {
    const r = await list();
    setPosts(r.posts);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      if (!mounted) return;
      setIsAdmin(admin);
      setAuthChecked(true);
      if (admin) refresh();
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function onGenerate() {
    if (topic.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      await generate({ data: { topic: topic.trim() } });
      setTopic("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generando artículo");
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) return <div className="p-8">Cargando…</div>;
  if (!isAdmin)
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">No tienes acceso</h1>
        <p className="text-muted-foreground">Esta sección es solo para administradores.</p>
      </div>
    );

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl" style={{ color: "var(--ink)" }}>
            Blog con IA · Admin
          </h1>
          <Link to="/blog" className="text-sm underline" style={{ color: "var(--blue)" }}>
            Ver blog público →
          </Link>
        </div>

        <div
          className="rounded-2xl bg-white p-6 mb-8 border"
          style={{ borderColor: "rgba(15,31,61,0.10)" }}
        >
          <div
            className="inline-flex items-center gap-2 font-mono-brand text-[11px] uppercase tracking-[0.12em] mb-3"
            style={{ color: "var(--blue)" }}
          >
            <Sparkles size={13} /> Generar artículo nuevo
          </div>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="Tema del artículo (ej: cómo cobrar Sales Tax con Reseller Permit en WA)"
            className="w-full rounded-lg border p-3 text-[14px] resize-none"
            style={{ borderColor: "rgba(15,31,61,0.18)" }}
          />
          <button
            onClick={onGenerate}
            disabled={loading || topic.trim().length < 3}
            className="mt-3 w-full px-5 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ background: "var(--ink)" }}
          >
            {loading ? "Generando con IA (puede tardar 30s)…" : "Generar y publicar →"}
          </button>
          {error && <p className="text-[13px] mt-2" style={{ color: "#b91c1c" }}>{error}</p>}

          <div className="mt-5">
            <div className="text-[11.5px] uppercase tracking-wider mb-2" style={{ color: "var(--gray-soft)" }}>
              Ideas rápidas
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => setTopic(s)}
                  className="text-left text-[12.5px] px-3 py-1.5 rounded-full border"
                  style={{ borderColor: "rgba(15,31,61,0.15)", color: "var(--ink-soft)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="font-display text-xl mb-3" style={{ color: "var(--ink)" }}>
          Artículos publicados ({posts.length})
        </h2>
        <div className="space-y-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="flex items-center justify-between rounded-xl bg-white p-4 border"
              style={{ borderColor: "rgba(15,31,61,0.10)" }}
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--gold)" }}>
                  {p.category}
                </div>
                <div className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
                  {p.cover_emoji} {p.title}
                </div>
              </div>
              <ArrowRight size={16} style={{ color: "var(--blue)" }} />
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-[14px]" style={{ color: "var(--ink-soft)" }}>
              Aún no hay artículos. Genera el primero arriba ⬆️
            </p>
          )}
        </div>
      </div>
    </main>
  );
}