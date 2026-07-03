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

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create your account — Orbit AI" },
      { name: "description", content: "Create your Orbit AI account in seconds." },
      { property: "og:title", content: "Create your account — Orbit AI" },
      { property: "og:description", content: "Create your Orbit AI account in seconds." },
    ],
  }),
  component: SignUpPage,
});

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  country: z.custom<Country>((v) => !!v && typeof (v as Country).dial === "string"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .regex(/^[0-9\s-]+$/, "Digits only"),
});

function SignUpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", country: COUNTRIES[0], phone: "" },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Code sent", { description: "Check your phone for a 6-digit code." });
    navigate({ to: "/verify-otp", search: { flow: "sign-up" } });
  });

  if (loading) return <AuthSkeleton />;

  return (
    <AuthShell
      title="Create your account"
      subtitle="A minute is all it takes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="su-name">Full name</Label>
          <Input
            id="su-name"
            placeholder="Jane Doe"
            autoComplete="name"
            className="h-11"
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="su-phone">Phone number</Label>
          <div className="flex gap-2">
            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <CountryCodeSelect value={field.value} onChange={field.onChange} />
              )}
            />
            <Input
              id="su-phone"
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

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline-offset-4 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline-offset-4 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </AuthShell>
  );
}
