import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Check,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  X,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CountryCodeSelect, COUNTRIES, type Country } from "@/components/auth/CountryCodeSelect";
import {
  orgsStore,
  useOrg,
  type Director,
  type Organization,
} from "@/lib/orgs-store";
import { formatRelative } from "@/lib/format";

export const Route = createFileRoute("/admin/$orgId")({
  head: ({ params }) => ({
    meta: [
      { title: `Organization — Orbit AI` },
      { name: "description", content: `Manage directors for organization ${params.orgId}.` },
    ],
  }),
  component: OrgDetailPage,
  notFoundComponent: OrgNotFound,
});

function OrgNotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-border">
        <Building2 className="size-5 text-muted-foreground" />
      </div>
      <h1 className="mt-4 font-display text-2xl">Organization not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It may have been removed or the link is incorrect.
      </p>
      <Button asChild className="mt-6">
        <Link to="/admin">Back to organizations</Link>
      </Button>
    </main>
  );
}

function OrgDetailPage() {
  const { orgId } = Route.useParams();
  const org = useOrg(orgId);

  if (!org) return <OrgNotFound />;

  return <OrgDetail org={org} />;
}

function OrgDetail({ org }: { org: Organization }) {
  const navigate = useNavigate();
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(org.name);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Director | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Director | null>(null);

  React.useEffect(() => {
    setNameDraft(org.name);
  }, [org.name]);

  const saveName = () => {
    const v = nameDraft.trim();
    if (!v) {
      toast.error("Name can't be empty");
      return;
    }
    orgsStore.update(org.id, { name: v });
    toast.success("Organization renamed");
    setEditingName(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={() => navigate({ to: "/admin" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All organizations
      </button>

      <div className="mt-6 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border">
            <Building2 className="size-6" />
          </div>
          <div className="min-w-0">
            {editingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") {
                      setNameDraft(org.name);
                      setEditingName(false);
                    }
                  }}
                  className="h-10 w-full max-w-sm font-display text-2xl"
                />
                <Button size="icon" onClick={saveName} className="size-9">
                  <Check className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setNameDraft(org.name);
                    setEditingName(false);
                  }}
                  className="size-9"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
                  {org.name}
                </h1>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => setEditingName(true)}
                  aria-label="Rename organization"
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              Created {formatRelative(org.createdAt)} · {org.directors.length}{" "}
              {org.directors.length === 1 ? "director" : "directors"}
            </p>
          </div>
        </div>

        <Button onClick={() => setAddOpen(true)} className="h-10 gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          Add director
        </Button>
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-normal">Managing directors</h2>
          <p className="text-xs text-muted-foreground">
            {org.directors.length}{" "}
            {org.directors.length === 1 ? "person" : "people"}
          </p>
        </div>

        {org.directors.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-border">
              <User className="size-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg">No directors yet</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Add a managing director to give this organization a lead.
            </p>
            <Button onClick={() => setAddOpen(true)} className="mt-5 gap-2">
              <Plus className="size-4" />
              Add director
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {org.directors.map((d) => (
              <DirectorCard
                key={d.id}
                director={d}
                onEdit={() => setEditing(d)}
                onDelete={() => setConfirmDelete(d)}
              />
            ))}
          </div>
        )}
      </section>

      <DirectorDialog
        mode="add"
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(d) => {
          orgsStore.addDirector(org.id, d);
          toast.success("Director added");
          setAddOpen(false);
        }}
      />

      <DirectorDialog
        mode="edit"
        director={editing ?? undefined}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        onSubmit={(d) => {
          if (!editing) return;
          orgsStore.updateDirector(org.id, editing.id, d);
          toast.success("Director updated");
          setEditing(null);
        }}
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {confirmDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This director will no longer be assigned to {org.name}. You can add them back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmDelete) return;
                orgsStore.removeDirector(org.id, confirmDelete.id);
                toast.success("Director removed");
                setConfirmDelete(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function DirectorCard({
  director,
  onEdit,
  onDelete,
}: {
  director: Director;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = director.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{director.name}</p>
          {director.role ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {director.role}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="size-3" />
          <span className="truncate">
            {director.dial} {director.phone}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button size="icon" variant="ghost" className="size-8" onClick={onEdit} aria-label="Edit">
          <Pencil className="size-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-destructive hover:text-destructive"
          onClick={onDelete}
          aria-label="Remove"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function DirectorDialog({
  mode,
  director,
  open,
  onOpenChange,
  onSubmit,
}: {
  mode: "add" | "edit";
  director?: Director;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (d: Director) => void;
}) {
  const initialCountry = React.useMemo(
    () => COUNTRIES.find((c) => c.dial === director?.dial) ?? COUNTRIES[0],
    [director],
  );
  const [name, setName] = React.useState(director?.name ?? "");
  const [role, setRole] = React.useState(director?.role ?? "Managing Director");
  const [country, setCountry] = React.useState<Country>(initialCountry);
  const [phone, setPhone] = React.useState(director?.phone ?? "");

  React.useEffect(() => {
    if (open) {
      setName(director?.name ?? "");
      setRole(director?.role ?? "Managing Director");
      setCountry(
        COUNTRIES.find((c) => c.dial === director?.dial) ?? COUNTRIES[0],
      );
      setPhone(director?.phone ?? "");
    }
  }, [open, director]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and mobile are required");
      return;
    }
    onSubmit({
      id: director?.id ?? crypto.randomUUID(),
      name: name.trim(),
      role: role.trim() || undefined,
      dial: country.dial,
      phone: phone.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light">
            {mode === "add" ? "Add director" : "Edit director"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Assign a new managing director to this organization."
              : "Update this director's details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="d-name">Full name</Label>
            <Input
              id="d-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="d-role">Role</Label>
            <Input
              id="d-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Managing Director"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="d-phone">Mobile number</Label>
            <div className="flex gap-2">
              <CountryCodeSelect value={country} onChange={setCountry} />
              <Input
                id="d-phone"
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
              {mode === "add" ? "Add director" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
