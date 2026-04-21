# Minimalist Auth Flow — Frontend Only

A pure black & white, editorial-feeling auth experience using **Fraunces** (serif headings) and **Outfit** (sans body). Frontend only — no backend wiring. All submit actions show success toasts and navigate to the next step.

## Design system

- **Palette**: pure white background `#FFFFFF`, near-black text `#0A0A0A`, hairline borders `#E5E5E5`, muted text `#737373`
- **Typography**: Fraunces (display, light/regular, slight optical size) for h1/h2; Outfit (300/400/500) for body, labels, buttons
- **Components**: shadcn `Button`, `Input`, `Label`, `Tabs`, `InputOTP`, `Separator`, `Sonner` toasts
- **Layout**: centered single-column card, max-width ~400px, generous whitespace, hairline dividers, no shadows, subtle rounded-md corners
- **Buttons**: full-width black primary; outlined secondary for social providers with brand glyphs

## Routes (separate pages)

1. `**/sign-in**` — Sign in page
  - Tagline: "Welcome back"
  - Tabs: **Email | Phone**
    - Email tab: email + password fields, "Forgot password?" link
    - Phone tab: country code + phone field, "Send code" → goes to `/verify-otp`
  - Social row: **Continue with Google** · **Continue with Apple** (outlined, with icons)
  - Footer link: "New here? Create an account" → `/sign-up`
2. `**/sign-up**` — Sign up page
  - Tagline: "Create your account"
  - Tabs: **Email | Phone**
    - Email tab: name, email, password, confirm password
    - Phone tab: name, country code + phone → "Send code" → `/verify-otp`
  - Social row: Google + Apple
  - Tiny terms line; footer link: "Already have an account? Sign in"
3. `**/forgot-password**` — Request reset
  - Tagline: "Reset your password"
  - Single email input → "Send reset link" → toast + navigate to `/verify-otp`
  - Back to sign in link
4. `**/verify-otp**` — OTP verification
  - Tagline: "Enter verification code"
  - Helper text: "We sent a 6-digit code to your email/phone"
  - shadcn **InputOTP** (6 boxed slots)
  - "Verify" button → navigate to `/reset-password` (if reset flow) or `/sign-in` (if signup/phone)
  - "Resend code" with 30s cooldown timer
  - Back link
5. `**/reset-password**` — Set new password
  - New password + confirm fields with show/hide toggle
  - Lightweight strength hint (length only, minimal)
  - "Update password" → toast + navigate to `/sign-in`

## Shared pieces

- `**AuthShell**` component: centered layout, small wordmark at top, page heading in Fraunces, subhead in Outfit muted
- `**SocialButtons**` component: Google + Apple outlined buttons with inline SVG icons
- `**PasswordInput**` component: input with eye toggle
- Form validation via `react-hook-form` + `zod` (inline error text under fields)
- Sonner toasts for "Code sent", "Password updated", etc.
- Index route (`/`) replaced with a minimal landing that links to `/sign-in` and `/sign-up`
- Fonts loaded via Google Fonts `<link>` in `__root.tsx` head, wired into Tailwind via CSS vars (`--font-display: Fraunces`, `--font-sans: Outfit`)

## Out of scope

- No actual auth backend, no Supabase, no real OTP sending — all actions are simulated with toasts + navigation
- No session persistence, no protected routes

&nbsp;

Make it r5esponsive for all type screens like desktop, mobile, tabs, laptop etc..