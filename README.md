# Samhita Health

Marketing site + regulatory compliance hub for a federated-learning platform aimed at Indian
hospitals. India/DPDP-first: the pitch is that clinical AI can be trained across hospitals
without a patient record ever leaving the premises.

Presented as a **four-faced cube**. Swiping right brings the left-hand face round to the front,
swiping left brings the right-hand one; arrow keys and the radio dots at the bottom do the same.
Nothing scrolls vertically: each face fits the viewport, with sub-sections on in-face tabs.

```bash
npm install
npm run dev      # http://localhost:5185
```

## Faces

| # | Face | Tabs |
|---|------|------|
| 1 | Why federated | Overview · The deadlock |
| 2 | How it works | Round visualiser · Privacy controls · Deployment & security |
| 3 | Compliance | Timeline · Instruments · Pooling vs federated · Readiness check |
| 4 | Impact | Calculator · Applications · Questions · Contact |

Each face is linkable: `/#why`, `/#how`, `/#compliance`, `/#impact`.

## Interactive pieces

- **Round visualiser**: plays one federated round across five hospital nodes, with a packet
  inspector showing exactly what is on the wire at each step and what never is.
- **Privacy controls**: ε / secure-aggregation / site-count sliders against a privacy-utility
  frontier. The model is illustrative (labelled as such in the UI), shaped after published DP-SGD
  behaviour on clinical imaging.
- **Readiness check**: 16 questions across four categories, stepped one category at a time,
  producing a weighted score and a prioritised action plan with provision references. Runs
  entirely client-side; nothing is transmitted.
- **Impact calculator**: cohort size and expected AUC alone vs. federated, on a learning-curve
  model with a fixed non-IID penalty.

## Layout rules

- `.stage` / `.cube` / `.face` in `src/index.css` hold the 3D geometry. Faces sit at
  `rotateY(i·90°) translateZ(50vw)`; the cube counter-rotates by `-pos·90°`.
- `pos` is an unbounded integer, not a modulo index, so wrapping from face 4 to face 1 keeps
  turning forward instead of spinning back three quarters.
- `.panel-scroll` uses `align-content: safe center`: panels centre when they fit and fall back
  to top-aligned if a short viewport forces a scroll, so content is never pushed out of reach.
- `FitPanel` is what actually enforces "no scrolling": it measures the panel's natural height
  against the space the face has left and scales it down just enough to fit, floor 0.68. A
  transform doesn't affect layout, so `scrollHeight` stays the natural height and can be read
  while a scale is applied. Width is deliberately not compensated, because widening the child as it
  shrinks would change its height, which would change the scale, which would loop.
  It measures across three frames after any tab change or webfont swap, because either can
  re-wrap the header tabs and change the space available.
- Below 900px wide, fitting is switched off: the layout has stacked to one column by then and no
  sane scale would fit it, so phones keep full-size type and scroll the panel instead.
- Panels are laid out wide rather than tall wherever possible (multi-column obligation lists, a
  horizontal instrument selector). A wider measure means fewer wrapped lines, which is what
  keeps a face inside a short viewport without heavy scaling.
- Drags are axis-locked on first movement, and never start on `input/textarea/select/button/a`
  or anything marked `data-nodrag`, so sliders and tabs don't spin the cube.
- Animated panels (hero weave, round visualiser) tick on a timer and only while their face is at
  the front. An earlier `requestAnimationFrame` + `setState` per frame version pegged the main
  thread, so don't reintroduce it.

## Type and mark

The page is set in Newsreader throughout, the same face as the Samhita wordmark, with JetBrains
Mono kept for eyebrows, rule references and numerics, matching the "HEALTH" half of the lockup.
Inter remains only as a metric fallback. SVG labels inside the charts use Newsreader too, so a
chart and its caption read as one thing.

The mark (`src/components/Mark.jsx`) is a four-point star with concave arms and four nodes on a
faint orbit in the diagonal gaps: a star that is also a federation seen from above. Geometry is
generated from `ARM` / `WAIST` / `ORBIT` rather than hand-authored path data. `public/favicon.svg`
carries the same path, scaled to 0.76 so the arms clear the rounded tile.

## Content accuracy

`src/data/regulations.js` is the single source for the compliance hub. Rule and section numbers
are cited as published, and every card links to the primary instrument. Key dates as at July 2026:
DPDP Rules notified 13 Nov 2025; Consent Manager regime opens 13 Nov 2026; substantive obligations
commence 13 May 2027. Update `TIMELINE` when the Government issues further notifications
(localisation categories in particular are still outstanding).

The site states plainly, in more than one place, that federation is a control rather than an
exemption, and that the content is not legal advice.

## Deploying to Render

The site is fully static, so it goes out as a Render **Static Site** (free tier), not a web
service. `render.yaml` at the repo root already declares the whole thing, so the Blueprint flow
needs no dashboard configuration:

1. Push this repo to GitHub, GitLab or Bitbucket. Render static sites deploy from a connected Git
   repo; there is no local-folder upload path.
2. In Render: **New → Blueprint**, pick the repo, apply. Render reads `render.yaml`.

If you'd rather set it up by hand instead (**New → Static Site**), the equivalent settings are:

| Setting | Value |
|---|---|
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Node version | `22.22.3` (from `.node-version`, or a `NODE_VERSION` env var) |

Notes on the config:

- **The rewrite rule is belt-and-braces.** The cube navigates by hash (`/#why`, `/#how`), and a
  fragment never reaches the server, so there is no refresh-404 problem to solve. The
  `/* → /index.html` rewrite only matters if path-based routes are added later.
- **Long cache on `/assets/*` is safe** because Vite fingerprints those filenames. `index.html`
  deliberately keeps Render's default short cache so a deploy is picked up immediately.
- Fonts come from Google Fonts at runtime; nothing else is fetched cross-origin.

## Notes

- The contact form has no backend and says so on submit.
- Fonts load from Google Fonts; the rest is self-contained.
