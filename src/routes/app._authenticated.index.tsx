import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/alkan-app/ui/Card";
import { Badge } from "@/components/alkan-app/ui/Badge";

export const Route = createFileRoute("/app/_authenticated/")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard · Alkan Platform" }] }),
});

function DashboardPage() {
  return (
    <div className="px-8 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <div className="alkan-eyebrow mb-1">Consola · 00</div>
          <h1 className="alkan-h1">Dashboard</h1>
        </div>
        <Badge tone="gold">Fase A · Fundación</Badge>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card accent="gold">
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Sistema de diseño, autenticación y layout listos. Los módulos llegan en las
              siguientes fases.
            </p>
          </CardBody>
        </Card>

        <Card accent="alkan">
          <CardHeader>
            <CardTitle>Próximo</CardTitle>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Fase B — Lead Hunter: scraper Seattle DCI, scoring, drawer, EDMS.
            </p>
          </CardBody>
        </Card>

        <Card accent="green">
          <CardHeader>
            <CardTitle>Estado</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="alkan-kpi">3 / 21</div>
            <p style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>
              pasos completos de la spec
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}