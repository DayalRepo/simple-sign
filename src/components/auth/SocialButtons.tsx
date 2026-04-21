import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="!size-[18px]" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="!size-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 12.43c-.026-2.626 2.146-3.886 2.243-3.948-1.222-1.787-3.124-2.03-3.8-2.06-1.617-.164-3.156.953-3.977.953-.82 0-2.087-.93-3.434-.904-1.767.026-3.396 1.026-4.305 2.605-1.835 3.182-.47 7.886 1.318 10.466.875 1.262 1.918 2.682 3.286 2.63 1.32-.054 1.82-.852 3.418-.852 1.598 0 2.046.852 3.444.825 1.42-.027 2.32-1.288 3.187-2.557 1.005-1.466 1.42-2.886 1.446-2.96-.032-.013-2.776-1.067-2.826-4.198zM13.74 4.83c.726-.88 1.215-2.103 1.082-3.32-1.045.043-2.31.696-3.06 1.575-.673.778-1.262 2.02-1.103 3.215 1.166.09 2.355-.59 3.08-1.47z"
      />
    </svg>
  );
}

interface SocialButtonsProps {
  context?: "sign in" | "sign up";
}

export function SocialButtons({ context = "sign in" }: SocialButtonsProps) {
  const handle = (provider: string) => {
    toast.success(`${provider} ${context} (demo)`, {
      description: "Frontend only — no provider wired up.",
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-center gap-3 rounded-md border-border bg-background text-sm font-normal text-foreground hover:bg-secondary"
        onClick={() => handle("Google")}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-center gap-3 rounded-md border-border bg-background text-sm font-normal text-foreground hover:bg-secondary"
        onClick={() => handle("Apple")}
      >
        <AppleIcon />
        Continue with Apple
      </Button>
    </div>
  );
}
