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

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create your account — Lumen" },
      { name: "description", content: "Create your Lumen account in seconds." },
      { property: "og:title", content: "Create your account — Lumen" },
      { property: "og:description", content: "Create your Lumen account in seconds." },
    ],
  }),
  component: SignUpPage,
});

const emailSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const phoneSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  country: z.string().min(1),
  phone: z.string().min(6, "Enter a valid phone number"),
});

function SignUpPage() {
  const navigate = useNavigate();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { name: "", country: "+1", phone: "" },
  });

  const onEmail = emailForm.handleSubmit(() => {
    toast.success("Account created", { description: "Verify your email to continue." });
    navigate({ to: "/verify-otp", search: { flow: "sign-up" } });
  });

  const onPhone = phoneForm.handleSubmit(() => {
    toast.success("Code sent", { description: "Check your phone for a 6-digit code." });
    navigate({ to: "/verify-otp", search: { flow: "sign-up" } });
  });

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
      <SocialButtons context="sign up" />
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
              <Label htmlFor="su-name">Full name</Label>
              <Input
                id="su-name"
                placeholder="Jane Doe"
                autoComplete="name"
                className="h-11"
                {...emailForm.register("name")}
              />
              {emailForm.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email</Label>
              <Input
                id="su-email"
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
              <Label htmlFor="su-password">Password</Label>
              <PasswordInput
                id="su-password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                {...emailForm.register("password")}
              />
              {emailForm.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-confirm">Confirm password</Label>
              <PasswordInput
                id="su-confirm"
                placeholder="Repeat password"
                autoComplete="new-password"
                {...emailForm.register("confirm")}
              />
              {emailForm.formState.errors.confirm ? (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.confirm.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="mt-2 h-11 w-full text-sm font-medium">
              Create account
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone" className="mt-5">
          <form onSubmit={onPhone} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sup-name">Full name</Label>
              <Input
                id="sup-name"
                placeholder="Jane Doe"
                autoComplete="name"
                className="h-11"
                {...phoneForm.register("name")}
              />
              {phoneForm.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {phoneForm.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sup-phone">Phone number</Label>
              <div className="flex gap-2">
                <Input
                  className="h-11 w-20 text-center"
                  placeholder="+1"
                  {...phoneForm.register("country")}
                />
                <Input
                  id="sup-phone"
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
