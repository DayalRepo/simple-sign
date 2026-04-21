import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Lumen" },
      { name: "description", content: "Reset your Lumen account password." },
      { property: "og:title", content: "Reset your password — Lumen" },
      { property: "og:description", content: "Reset your Lumen account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email("Enter a valid email") });

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Check your inbox", {
      description: "We sent you a 6-digit verification code.",
    });
    navigate({ to: "/verify-otp", search: { flow: "reset" } });
  });

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a code to reset it."
      footer={
        <Link
          to="/sign-in"
          className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fp-email">Email</Label>
          <Input
            id="fp-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
          Send reset code
        </Button>
      </form>
    </AuthShell>
  );
}
