import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Minimalist authentication" },
      {
        name: "description",
        content: "A clean, editorial sign in & sign up experience.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-xl tracking-tight">Lumen</span>
        <Link
          to="/sign-in"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="max-w-xl text-center">
          <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Quietly
            <br />
            <em className="italic">considered</em> auth.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground sm:text-[17px]">
            A minimalist sign in and sign up experience. Email, phone, Google,
            Apple — with OTP verification and password recovery.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/sign-up"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Create an account
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lumen
      </footer>
    </div>
  );
}
