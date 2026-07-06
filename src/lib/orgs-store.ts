import * as React from "react";

export interface Director {
  id: string;
  name: string;
  dial: string;
  phone: string;
  role?: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: number;
  directors: Director[];
}

const listeners = new Set<() => void>();
let orgs: Organization[] = [
  {
    id: "seed-1",
    name: "Northwind Labs",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    directors: [
      { id: "d1", name: "Ava Chen", dial: "+1", phone: "415 555 0132", role: "CEO" },
    ],
  },
  {
    id: "seed-2",
    name: "Helios Studio",
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    directors: [
      { id: "d2", name: "Marco Ruiz", dial: "+34", phone: "612 47 88 21", role: "Managing Director" },
    ],
  },
];

const emit = () => listeners.forEach((l) => l());

export const orgsStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getAll() {
    return orgs;
  },
  get(id: string) {
    return orgs.find((o) => o.id === id);
  },
  add(org: Organization) {
    orgs = [org, ...orgs];
    emit();
  },
  update(id: string, patch: Partial<Omit<Organization, "id">>) {
    orgs = orgs.map((o) => (o.id === id ? { ...o, ...patch } : o));
    emit();
  },
  addDirector(orgId: string, director: Director) {
    orgs = orgs.map((o) =>
      o.id === orgId ? { ...o, directors: [...o.directors, director] } : o,
    );
    emit();
  },
  updateDirector(orgId: string, directorId: string, patch: Partial<Omit<Director, "id">>) {
    orgs = orgs.map((o) =>
      o.id === orgId
        ? {
            ...o,
            directors: o.directors.map((d) =>
              d.id === directorId ? { ...d, ...patch } : d,
            ),
          }
        : o,
    );
    emit();
  },
  removeDirector(orgId: string, directorId: string) {
    orgs = orgs.map((o) =>
      o.id === orgId ? { ...o, directors: o.directors.filter((d) => d.id !== directorId) } : o,
    );
    emit();
  },
};

export function useOrgs() {
  return React.useSyncExternalStore(
    orgsStore.subscribe,
    orgsStore.getAll,
    orgsStore.getAll,
  );
}

export function useOrg(id: string) {
  const all = useOrgs();
  return all.find((o) => o.id === id);
}
