import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody } from "@/components/alkan-app/ui/Card";
import { Badge } from "@/components/alkan-app/ui/Badge";

export const Route = createFileRoute("/app/_authenticated/bot-panel")({
  component: BotPanelPage,
  head: () => ({ meta: [{ title: "Bot Panel · Alkan Platform" }] }),
});

function BotPanelPage() {
  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <div className="alkan-eyebrow mb-1">Módulo · 02</div>
        <h1 className="alkan-h1">Bot Panel</h1>
      </header>
      <Card accent="alkan">
        <CardBody>
          <Badge tone="alkan">Fase D</Badge>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            Dashboard de clientes, citas, aprobaciones de pago y tracker del 4%.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}