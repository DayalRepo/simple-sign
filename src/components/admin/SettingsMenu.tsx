import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LogOut, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SettingsMenu() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("Alex Morgan");
  const [dial, setDial] = React.useState("+1");
  const [phone, setPhone] = React.useState("415 555 0100");
  const [editing, setEditing] = React.useState(false);
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSignOut = () => {
    toast.success("Signed out");
    navigate({ to: "/sign-in" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 rounded-full border border-border">
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
            {initials || "AD"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name || "Platform admin"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {dial} {phone}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        {!editing ? (
          <div className="p-2">
            <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setEditing(true);
              }}
            >
              <User className="size-4" />
              Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              Preferences
            </DropdownMenuItem>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-name" className="text-xs">
                Name
              </Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mobile number</Label>
              <div className="flex gap-2">
                <Input
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  className="h-9 w-16"
                />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 flex-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  toast.success("Profile updated");
                  setEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <DropdownMenuSeparator className="my-0" />

        <div className="p-2">
          <DropdownMenuItem
            onSelect={onSignOut}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
