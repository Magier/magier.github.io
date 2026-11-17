---
name: blog-illustration
description: Create image-generation prompts and prepare editorial artwork for Magier’s Musings. Use when the user asks for blog illustrations, cover images, consistent visual themes, or sumi-e/woodblock-inspired technical artwork for this repository. Includes the author's approved prompt and exact light/dark palettes.
---

# Blog illustrations

Read `prompt-template.md` beside this file. It is the author's approved visual identity; preserve its wording and palette unless the author requests a change.

## Prepare a prompt

1. Identify the article topic and the single idea the illustration should communicate. If no concept is given, suggest two or three distinct visual metaphors before producing a final prompt. Do not assume every topic needs a robot or enclosure.
2. Fill SUBJECT and CONCEPT in the template. Use a concrete composition that tells a small story, not a literal labeled diagram.
3. Ask which mode is needed if it is unclear. For one image, include only the requested palette so the image model does not blend light and dark backgrounds.
4. For a pair, create one composition first. Ask the image model to use that image as a reference for the second mode, preserving objects, framing, silhouettes, and positions while changing palette. Do not request a side-by-side sheet unless asked.
5. Return the ready-to-paste prompt as plain text without blockquote bars or surrounding commentary. Keep explanations separate if needed.

Use the approved robot-garden images in `public/images/hands-in-the-sandbox/` as optional style references, not as compositions to repeat. If they are unavailable, ask for a reference rather than inventing an attachment.

## Generation and integration

Check whether an image-generation tool is actually available. If not, provide the prompt for https://chatgpt.com/images; do not claim to generate an image.

Keep textured editorial artwork raster-based unless a simpler SVG interpretation is specifically requested. Use hand-built SVG/HTML for precise interactive diagrams.

When asked to integrate supplied artwork:
- Copy originals into `public/images/<post-slug>/` with descriptive light/dark filenames. Preserve source files unless asked to move them.
- Use the site's `data-mode` attribute to select the matching artwork, not only the operating-system preference.
- Preserve the aspect ratio and supply descriptive alt text and correct intrinsic dimensions.
- Explain that editorial artwork uses its fixed approved palette; it does not automatically recolor with alternative site palettes.
- Remember that every file under `public/` is deployed even when its post is a draft. Keep embargoed images in `.local-drafts/` until publication is approved.
- Do not publish a post or push changes just because artwork is ready.

## Review

Check the palette, approximately 2:1 framing, legibility at article width, generous negative space, and absence of text or corporate security clichés. Check that paired versions preserve the same scene. Judge artistic quality with the user rather than claiming automated visual validation.
