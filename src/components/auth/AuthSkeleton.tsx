export function AuthSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-center px-6 pt-8 sm:pt-10">
        <Shimmer className="h-6 w-24 rounded-md" />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex flex-col items-center gap-3 sm:mb-10">
            <Shimmer className="h-9 w-3/4 rounded-md" />
            <Shimmer className="h-4 w-2/3 rounded-md" />
          </div>
          <div className="flex flex-col gap-4">
            <Shimmer className="h-4 w-20 rounded-md" />
            <div className="flex gap-2">
              <Shimmer className="h-11 w-24 rounded-md" />
              <Shimmer className="h-11 flex-1 rounded-md" />
            </div>
            <Shimmer className="mt-2 h-11 w-full rounded-md" />
            <div className="mt-4 flex justify-center">
              <Shimmer className="h-4 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-secondary ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
