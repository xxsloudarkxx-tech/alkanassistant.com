import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat")({
  component: ChatPlaceholder,
  head: () => ({
    meta: [
      { title: "Alkan Bot · Chat" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ChatPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <div className="alkan-eyebrow mb-2">Alkan Contractor Bot</div>
        <h1 className="alkan-h1">Próximamente</h1>
        <p style={{ marginTop: 10, color: "var(--ink-muted)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          El bot público se construirá en la Fase C. Esta ruta queda lista como acceso público
          (no requiere login).
        </p>
      </div>
    </div>
  );
}