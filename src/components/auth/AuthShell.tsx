import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-center px-6 pt-8 sm:pt-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="font-display text-xl tracking-tight">Orbit AI</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="font-display text-3xl font-light leading-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>
            ) : null}
          </div>

          {children}

          {footer ? (
            <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
