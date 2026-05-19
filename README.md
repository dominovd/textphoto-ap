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

All AI endpoints (`/api/caption`, `/api/ocr`, `/api/alt-text`, `/api/meme`) call **OpenRouter** (OpenAI-compatible API gateway), which routes to the best provider per tool. Defaults pick the cheapest model that doesn't compromise quality for each task.

### Per-tool model routing (defaults)

| Endpoint | Default model | Why |
|---|---|---|
| `/api/caption` | `anthropic/claude-haiku-4.5` | Creative task — warm tone matters |
| `/api/ocr` | `google/gemini-2.0-flash-001` | Factual task — Gemini equal/better at print text, much cheaper |
| `/api/alt-text` | `google/gemini-2.0-flash-001` | Factual task — same as OCR |
| `/api/meme` | `openai/gpt-4o-mini` | Comedy — better Western humour calibration |

Each can be overridden by setting `AI_MODEL_CAPTION`, `AI_MODEL_OCR`, `AI_MODEL_ALT_TEXT`, `AI_MODEL_MEME` in env vars — no redeploy needed for model swap (just restart).

### Resilience — 3-tier fallback

`visionPrompt()` runs three tiers in order, advancing only on error:

| Tier | Provider | Model |
|---|---|---|
| 1 | OpenRouter | per-tool primary (e.g. Gemini Flash for OCR) |
| 2 | OpenRouter | `AI_FALLBACK_MODEL` (default Gemini Flash) |
| 3 | Anthropic SDK direct | `claude-haiku-4-5` (catastrophic fallback) |

In practice almost all traffic resolves at Tier 1. Tier 3 is the safety net for the rare case where OpenRouter itself is unavailable. If Tier 3 also fails, the original error is re-thrown so the user gets a meaningful response.

For Tier 3 to work, `ANTHROPIC_API_KEY` must still be set in env vars even after OpenRouter migration. Without it, Tier 3 throws and the original error propagates.

### Required env vars on Vercel

| Var | Source | Required | Why |
|---|---|---|---|
| `OPENROUTER_API_KEY` | https://openrouter.ai/keys | yes | Tier 1 + 2 of AI calls |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | recommended | Tier 3 catastrophic fallback if OpenRouter is down |
| `UPSTASH_REDIS_REST_URL` | https://console.upstash.com | yes | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Same Upstash page | yes | Rate limiting |
| `FAL_KEY` | https://fal.ai/dashboard/keys | for image-to-image tools | Photo enhancement primary |
| `REPLICATE_API_TOKEN` | https://replicate.com/account/api-tokens | for image-to-image fallback | Photo enhancement fallback |
| `DAILY_AI_BUDGET_CALLS` | — | optional (default 1000) | Site-wide daily safety cap |
| `AI_PRIMARY_MODEL` | — | optional | Override default primary for all tools |
| `AI_FALLBACK_MODEL` | — | optional | Override default fallback |
| `AI_MODEL_CAPTION` / `_OCR` / `_ALT_TEXT` / `_MEME` | — | optional | Per-tool model override |

For local dev, create `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Pricing at default routing

Per 1000 calls (May 2026 prices, includes OpenRouter ~5% markup):

| Tool | Old cost (Anthropic direct, Haiku) | New cost (per-tool routing) | Saving |
|---|---|---|---|
| Caption | $5 | $5 (same — Haiku) | 0% |
| OCR | $7 | $1 (Gemini Flash) | **−86%** |
| Alt-text | $3 | $0.30 (Gemini Flash) | **−90%** |
| Meme | $4 | $1.20 (GPT-4o-mini) | **−70%** |
| **Mixed average** | **$4.75** | **~$1.50** | **~3× cheaper** |

The global daily cap (`DAILY_AI_BUDGET_CALLS=1000`) is still a hard ceiling on call count regardless of model.

### Privacy caveat

Requests pass through OpenRouter's servers. They don't store request content by default but it's an extra trust hop vs Anthropic direct. The privacy page (`/privacy`) mentions this.

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
