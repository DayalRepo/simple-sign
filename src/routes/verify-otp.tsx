import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSkeleton } from "@/components/auth/AuthSkeleton";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const searchSchema = z.object({
  flow: z.enum(["sign-in", "sign-up"]).optional().default("sign-in"),
});

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify your code — Orbit AI" },
      { name: "description", content: "Enter the 6-digit verification code we sent you." },
      { property: "og:title", content: "Verify your code — Orbit AI" },
      {
        property: "og:description",
        content: "Enter the 6-digit verification code we sent you.",
      },
    ],
  }),
  validateSearch: (search) => searchSchema.parse(search),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const navigate = useNavigate();
  const [code, setCode] = React.useState("");
  const [cooldown, setCooldown] = React.useState(30);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    toast.success("You're verified", { description: "Welcome to Orbit AI." });
    navigate({ to: "/admin" });
  };

  const resend = () => {
    if (cooldown > 0) return;
    toast.success("New code sent");
    setCooldown(30);
  };

  if (loading) return <AuthSkeleton />;

  return (
    <AuthShell
      title="Enter verification code"
      subtitle="We sent a 6-digit code to your phone. It expires in 10 minutes."
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
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-10 rounded-md border border-input text-base font-medium sm:h-14 sm:w-12 sm:text-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="h-11 w-full text-sm font-medium">
          Verify
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't get a code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
