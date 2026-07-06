import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  MoreHorizontal,
  Plus,
  Search,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CountryCodeSelect, COUNTRIES, type Country } from "@/components/auth/CountryCodeSelect";
import { orgsStore, useOrgs, type Organization } from "@/lib/orgs-store";
import { formatRelative } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin — Orbit AI" },
      { name: "description", content: "Manage organizations and directors." },
      { property: "og:title", content: "Admin — Orbit AI" },
      { property: "og:description", content: "Manage organizations and directors." },
    ],
  }),
  component: AdminIndex,
});

function AdminIndex() {
  const orgs = useOrgs();
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = orgs.filter((o) => {
    const t = query.toLowerCase();
    return (
      o.name.toLowerCase().includes(t) ||
      o.directors.some((d) => d.name.toLowerCase().includes(t))
    );
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
            Organizations
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create organizations and assign managing directors to each.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="h-10 gap-2 self-start sm:self-auto">
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

      <CreateOrgDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(o) => {
          orgsStore.add(o);
          toast.success("Organization created", { description: `${o.name} is ready to go.` });
          setCreateOpen(false);
        }}
      />
    </main>
  );
}

function OrgCard({ org }: { org: Organization }) {
  const lead = org.directors[0];
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
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
            <DropdownMenuItem asChild>
              <Link to="/admin/$orgId" params={{ orgId: org.id }}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        to="/admin/$orgId"
        params={{ orgId: org.id }}
        className="mt-4 outline-none focus-visible:underline"
      >
        <h3 className="font-display text-lg font-normal leading-tight">{org.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Created {formatRelative(org.createdAt)}
        </p>
      </Link>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Managing directors
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm">
              {lead ? lead.name : <span className="text-muted-foreground">None assigned</span>}
            </p>
            {lead ? (
              <p className="truncate text-xs text-muted-foreground">
                {lead.dial} {lead.phone}
              </p>
            ) : null}
          </div>
          <div className="shrink-0 text-xs text-muted-foreground">
            {org.directors.length > 1 ? `+${org.directors.length - 1} more` : null}
          </div>
        </div>
      </div>

      <Link
        to="/admin/$orgId"
        params={{ orgId: org.id }}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        Manage <ArrowRight className="size-3" />
      </Link>
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
      createdAt: Date.now(),
      directors: [
        {
          id: crypto.randomUUID(),
          name: director.trim(),
          dial: country.dial,
          phone: phone.trim(),
          role: "Managing Director",
        },
      ],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light">New organization</DialogTitle>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10">
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
