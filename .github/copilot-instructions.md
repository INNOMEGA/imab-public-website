# Copilot instructions for imab-public-website

## Build, test, and lint commands
- npm scripts (package.json):
  - npm run build-css — compile Tailwind CSS: tailwindcss -i ./src/input.css -o ./src/output.css
  - npm run watch-css — same as dev, watch and recompile
  - npm run dev — watch-mode for CSS
- Tests: none in this repo. There is no test runner configured. To add tests, add a test script in package.json.
- Lint: no linter configured. No eslint/stylelint configs present.

How to run a single step
- Compile production CSS: npm run build-css
- Watch while developing: npm run dev

## High-level architecture (big picture)
- Static site composed of HTML files at the repo root and under /blog/. Core content is plain HTML (index.html, index-dark.html, blog/posts/*).
- Styling: Tailwind CSS. Source: src/input.css -> compiled output src/output.css. tailwind.config.js controls content scanning and theme extensions.
- Serverless: Netlify Functions live in netlify/functions/ (e.g., subscribe.js). Deployment is configured via netlify.toml (publish root = ".").
- Deployment: Netlify (netlify.toml present). Redirects and caching configured there (notably redirects for blog trailing slashes and caching headers for /src/output.css).

## Key conventions and project-specific patterns
- Tailwind content paths: tailwind.config.js includes "./**/*.html" and "./src/**/*.{js,ts,jsx,tsx}" — any new HTML template locations should be added to content to avoid purging used classes.
- Compiled CSS file is src/output.css and is committed to the repo. netlify.toml sets long-cache headers for this path — be aware changes to this file may be cached aggressively by CDN.
- Netlify Functions folder: netlify/functions/ — keep serverless endpoints here and reference them by their deployed path. netlify.toml maps functions = "netlify/functions".
- Blog routing: netlify.toml includes redirects to ensure trailing slashes for blog routes (e.g., /blog/posts/:slug/). When adding posts, follow the existing folder structure (blog/posts/<slug>/index.html).
- Fonts: tailwind.config.js defines 'michroma' and 'montserrat' families — use these tokens in templates when matching site style.

## AI / assistant-related files discovered
- .claude/settings.json and .claudeignore exist. Respect these when running AI agents or including files in prompts.
- No existing .github/copilot-instructions.md prior to this create (this file now). No AGENTS.md, CLAUDE.md, .windsurfrules, or other assistant rules files were present.

## Quick notes for Copilot sessions
- Primary tasks Copilot will be asked to help with: CSS changes (Tailwind), updating static HTML, and small Netlify Function edits. Keep changes focused and avoid adding heavy JS build tooling unless requested.
- When changing Tailwind config or adding new template files, update tailwind.config.js content array so classes are not purged.
- Be conservative about modifying src/output.css directly: prefer editing src/input.css and running npm run build-css to regenerate.

---

If more detail is desired (e.g., local Netlify function testing with Netlify CLI, adding automated tests or linters), say which area to expand and Copilot will add focused instructions.
