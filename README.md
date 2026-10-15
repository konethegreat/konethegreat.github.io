# Kone Tshivhinda · portfolio

**Live: [konethegreat.github.io](https://konethegreat.github.io)**

The portfolio of Kone Tshivhinda, an AI systems engineer and full-stack developer in Johannesburg. It brings my own work together on one page: case studies, the stack, a career timeline, the public GitHub record ([konethegreat](https://github.com/konethegreat)) and a few photos from outside the code.

It is a static single-page site, built with React and deployed to GitHub Pages by a GitHub Actions workflow.

## What is on the page

| Section | What it shows |
| --- | --- |
| Hero | Name, a one-line pitch and the headline numbers (counted from the project data) |
| About | Who I am, the principles I build by and the AI tools I use every day |
| Work | Featured case studies plus a filterable archive of every project, each with an honest status label |
| Stack | Skills grouped by area, filterable, with the projects that prove each one |
| Journey | A radial timeline of the path so far (a plain vertical timeline on phones) |
| Career | Roles, education, certifications and the IBM course list |
| GitHub | The public account with its repositories and their languages, plus the one private project |
| Beyond | Photos from outside the code, with a lightbox |
| Contact | Email (revealed on request), LinkedIn, GitHub, Credly and the IBM certificate |

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>⌘</kbd> + <kbd>K</kbd>) anywhere for the command menu: jump to a section, open a case study, copy the email address or turn the visual effects off.

## Status labels are meant literally

Every project carries one of these, and none is rounded up:

- **Live**: it runs today at the linked address (some behind staff sign-in).
- **Public source** / **Public source snapshot**: the code can be read on GitHub. A snapshot is a cleaned copy of the working code.
- **Private**: the repository is not public (Vigil), so the card is a case study without a code link.
- **Local project**, **Coursework**: exactly what they say.

## Stack

- [Vite](https://vite.dev) 8, [React](https://react.dev) 19 and TypeScript 6 in strict mode
- [Tailwind CSS](https://tailwindcss.com) v4 and shadcn-style primitives (class-variance-authority, Radix Slot and Dialog)
- [Framer Motion](https://www.framer.com/motion/) for animation, [cmdk](https://cmdk.paco.me) for the command menu, [lucide-react](https://lucide.dev) for icons
- Fonts are self-hosted through [Fontsource](https://fontsource.org): Inter, Space Grotesk and JetBrains Mono

## Run it locally

You need Node 22.12 or newer.

```bash
npm ci            # install the exact versions in package-lock.json
npm run dev       # dev server with hot reload
npm run build     # type-check, then build into dist/
npm run preview   # serve the production build on http://localhost:4173
```

## Where things live

```text
src/
  components/
    sections/   one file per page section, plus the navbar, footer and command menu
    ui/         buttons, dialog, photo and other primitives
    fx/         particles, splash cursor, vortex, shutter text, counters, marquee
  data/         all of the content, as typed TypeScript (see below)
  lib/          hooks, the case-study dialog and its URL/history handling, effects switch
public/
  images/       web-sized WebP photos
scripts/        photo processing and make-assets.mjs (icons and the social-share image)
```

### Editing the content

Nothing is hard-coded in the components. Change the data and the page follows:

| File | Content |
| --- | --- |
| `src/data/projects.ts` | Every project: pitch, highlights, stack, links, status, metrics |
| `src/data/profile.ts` | Name, links, hero copy, principles, headline numbers, the email parts |
| `src/data/experience.ts`, `credentials.ts` | Roles, education, certifications, the IBM courses |
| `src/data/skills.ts`, `journey.ts` | Stack groups and the timeline chapters |
| `src/data/github.ts` | The repository snapshot shown in the GitHub section (dated) |
| `src/data/gallery.ts` | Photo captions |

A case study can be linked directly: `https://konethegreat.github.io/#project/vigil`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs from the lockfile, type-checks, builds and publishes `dist/` to GitHub Pages. In the repository settings, **Pages → Build and deployment → Source** is set to **GitHub Actions**. `public/404.html` is served for any address that does not exist.

## Accessibility, privacy and performance

- Built to WCAG 2.2 AA and checked with axe-core on the page and in every dialog, on desktop and phone widths, including the reduced-motion render. Colour contrast is measured from rendered pixels, not only from tokens.
- Fully keyboard operable: dialogs trap and restore focus, the browser Back button closes a case study, and the orbit timeline has arrow-key, Home and End support.
- `prefers-reduced-motion` switches the animated effects off, and there is a visible switch for everyone else.
- No analytics, cookies, trackers or third-party requests. The only thing stored in the browser is the effects on/off preference. The email address is assembled in the browser so it is not sitting in the page source for scrapers.
- Photos are served as responsive WebP with blur placeholders. A car number plate and bystanders were removed from the originals before they were added to the repository.

## Credits

- Interface ideas adapted from community components on [21st.dev](https://21st.dev): the shutter-text hero, animated hero, stacking navbar and radial orbital timeline.
- Particles, splash cursor and vortex effects are ported from my own UI Vault component library.
- [Radix UI](https://www.radix-ui.com), [cmdk](https://cmdk.paco.me), [Framer Motion](https://www.framer.com/motion/), [lucide](https://lucide.dev) and [Fontsource](https://fontsource.org) do a lot of the heavy lifting.

## Copyright

© 2026 Kone Tshivhinda. The text and photographs are mine and all rights are reserved. The code is published so it can be read; if you would like to reuse parts of it, please get in touch first.
