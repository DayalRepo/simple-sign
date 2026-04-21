export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="relative my-6 flex items-center">
      <div className="h-px flex-1 bg-border" />
      <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
