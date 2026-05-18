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

## Wiring real AI

Right now `/api/caption` and `/api/ocr` return mock data. To wire real AI:

1. Add API key env var to Vercel: `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`).
2. Install SDK: `npm install @anthropic-ai/sdk` (or `openai`).
3. Replace mock logic in the relevant `app/api/*/route.ts` file with a real model call.

Recommended models for cost control:
- Captions: Claude Haiku 4.5 or GPT-4o-mini.
- OCR: GPT-4o (vision) or Claude Sonnet 4.6 (vision).

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
