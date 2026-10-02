# Guardian Care

Energy intelligence for solar households and the companies that install for them.

| Route | What it is |
|-------|------------|
| `/` | The platform introducing itself — **Energy, understood.** |
| `/consumer` | "I already have solar" — understand an existing system |
| `/plan` | "I am looking for solar or storage" — build an energy plan |
| `/business` | "I am a solar or energy company" — keep the customer after handover |

## The home page

Built around the platform's three products rather than around three audiences:

- ** 01 Onsite** — build the system (capture, assess, update)
- ** 02 Operations** — run the system (monitor, analyse, operate, notify, support)
- ** 03 Customer** — understand your energy (understand, visualise, advise)

Operations is drawn larger than the other two because it is the thing in the
middle that connects them. The cards currently route into the existing journey
pages — Onsite and Operations into `/business`, Customer into `/consumer` —
because there are no standalone product pages yet.

## Colour

One surface, on every route. There are no theme classes and nothing to toggle
on `<html>` — the ground is the mark's own navy, and each step above it is that
same hue at a higher lightness rather than a different colour:

| Role | Token | Value |
|------|-------|-------|
| Ground | `--color-bg` | `#011227` |
| Steps above it | `--color-bg-2` / `--color-panel` / `--color-panel-2` | `#021936` · `#022045` · `#032a59` |
| Headings | `--color-ink` | `#ffffff` |
| Supporting text | `--color-muted` | `#d5dee5` |
| Captions | `--color-faint` | `#7e97a9` (derived, 6.2:1) |
| Call to action | `--cta` / `--cta-hover` | `#589009` → `#70a914` |

The CTA is declared on `:root` rather than inside the theme, so the button is
the same object wherever it appears.

One thing to know before reusing these. `#589009` is a midtone — 4.84:1 on the
navy — which passes as type but only just, and is the wrong colour to set a
10px tracked label in. So `--color-green`, the token type actually uses, is the
brand's hover green at 6.6:1, and the fill stays `#589009`. The blue has always
been split this way here for the same reason: raw for fills, lifted for type.

`--cta-strong` (`#4c7d08`) and `--accent-soft` (`#dcebbe`) are declared but not
yet used — they are the rest of the brand sheet, kept so a green accent band or
a small-text-on-green button has values waiting rather than invented ones.

The brand constants under all of it were measured off the logo rather than
chosen to go with it: the PNG decoded, edges eroded, each letterform segmented
and averaged in linear light. Navy `#001126` (hue 213, 62% of the mark), green
hue 87, panel blue `#0074d3`, gold glint hue 43. The green is worth a note — it
read hue 75 for a while, which is the specular highlight on the letterform
rather than the letterform.

## How it is put together

Every journey has the same spine: a guided assessment, a position derived from
the answers, then the explanation that makes the position mean something.

- **`src/components/Assessment/`** — the shared questionnaire engine. One
  question on screen at a time, with a profile filling in beside it. A journey
  supplies `Step[]`; the engine owns nothing but which question is showing.
- **`src/data/`** — what each journey asks and what its answers add up to.
  `platform.tsx` holds the home page's live system, products and architecture;
  `consumer.tsx`, `plan.tsx` and `businessFlow.tsx` hold one journey each.
- **`src/pages/<Journey>/`** — the page and its sections. Answers live at the
  page level, because several sections downstream are derived from them.
- **`src/index.css`** — the design tokens. Every colour utility compiles to
  `var(--color-…)`, so the palette is changed in one place and the whole site
  follows — panels, hairlines, charts, buttons and all. See **Colour** above.

Each journey also carries one idea, drawn rather than argued, and repeated
until it does the explaining. `/plan` draws a kilowatt-hour as a square and
spends the page filling squares in. `/business` draws a customer as a dot and
opens on all 1,245 of them at once, forty-two blipping — which is the entire
case for portfolio visibility, made before the first paragraph.

Figures on the consumer journeys are stated once, not retyped. `/consumer`
follows one example household through the whole page — 18 kWh generated = 9
used + 5 stored + 4 exported, with 2 kWh bought back at 30p — held in
`src/data/consumer.tsx`, so the hero card, the bird's-eye view, the insight and
the dashboard cannot disagree. Its step-02 illustration and a visitor's real
result are both produced by `summaryOf`, so the page delivers exactly the
summary it shows. Everything an assessment produces is labelled **estimated**
until a system is actually connected.

The same discipline runs across pages. The home page's live reading balances
(14.2 into the house + 5.3 into the battery + 5.3 out to the grid = 24.8 off the
roof), its daily figures balance (14.2 + 5.1 + 5.3 = 24.6), and the portfolio
counts it prints come from the same `CC_KPIS` the business console renders — so
the landing page and the product page describe the same company.

## Workflows

```sh
# Start the development server
npm run dev

# Lint for TypeScript and ESLint errors
npm run lint

# Build and serve the production bundle
npm run build
npm run start
```
