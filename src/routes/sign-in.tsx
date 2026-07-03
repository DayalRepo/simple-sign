import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSkeleton } from "@/components/auth/AuthSkeleton";
import {
  CountryCodeSelect,
  COUNTRIES,
  type Country,
} from "@/components/auth/CountryCodeSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Orbit AI" },
      { name: "description", content: "Sign in to your Orbit AI account." },
      { property: "og:title", content: "Sign in — Orbit AI" },
      { property: "og:description", content: "Sign in to your Orbit AI account." },
    ],
  }),
  component: SignInPage,
});

const schema = z.object({
  country: z.custom<Country>((v) => !!v && typeof (v as Country).dial === "string"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .regex(/^[0-9\s-]+$/, "Digits only"),
});

function SignInPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { country: COUNTRIES[0], phone: "" },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Code sent", { description: "Check your phone for a 6-digit code." });
    navigate({ to: "/verify-otp", search: { flow: "sign-in" } });
  });

  if (loading) return <AuthSkeleton />;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your phone number to continue"
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="si-phone">Phone number</Label>
          <div className="flex gap-2">
            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <CountryCodeSelect value={field.value} onChange={field.onChange} />
              )}
            />
            <Input
              id="si-phone"
              type="tel"
              inputMode="tel"
              placeholder="555 000 0000"
              autoComplete="tel"
              className="h-11 flex-1"
              {...form.register("phone")}
            />
          </div>
          {form.formState.errors.phone ? (
            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
          Send code
        </Button>
      </form>
    </AuthShell>
  );
}
