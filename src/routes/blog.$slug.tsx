import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { Nav } from "@/components/site/Nav";
import { getBlogPost } from "@/lib/blog.functions";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const res = await getBlogPost({ data: { slug: params.slug } });
    if (!res.post) throw notFound();
    return res;
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    const url = `https://alkanassistant.com/blog/${params.slug}`;
    if (!p) return { meta: [{ title: "Artículo · Alkan Assistant" }] };
    return {
      meta: [
        { title: `${p.title} · Alkan Assistant` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [
        { rel: "canonical", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.created_at,
            author: { "@type": "Organization", name: "Alkan Assistant" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Artículo no encontrado</h1>
        <Link to="/blog" className="underline" style={{ color: "var(--blue)" }}>
          ← Ver todos los artículos
        </Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Algo salió mal</h1>
        <p style={{ color: "var(--ink-soft)" }}>{error.message}</p>
      </div>
    </main>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  if (!post) return null;
  const date = new Date(post.created_at).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Nav />
      <article className="max-w-[760px] mx-auto px-6 pt-12 pb-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold mb-8 hover:opacity-70"
          style={{ color: "var(--blue)" }}
        >
          <ArrowLeft size={14} /> Volver al blog
        </Link>

        <div
          className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-4"
          style={{ color: "var(--gold)" }}
        >
          {post.category} · {post.read_minutes} min · {date}
        </div>
        <h1
          className="font-display text-4xl md:text-5xl leading-[1.05] mb-5"
          style={{ letterSpacing: "-0.025em", color: "var(--ink)" }}
        >
          <span className="mr-3">{post.cover_emoji}</span>
          {post.title}
        </h1>
        <p className="text-[17px] leading-relaxed mb-10" style={{ color: "var(--ink-soft)" }}>
          {post.excerpt}
        </p>

        <div className="prose-blog">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div
          className="mt-14 rounded-2xl p-7 text-center"
          style={{
            background: "var(--ink)",
            color: "#fff",
            boxShadow: "0 24px 60px -30px rgba(10,16,36,0.5)",
          }}
        >
          <div
            className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-2"
            style={{ color: "var(--gold)" }}
          >
            ¿Te ayudó este artículo?
          </div>
          <h3 className="font-display text-2xl mb-3">
            Yo manejo la oficina mientras tú trabajas la obra.
          </h3>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-[14px]"
            style={{ background: "var(--gold)", color: "var(--ink)" }}
          >
            Conoce Alkan Assistant →
          </Link>
        </div>
      </article>

      <style>{`
        .prose-blog { font-size: 16px; line-height: 1.75; color: var(--ink); }
        .prose-blog h2 { font-family: var(--font-display); font-size: 28px; margin: 36px 0 14px; letter-spacing: -0.02em; color: var(--ink); }
        .prose-blog h3 { font-family: var(--font-display); font-size: 21px; margin: 28px 0 10px; color: var(--ink); }
        .prose-blog p { margin: 0 0 16px; color: var(--ink-soft); }
        .prose-blog strong { color: var(--ink); font-weight: 600; }
        .prose-blog ul, .prose-blog ol { margin: 0 0 16px; padding-left: 22px; color: var(--ink-soft); }
        .prose-blog li { margin-bottom: 6px; }
        .prose-blog a { color: var(--blue); text-decoration: underline; text-underline-offset: 3px; }
        .prose-blog blockquote { border-left: 3px solid var(--gold); padding-left: 16px; margin: 20px 0; font-style: italic; color: var(--ink-soft); }
        .prose-blog code { background: rgba(15,31,61,0.06); padding: 2px 6px; border-radius: 4px; font-size: 14px; }
        .prose-blog hr { border: none; border-top: 1px solid rgba(15,31,61,0.1); margin: 28px 0; }
      `}</style>
    </main>
  );
}