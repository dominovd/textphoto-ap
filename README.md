# textphoto.app

Free AI tools for photo + text — captions, OCR, text effects, alt-text, meme makers.

Built with Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript.

## Quick start (local)

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
├── layout.tsx              # Root layout, fonts, header/footer wrappers
├── page.tsx                # Home
├── globals.css             # Tailwind v4 + theme + FX classes
├── sitemap.ts              # Auto-generated sitemap.xml
├── robots.ts               # Auto-generated robots.txt
├── not-found.tsx           # 404 page
├── [category]/
│   ├── page.tsx            # Dynamic category page (/captions, /ocr, …)
│   └── [tool]/
│       └── page.tsx        # Dynamic tool page (/captions/instagram-caption-generator, …)
└── api/
    ├── caption/route.ts    # Mock caption AI endpoint
    └── ocr/route.ts        # Mock OCR endpoint

components/
├── Header.tsx
├── Footer.tsx
├── CategoryCard.tsx
├── ToolCard.tsx
├── FeaturedToolCard.tsx
└── tools/
    ├── InstagramCaptionTool.tsx
    ├── OCRTool.tsx
    └── NeonTextTool.tsx

lib/
├── categories.ts           # 12 categories (single source of truth)
└── tools.ts                # Tool registry — add new tools here
```

## MVP — what's working now

- Landing page with hero, 12 category cards, featured tools, effects preview.
- All 12 category pages (`/captions`, `/ocr`, `/effects`, …) generated from `lib/categories.ts`.
- All tool pages generated dynamically. Working tools:
  - **Instagram Caption Generator** (`/captions/instagram-caption-generator`) — mock AI returns 10 captions per vibe.
  - **Image to Text / OCR** (`/ocr/image-to-text`) — mock returns one of three sample extractions.
  - **Neon Text Generator** (`/effects/neon`) — real, live CSS-based neon preview, no AI needed.
- SEO: per-page metadata, OG tags, JSON-LD (SoftwareApplication + FAQPage), sitemap.xml, robots.txt.

Tools without a working component show a friendly "coming soon" message — the URL still ranks and you can ship the component later.

## Adding a new tool

1. Open `lib/tools.ts`.
2. Add a new entry to the `tools` array. If it's a static "coming soon" page, set `component: null`.
3. If you want an interactive component, build it in `components/tools/`, then:
   - Add a key to the `Tool["component"]` union type.
   - Register it in the switch inside `app/[category]/[tool]/page.tsx`.

That's it — the category page and tool page rebuild automatically.

## AI integration

All AI endpoints (`/api/caption`, `/api/ocr`, `/api/alt-text`, `/api/meme`) use **Claude Haiku 4.5** with vision — ~3x cheaper than Sonnet and quality is great for these tasks. Model is configurable in `lib/ai.ts`.

**Required env vars on Vercel:**

| Var | Source | Why |
|---|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | AI model access |
| `UPSTASH_REDIS_REST_URL` | https://console.upstash.com | Rate limiting (see below) |
| `UPSTASH_REDIS_REST_TOKEN` | Same Upstash page | Rate limiting |
| `DAILY_AI_BUDGET_CALLS` | optional, default 1000 | Site-wide daily safety cap (~$5/day at Haiku pricing) |

To set in Vercel:
1. Project → Settings → Environment Variables.
2. Add each var, scope: Production, Preview, Development.
3. Redeploy (env vars aren't picked up until next deploy).

For local dev, create `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

If Upstash env vars are missing, rate limiting **silently fails open** (allows all requests) and prints a warning in prod logs. In dev this is fine; in prod you'll want it set.

### Pricing model (current setup)

At Haiku 4.5 pricing:

| Tool | Cost per call |
|---|---|
| Caption (10 outputs) | ~$0.005 |
| OCR | ~$0.007 |
| Alt-text (3 variants) | ~$0.003 |
| Meme (5 captions) | ~$0.004 |

The global daily cap (`DAILY_AI_BUDGET_CALLS=1000`) keeps maximum daily spend at ~$5.

### Switching providers

To swap to OpenAI: replace the SDK calls in `lib/ai.ts` and the 4 API routes — the prompts and parsing logic stay similar.

## Rate limiting

We use **Upstash Redis** (free tier, 10k commands/day) for per-IP rate limiting.

