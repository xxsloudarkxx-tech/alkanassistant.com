import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat/demo")({
  component: ChatDemoPlaceholder,
  head: () => ({
    meta: [
      { title: "Alkan Bot · Demo" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ChatDemoPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <div className="alkan-eyebrow mb-2">Demo pública</div>
        <h1 className="alkan-h1">Próximamente</h1>
        <p style={{ marginTop: 10, color: "var(--ink-muted)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          Versión demo del bot sin persistencia. Disponible en Fase C.
        </p>
      </div>
    </div>
  );
}