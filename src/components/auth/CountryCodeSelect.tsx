import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Country {
  name: string;
  code: string; // ISO
  dial: string; // +1
  flag: string; // emoji
}

export const COUNTRIES: Country[] = [
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dial: "+45", flag: "🇩🇰" },
  { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
  { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "UAE", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
];

interface Props {
  value: Country;
  onChange: (c: Country) => void;
}

export function CountryCodeSelect({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.dial.includes(t) ||
        c.code.toLowerCase().includes(t),
    );
  }, [q]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Select country code"
        >
          <span className="text-base leading-none">{value.flag}</span>
          <span className="tabular-nums">{value.dial}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0" sideOffset={6}>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search country or code"
            className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No matches
            </div>
          ) : (
            filtered.map((c) => {
              const selected = c.code === value.code && c.dial === value.dial;
              return (
                <button
                  key={`${c.code}-${c.dial}`}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setQ("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                    selected && "bg-secondary",
                  )}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">{c.dial}</span>
                  {selected ? <Check className="size-3.5" /> : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
