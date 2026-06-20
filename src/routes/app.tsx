import { createFileRoute, Outlet } from "@tanstack/react-router";
import "@/styles/alkan-app.css";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AppShell() {
  return (
    <div className="alkan-app">
      <Outlet />
    </div>
  );
}