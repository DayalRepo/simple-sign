import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Search,
  Settings,
  LogOut,
  User,
  Phone,
  MoreHorizontal,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CountryCodeSelect, COUNTRIES, type Country } from "@/components/auth/CountryCodeSelect";

interface Organization {
  id: string;
  name: string;
  directorName: string;
  directorDial: string;
  directorPhone: string;
  createdAt: number;
}

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin — Orbit AI" },
      { name: "description", content: "Manage organizations and directors." },
      { property: "og:title", content: "Admin — Orbit AI" },
      { property: "og:description", content: "Manage organizations and directors." },
    ],
  }),
  component: AdminPage,
});

const seed: Organization[] = [
  {
    id: "seed-1",
    name: "Northwind Labs",
    directorName: "Ava Chen",
    directorDial: "+1",
    directorPhone: "415 555 0132",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "seed-2",
    name: "Helios Studio",
    directorName: "Marco Ruiz",
    directorDial: "+34",
    directorPhone: "612 47 88 21",
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = React.useState<Organization[]>(seed);
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.directorName.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSignOut = () => {
    toast.success("Signed out");
    navigate({ to: "/sign-in" });
  };

  const handleCreate = (org: Organization) => {
    setOrgs((prev) => [org, ...prev]);
    toast.success("Organization created", { description: `${org.name} is ready to go.` });
    setCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight">Orbit AI</span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:inline">
              / Admin
            </span>
          </div>

          <SettingsMenu onSignOut={handleSignOut} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
              Organizations
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create organizations and assign a managing director to each.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 gap-2 self-start sm:self-auto"
          >
            <Plus className="size-4" />
            New organization
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organizations or directors"
              className="h-10 pl-9"
            />
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Users className="size-4" />
            {orgs.length} total
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onCreate={() => setCreateOpen(true)} hasQuery={query.length > 0} />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>
        )}
      </main>

      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
    </div>
  );
}

function OrgCard({ org }: { org: Organization }) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border">
          <Building2 className="size-5" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="mt-4 font-display text-lg font-normal leading-tight">{org.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Created {formatRelative(org.createdAt)}
      </p>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Managing director
        </p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-3.5 text-muted-foreground" />
            <span>{org.directorName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-3.5" />
            <span>
              {org.directorDial} {org.directorPhone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreate, hasQuery }: { onCreate: () => void; hasQuery: boolean }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-border">
        <Building2 className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-display text-lg">
        {hasQuery ? "No matches" : "No organizations yet"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {hasQuery
          ? "Try a different name or director."
          : "Get started by creating your first organization."}
      </p>
      {!hasQuery && (
        <Button onClick={onCreate} className="mt-5 gap-2">
          <Plus className="size-4" />
          New organization
        </Button>
      )}
    </div>
  );
}

function CreateOrgDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (org: Organization) => void;
}) {
  const [name, setName] = React.useState("");
  const [director, setDirector] = React.useState("");
  const [country, setCountry] = React.useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setName("");
      setDirector("");
      setPhone("");
      setCountry(COUNTRIES[0]);
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !director.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      directorName: director.trim(),
      directorDial: country.dial,
      directorPhone: phone.trim(),
      createdAt: Date.now(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light">
            New organization
          </DialogTitle>
          <DialogDescription>
            Add an organization and assign its managing director.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Managing director</Label>
            <Input
              id="director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="Full name"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <div className="flex gap-2">
              <CountryCodeSelect value={country} onChange={setCountry} />
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555 000 1234"
                className="h-10 flex-1"
              />
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10">
              Create organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SettingsMenu({ onSignOut }: { onSignOut: () => void }) {
  // Frontend-only demo profile
  const [name, setName] = React.useState("Alex Morgan");
  const [dial, setDial] = React.useState("+1");
  const [phone, setPhone] = React.useState("415 555 0100");
  const [editing, setEditing] = React.useState(false);
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 rounded-full border border-border">
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
            {initials || "AD"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name || "Platform admin"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {dial} {phone}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        {!editing ? (
          <div className="p-2">
            <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditing(true); }}>
              <User className="size-4" />
              Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              Preferences
            </DropdownMenuItem>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-name" className="text-xs">
                Name
              </Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mobile number</Label>
              <div className="flex gap-2">
                <Input
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  className="h-9 w-16"
                />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 flex-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  toast.success("Profile updated");
                  setEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <DropdownMenuSeparator className="my-0" />

        <div className="p-2">
          <DropdownMenuItem
            onSelect={onSignOut}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
