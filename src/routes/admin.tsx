import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SettingsMenu } from "@/components/admin/SettingsMenu";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight">Orbit AI</span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:inline">
              / Admin
            </span>
          </Link>
          <SettingsMenu />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
