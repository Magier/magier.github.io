# magier.github.io

Personal blog. Astro, deployed to GitHub Pages on push to `main`.

```sh
pnpm dev      # localhost:4321, shows drafts
pnpm build
```

## Managing the blog

This repository is the home for the blog: content, design, and deployment configuration live together.
This README is repository documentation, not a blog page. It is visible on GitHub, but Astro does not publish it to the website.

### Everyday workflow

1. Write a post in `src/content/posts/<slug>.md`. Use `.mdx` when it needs interactive components.
2. Set `draft: true` while working.
3. Run `pnpm dev` and review it at http://localhost:4321/.
4. Before publishing, review the wording, sources, links, mobile layout, and interactive controls. Remove `draft: true` or set it to `false`.
5. Run `pnpm build` to check the production build.
6. Commit the intended files and push to `main`. GitHub Actions deploys automatically.
7. Check the Deploy workflow in GitHub Actions and verify the live site.

Use a separate branch for larger design changes. A branch in this public repository is still public; it is not a safe place for private drafts.

### Private and embargoed drafts

**`draft: true` hides a post from the production website, not from the public GitHub repository.**

Keep private or embargoed material in `.local-drafts/` (ignored by Git) or outside this repository.
Never put unpublished HTML, scripts, or assets in `public/`: everything in that folder is copied directly into the deployed website, even if no page links to it.
Similarly, a page under `src/pages/` can create a public route without appearing on the homepage.

The original full sandbox article remains in `.local-drafts/sandbox/`. Its incident analysis and employer-specific material must stay unpublished until explicitly approved after the employer's article has gone live; do not publish it automatically on a date.

The published basics-only post is in `src/content/posts/50-shades-of-isolation.mdx`. It covers filesystem, network, credentials, execution isolation, and scope, using shared figure components. It uses the normal metadata, listing, and draft filtering. Unlike the private original, this basics-only version is cleared by the author for publication once reviewed.

Ignored drafts are **not backed up by Git**. Keep a separate private backup if they matter.

### File organization

- `src/content/posts/`: Markdown and MDX posts. All posts use the wide layout (960px maximum), aligning prose and diagrams.
- `src/content/series/`: series introductions and metadata.
- `src/components/`: reusable interactive components.
- `src/layouts/Base.astro`: shared page structure, design tokens, typography, and analytics.
- `public/images/<post-slug>/`: published post images, grouped by post.
- `.local-drafts/`: local-only unpublished work; never commit or deploy.

Git history tracks published revisions. A CMS is optional; the current Markdown/MDX workflow needs no separate backend.

## Post metadata

- Post: `src/content/posts/<slug>.md` (or `.mdx`)
  ```yaml
  title: ...
  date: 2026-10-23
  description: ...        # optional
  draft: true             # optional, hidden from build
  series: ai-agent-security  # optional, filename of a series
  seriesOrder: 1          # optional, order within series
  tags:                   # optional, hierarchical topic paths
    - security/agentic-ai/sandboxing
  ```
- Series: `src/content/series/<slug>.md` with `title`, `description`, and an intro as body.

### Topics

Use lowercase, hyphen-separated segments in `tags`, separated by `/` for hierarchy.
For example, `security/agentic-ai/sandboxing` creates Security → Agentic AI → Sandboxing.
Parents are inferred from post metadata; no separate topic registry is needed.
Each topic has a page at `/topics/<path>/`. Parent pages include posts tagged with
any descendant, matching complete path segments (`security` does not match `security-tools`).
Multiple tags are allowed; each post is counted once per topic. Untagged posts remain in the normal listing.
Draft topics follow the same visibility rules as draft posts.

## Visitor analytics (GoatCounter)

The deployment workflow sets `PUBLIC_GOATCOUNTER_CODE=magier`.
Dashboard: https://magier.goatcounter.com/ (account access required).
This site code is public configuration, not a secret.

Tracking is always off in `pnpm dev`. Local builds leave tracking off unless the variable is supplied:
`PUBLIC_GOATCOUNTER_CODE=magier pnpm build`.

The privacy page reflects whether analytics are enabled. Remove the variable from the workflow and redeploy to disable tracking.

## Illustration skill

The project-local skill at `.agents/skills/blog-illustration/SKILL.md` describes the artwork workflow.
Its `prompt-template.md` preserves the approved sumi-e/woodblock visual identity and exact light/dark palettes.
Ask an assistant to use that skill when preparing new article illustrations. If its client does not discover project skills automatically, give it that path explicitly.
These files are repository documentation, not website pages. They will be public on GitHub if committed.
