import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody } from "@/components/alkan-app/ui/Card";
import { Badge } from "@/components/alkan-app/ui/Badge";

export const Route = createFileRoute("/app/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Configuración · Alkan Platform" }] }),
});

function SettingsPage() {
  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <div className="alkan-eyebrow mb-1">Módulo · 03</div>
        <h1 className="alkan-h1">Configuración</h1>
      </header>
      <Card>
        <CardBody>
          <Badge tone="neutral">Fase D</Badge>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            API keys, perfil del equipo, mensaje de bienvenida del bot, test de conexión.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}