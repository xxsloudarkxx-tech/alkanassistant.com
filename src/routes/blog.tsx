import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/site/Nav";
import { listBlogPosts, type BlogPostListItem } from "@/lib/blog.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog para contratistas en WA · Alkan Assistant" },
      {
        name: "description",
        content:
          "Guías prácticas para contratistas latinos en Washington: L&I, W-8BEN, bids, Sales Tax, marketing y herramientas con IA.",
      },
      { property: "og:title", content: "Blog para contratistas en WA · Alkan Assistant" },
      {
        property: "og:description",
        content:
          "Guías prácticas para contratistas latinos en Washington: L&I, W-8BEN, bids, Sales Tax y más.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://alkanassistant.com/blog" },
    ],
    links: [
      { rel: "canonical", href: "https://alkanassistant.com/blog" },
    ],
  }),
});

function BlogIndex() {
  const list = useServerFn(listBlogPosts);
  const [posts, setPosts] = useState<BlogPostListItem[] | null>(null);

  useEffect(() => {
    list().then((r) => setPosts(r.posts)).catch(() => setPosts([]));
  }, [list]);

  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Nav />
      <section className="px-6 pt-14 pb-10 max-w-[1100px] mx-auto">
        <div
          className="inline-flex items-center gap-2 font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-4"
          style={{ color: "var(--blue)" }}
        >
          <Sparkles size={13} /> Blog · Escrito con IA, curado por Alkan
        </div>
        <h1
          className="font-display text-4xl md:text-6xl leading-[1.02]"
          style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
        >
          Guías para contratistas{" "}
          <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
            en Washington State
          </em>
        </h1>
        <p className="mt-5 max-w-[640px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
          L&I, permisos, W-8BEN, Sales Tax, bids, marketing y trucos con IA — todo lo que necesitas
          para crecer tu operación sin atorarte en papeleo.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-[1100px] mx-auto">
        {posts === null && (
          <div className="text-center py-16" style={{ color: "var(--ink-soft)" }}>
            Cargando artículos…
          </div>
        )}
        {posts !== null && posts.length === 0 && (
          <div
            className="rounded-2xl border-2 border-dashed p-12 text-center"
            style={{ borderColor: "rgba(15,31,61,0.15)", color: "var(--ink-soft)" }}
          >
            <div className="text-5xl mb-3">📝</div>
            <p className="text-[15px]">Pronto publicaremos el primer artículo.</p>
          </div>
        )}
        {posts !== null && posts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="block rounded-2xl border bg-white p-6 hover:-translate-y-0.5 transition"
                style={{
                  borderColor: "rgba(15,31,61,0.10)",
                  boxShadow: "0 18px 40px -28px rgba(10,16,36,0.3)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-[28px]"
                    style={{ background: "var(--bg-2)" }}
                  >
                    {p.cover_emoji}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] mb-1.5"
                      style={{ color: "var(--gold)" }}
                    >
                      {p.category} · {p.read_minutes} min
                    </div>
                    <h2
                      className="font-display text-[20px] leading-tight mb-2"
                      style={{ color: "var(--ink)" }}
                    >
                      {p.title}
                    </h2>
                    <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                      {p.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}