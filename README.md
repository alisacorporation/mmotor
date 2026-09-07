# MMOTOR Nuxt dashboard

Recreation of the supplied MMOTOR gaming-directory UI using Nuxt 4 and Vue 3.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub Pages

Push the repository to GitHub, then enable:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

The included workflow generates a static Nuxt site and publishes it to GitHub Pages. For a project repository, the workflow automatically uses:

`/<repository-name>/`

as the Nuxt base URL.

## Notes

- Nuxt 4 is used for SSR/SSG-friendly SEO and Vue routing.
- The page is fully static after `npm run generate`.
- The visual system is implemented with scoped project CSS rather than a component library because the supplied design is highly custom.
- Search, category selection, theme toggle, and the “More” navigation control are functional.
