import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Lumen" },
      { name: "description", content: "Choose a new password for your Lumen account." },
      { property: "og:title", content: "Set a new password — Lumen" },
      { property: "og:description", content: "Choose a new password for your Lumen account." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

function strength(pw: string) {
  if (!pw) return { label: "", value: 0 };
  if (pw.length < 8) return { label: "Too short", value: 1 };
  if (pw.length < 12) return { label: "Good", value: 2 };
  return { label: "Strong", value: 3 };
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const pw = form.watch("password");
  const s = strength(pw);

  const onSubmit = form.handleSubmit(() => {
    toast.success("Password updated", { description: "Sign in with your new password." });
    navigate({ to: "/sign-in" });
  });

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
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
          <Label htmlFor="rp-password">New password</Label>
          <PasswordInput
            id="rp-password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {pw ? (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= s.value ? "bg-foreground" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ) : null}
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rp-confirm">Confirm password</Label>
          <PasswordInput
            id="rp-confirm"
            placeholder="Repeat new password"
            autoComplete="new-password"
            {...form.register("confirm")}
          />
          {form.formState.errors.confirm ? (
            <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
