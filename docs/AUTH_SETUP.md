# Google sign-in (Auth.js / NextAuth v5)

This app uses [Auth.js](https://authjs.dev/) with the Google provider. Follow these steps on **your** side, then run the app locally or deploy.

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. **APIs & Services → OAuth consent screen**
   - Choose **External** (or Internal if Workspace-only).
   - Fill app name, support email, developer contact.
   - Add scopes if prompted; for basic Google sign-in, `openid`, `email`, `profile` are typical.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**.
   - **Authorized JavaScript origins**
     - Local: `http://localhost:3000`
     - Production: `https://your-domain.com`
   - **Authorized redirect URIs** (must match Auth.js exactly)
     - Local: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`
4. Copy the **Client ID** and **Client secret**.

## 2. Environment variables

Create `.env.local` in the project root (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random secret used to sign cookies and tokens. Generate with `openssl rand -base64 32` or `npx auth secret` (if you use the Auth.js CLI). **Required in production.** |
| `AUTH_GOOGLE_ID` | Google OAuth **Client ID** |
| `AUTH_GOOGLE_SECRET` | Google OAuth **Client secret** |
| `AUTH_URL` | Optional. Full site URL, e.g. `http://localhost:3000` or `https://your-domain.com`. Helps when behind proxies or in some deploy setups. |

Auth.js also accepts legacy names: `NEXTAUTH_SECRET` / `NEXTAUTH_URL` (same roles).

## 3. Run locally

```bash
cp .env.example .env.local
# Edit .env.local with real values
npm run dev
```

Use **Sign in with Google** in the header. If Google credentials are missing, the button still appears but sign-in will not work until `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set.

## 4. Production / Vercel

- Add the same env vars in your host’s dashboard (e.g. Vercel → Project → Settings → Environment Variables).
- Update Google OAuth **Authorized JavaScript origins** and **redirect URIs** for your production URL.
- Set `AUTH_SECRET` to a strong random value; never commit it.

## 5. What’s scaffolded in the repo

- `auth.ts` — NextAuth config (Google provider when env is present).
- `app/api/auth/[...nextauth]/route.ts` — OAuth callback and session API routes.
- `components/providers.tsx` — `SessionProvider` + existing `DashboardProvider`.
- `components/auth-buttons.tsx` — Header **Sign in with Google** / **Sign out**.

You can later add **middleware** to protect routes (`auth()` / `middleware.ts`) and optional **database sessions** with an adapter.
