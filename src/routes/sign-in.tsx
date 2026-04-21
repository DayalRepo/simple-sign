import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Divider } from "@/components/auth/Divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Lumen" },
      { name: "description", content: "Sign in to your Lumen account." },
      { property: "og:title", content: "Sign in — Lumen" },
      { property: "og:description", content: "Sign in to your Lumen account." },
    ],
  }),
  component: SignInPage,
});

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

const phoneSchema = z.object({
  country: z.string().min(1),
  phone: z.string().min(6, "Enter a valid phone number"),
});

function SignInPage() {
  const navigate = useNavigate();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "+1", phone: "" },
  });

  const onEmail = emailForm.handleSubmit(() => {
    toast.success("Welcome back");
  });

  const onPhone = phoneForm.handleSubmit(() => {
    toast.success("Code sent", { description: "Check your phone for a 6-digit code." });
    navigate({ to: "/verify-otp", search: { flow: "sign-in" } });
  });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your account"
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialButtons context="sign in" />
      <Divider />

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-2 rounded-md bg-secondary p-1">
          <TabsTrigger value="email" className="rounded-sm text-sm">
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="rounded-sm text-sm">
            Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-5">
          <form onSubmit={onEmail} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="si-email">Email</Label>
              <Input
                id="si-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email ? (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="si-password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="si-password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...emailForm.register("password")}
              />
              {emailForm.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
              Sign in
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone" className="mt-5">
          <form onSubmit={onPhone} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="si-phone">Phone number</Label>
              <div className="flex gap-2">
                <Input
                  className="h-11 w-20 text-center"
                  placeholder="+1"
                  {...phoneForm.register("country")}
                />
                <Input
                  id="si-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="555 000 0000"
                  autoComplete="tel"
                  className="h-11 flex-1"
                  {...phoneForm.register("phone")}
                />
              </div>
              {phoneForm.formState.errors.phone ? (
                <p className="text-xs text-destructive">
                  {phoneForm.formState.errors.phone.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
              Send code
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}