**Default limits (configurable in `lib/ratelimit.ts`):**
- 5 requests per hour, per IP, per endpoint
- 15 requests per day, per IP, per endpoint
- 1000 total AI requests per day, site-wide (= the global $5/day cap)

When a limit is hit, the API returns 429 (per-IP) or 503 (global) with a `Retry-After` header and a human-friendly error message. Frontends display this directly to the user.

### Setting up Upstash (one-time, ~5 minutes)

1. Sign up free at https://console.upstash.com.
2. Click **Create Database** → name it `textphoto-prod` → pick a region close to your Vercel deployment → choose **Global** or **Regional** (Global is fine).
3. On the database page, scroll to **REST API**. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Add both to Vercel → Project → Settings → Environment Variables.
5. Redeploy.

### Loosening or tightening limits

Edit `lib/ratelimit.ts`:

```ts
const HOURLY_PER_IP = 5;   // raise to 20 for friendlier UX
const DAILY_PER_IP = 15;   // raise to 50
```

Or set the global daily cap via env var:
```
DAILY_AI_BUDGET_CALLS=2000
```

### Fallback behavior

- **User hits hourly cap** → 429 with "Try again in X min" message
- **User hits daily cap** → 429 with "Resets in Xh" message
- **Site-wide budget exhausted** → 503 with "Resets at 00:00 UTC. Try our text-effect tools (no AI required)" message
- **Anthropic API down** → 500 with error from SDK (visible to user, retry-friendly)
- **Upstash down or not configured** → fails open (allows all requests, logs a warning)
- **Text-effect tools** (fire, neon, bubble, cursive, glitch, gold) — **never** hit AI, always work regardless of limits.

## Analytics

Two providers are pre-wired:

- **Vercel Web Analytics** — auto-enabled. View at Vercel → Project → Analytics.
- **Plausible** — script in `app/layout.tsx` points to `plausible.io/js/script.js` with `data-domain="textphoto.app"`. Create the site at https://plausible.io/sites and traffic shows up there. Plausible is paid after the trial; if you don't want it, remove the `<Script>` block from `app/layout.tsx`.

## Search Console

Google Search Console verification meta tag is already in `app/layout.tsx`. After deploy:

1. Add `textphoto.app` as a property at https://search.google.com/search-console.
2. Pick the "HTML tag" verification method — it should auto-pass since the meta tag is live.
3. Submit `https://textphoto.app/sitemap.xml`.

## Deploy to Vercel (step-by-step)

You've already got everything you need: GitHub account, Vercel account, the textphoto.app domain.

### 1. Push to GitHub

```bash
cd path/to/textphoto-app

# git was already initialized by create-next-app
git add -A
git commit -m "Initial commit: textphoto.app MVP"

# Create a new repo on GitHub (via web UI or `gh repo create`)
# Then add the remote and push:
git remote add origin git@github.com:YOUR_USERNAME/textphoto-app.git
git branch -M main
git push -u origin main
```

If you use GitHub CLI: `gh repo create textphoto-app --public --source=. --remote=origin --push`.

### 2. Import to Vercel

1. Go to https://vercel.com/new.
2. Pick your `textphoto-app` GitHub repo.
3. Framework preset: **Next.js** (auto-detected).
4. Leave all defaults. Click **Deploy**.

First deploy lands at `something-yourname.vercel.app` in ~60s.

### 3. Connect textphoto.app domain

1. In Vercel: Project → **Settings** → **Domains** → Add `textphoto.app` and `www.textphoto.app`.
2. Vercel will show you DNS records (A record for apex, CNAME for www).
3. Add those records in your domain registrar's DNS panel.
4. Wait 5–30 min for propagation. Vercel auto-issues SSL.

### 4. Future updates

Every `git push` to `main` triggers a new Vercel build and deploy automatically. Preview deploys are created for every branch and PR.

## SEO checklist for after launch

- [ ] Submit `https://textphoto.app/sitemap.xml` to Google Search Console.
- [ ] Submit the site to AI-tool directories that already link to textphoto.app:
  - theresanaiforthat.com
  - toolify.ai
  - topai.tools
  - producthunt.com
  - saashub.com
- [ ] Add Plausible / Vercel Analytics for traffic tracking.
- [ ] Set up uptime monitoring (e.g., Better Uptime free tier).
