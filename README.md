# Jeffrey Quntai — Creative Technologist

Personal portfolio built with Next.js (App Router), React, TypeScript, Tailwind CSS v4,
GSAP + ScrollTrigger, Motion and Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Brand

Palette taken from [morpheus-dx.com](https://www.morpheus-dx.com/) (its `--morpheus-*` CSS variables).

| Role | Colour | Token |
| --- | --- | --- |
| Royal — signature elements (skill icons) | `#4A1F70` | `brand` / `purple` |
| Electric — keyword emphasis, glows | `#8558D2` | `electric` |
| Jade — underlines, CTA, small highlights | `#00E893` | `accent` / `jade` |
| Midnight — text | `#272757` | `ink` / `midnight` |
| Gradient — contact, menu, dark cards, buttons | `#1A0F2C → #3D1C6D → #6B2FD0` | `bg-morpheus`, `bg-morpheus-down` |
| White / soft violet — backgrounds | `#FFFFFF`, `#F7F4FC` | `paper`, `paper-2` |

The header switches to white text over any element marked `data-header="dark"`.

Type: **Outfit** (Google Fonts) for headings and labels, **Lufga** (self-hosted from
`app/fonts/`) for body text. Lufga is a commercial typeface — confirm your licence covers web
embedding before publishing.

## Where things live

| What | File |
| --- | --- |
| Name, positioning, portrait, contact links, hero statements | `data/site.ts` |
| Projects + case studies | `data/projects.ts` |
| Engineering / UX skills and tool logos | `data/skills.ts` |
| Brands | `data/brands.ts` |
| Colours, fonts, spacing tokens | `app/globals.css` (`@theme` block), fonts in `app/layout.tsx` |

You should not need to touch component code to update content.

## Replacing placeholders

**Portrait / hero image** — set `portrait` in `data/site.ts`:

```ts
portrait: { src: "/images/portrait.jpg", alt: "Portrait of Jeffrey Quntai", cutout: false },
```

`cutout: true` is for transparent PNGs (currently the iridescent orb): shown uncropped with a soft
brand glow, turning slowly as you scroll. `cutout: false` crops a regular photo into a circle.

**Contact** — fill in `contact.email`, `linkedin`, `github` and `cv` in `data/site.ts`.
The "Let's build something." button becomes a `mailto:` link as soon as `email` is set.
Put your CV PDF in `public/cv/` and set `cv: "/cv/your-file.pdf"`.

**Project covers** — add images to `public/images/projects/<slug>/` and set on the project:

```ts
cover: { src: "/images/projects/brrd/cover.jpg", alt: "Brrd booking flow on mobile and desktop" },
role: "Product Designer & Full-Stack Engineer",
year: "2024",
```

Covers are shown at roughly 1.4:1 on desktop, 4:3 on mobile. Use 2400px-wide images.

**Case studies** — every field under `caseStudy` is optional; anything missing shows a labelled
placeholder on the project page:

```ts
caseStudy: {
  overview: "…",
  challenge: "…",
  role: "…",
  approach: { design: "…", engineering: "…" },
  process: [{ title: "Discovery", body: "…" }, { title: "Prototyping", body: "…" }],
  solution: "…",
  gallery: [{ src: "/images/projects/brrd/01.jpg", alt: "…", caption: "…" }],
  stack: ["Next.js", "Node.js", "PostgreSQL"],
  outcomes: ["…"],
},
```

**Brand logos** — download official logo files from each organisation's press/brand page, save as
`public/brands/<name>.svg`, then set `logo: "/brands/safaricom.svg"` in `data/brands.ts`.
Logos render greyscale and pick up colour on hover. Make sure you have the right to show each one.

**Tool logos** — React, Next.js, TypeScript, JavaScript, Node.js, Tailwind CSS, GitHub, Vercel,
Figma and Miro use official marks from [simple-icons](https://simpleicons.org). Adobe Illustrator,
Adobe Photoshop and FigJam are not distributed there, so they show monogram placeholders: add an
SVG to `public/logos/` and set `src: "/logos/illustrator.svg"` on that tool in `data/skills.ts`.

## How the interactions work

- **Hero** (`components/Hero.tsx`) — the section pins for ~5 screen heights on desktop (~3 on
  mobile). A single scrubbed GSAP timeline reveals each statement word-by-word, draws the accent
  underline under the `*keywords*`, then lifts it away. The portrait scales and its text ring
  rotates with scroll. Fully reversible. Edit the statements in `heroScenes` in `data/site.ts`.
- **Selected Works** (`components/HorizontalProjectGallery.tsx`) — on screens ≥1024px the section
  pins and vertical scroll moves the track sideways; the scroll distance equals the track's
  overflow, so there is no dead space. Smaller screens get a native swipe carousel with snap.
  Keyboard focus on a card scrolls it into view.
- **Brands** — the logo row drifts sideways with scroll on desktop; swipeable on touch devices.
- **Reduced motion** — with `prefers-reduced-motion`, the hero crossfades without movement,
  galleries become native carousels, and Motion animations skip transforms.

All GSAP code runs through `useGSAP` + `gsap.matchMedia`, so ScrollTriggers are created per
breakpoint and reverted on unmount/resize (no leaks).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository, and accept the
   detected Next.js defaults.
3. (Optional) Add your custom domain in **Project → Settings → Domains**, then set the
   environment variable `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` so canonical URLs and
   Open Graph previews use it. Without it, the Vercel production URL is used automatically.

Or from the terminal: `npx vercel` (preview) and `npx vercel --prod` (production).
