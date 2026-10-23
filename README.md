# magier.github.io

Personal blog. Astro, deployed to GitHub Pages on push to `main`.

```sh
pnpm dev      # localhost:4321, shows drafts
pnpm build
```

## Writing

- Post: `src/content/posts/<slug>.md` (or `.mdx`)
  ```yaml
  title: ...
  date: 2026-10-23
  description: ...        # optional
  draft: true             # optional, hidden from build
  series: ai-agent-security  # optional, filename of a series
  seriesOrder: 1          # optional, order within series
  ```
- Series: `src/content/series/<slug>.md` with `title`, `description`, and an intro as body.
