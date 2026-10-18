# Deploying the webapp (Vercel)

The Expo app now ships two ways: the iOS/Android app (unchanged), and this same codebase's
web output as a full interactive webapp (compose, claim, shelf, open) on Vercel. See
`DECISIONS.md`'s "Web deployment" section for why it's built this way, in particular why the
shared `/l/<token>` links keep pointing at the Supabase `link-page` function (crawler-correct
previews) rather than straight at this webapp.

This file is instructions for the owner. The two dashboard steps below (connect the repo,
add the DNS records Vercel gives you) can't be done from this session: the sandbox's network
policy blocks `vercel.com`/`api.vercel.com` outright, confirmed directly, so no Vercel API
token would help either. Both steps are standard, low-risk dashboard actions that don't
involve handing anyone a credential.

## 1. Connect the repo to Vercel

1. In the Vercel dashboard: **Add New... > Project**, then **Import** this GitHub repository
   (`jfborg/timerforbilling`, or wherever it lives by the time this is done).
2. Vercel should detect `vercel.json` and use its `buildCommand`
   (`npx expo export --platform web`) and `outputDirectory` (`dist`) automatically. If it
   offers a framework preset, "Other" is correct; don't let it override the build command.
3. Before the first deploy, add these two environment variables (Project Settings >
   Environment Variables), once a Supabase project exists (`supabase/README.md`):
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

   Without them the site deploys and renders fine, just in the same "not configured" state
   already visible in local dev without a `.env` file.
4. Deploy. Every push to the branch Vercel is watching redeploys automatically from then on;
   nothing further to do here.

## 2. Point a domain at it (once one is chosen)

1. In the Vercel project: **Settings > Domains**, add the subdomain this app should live at,
   e.g. `app.<your-domain>` (matching `constants/brand.json`'s `webAppUrl`, which needs
   updating to the real value once this is decided; it's a placeholder right now).
2. Vercel shows the exact DNS record to add (typically a `CNAME` for a subdomain, pointing at
   `cname.vercel-dns.com`). Add that record in GoDaddy's DNS management page for the domain.
   Propagation is usually minutes, sometimes longer.
3. Vercel auto-provisions an HTTPS certificate once the DNS record resolves; no action needed
   beyond adding the record.

## 3. After a real domain exists

A few placeholders need updating to match whatever domain actually gets chosen:

- `constants/brand.json`: `linkBaseUrl` (the root domain's `/l` path) and `webAppUrl` (the
  subdomain this webapp lives at).
- The Supabase `link-page` function's `WEB_APP_URL` secret (`supabase secrets set
  WEB_APP_URL=https://app.<your-domain>` once a project exists), so its "Continue in browser"
  button points at the real webapp instead of the placeholder.
- `app.config.ts` derives `associatedDomains`/`intentFilters` from `linkBaseUrl` automatically,
  so updating that one value also fixes universal/app link verification; see
  `web/well-known/README.md` for the other half of that (the actual verification files still
  need real Apple Team ID / Android signing fingerprint values, unrelated to the domain
  itself).
