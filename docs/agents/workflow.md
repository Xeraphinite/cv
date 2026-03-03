# Workflow

## Tooling
- Always use `pnpm`.
- Run the local Next.js dev server with `pnpm dev` on Next.js 16+.
- Update `AGENTS.md` whenever a reusable project convention or user preference changes.
- Prefer local Git hooks (`husky` + `lint-staged`) over CI-only enforcement; staged files should run Biome formatting and Tailwind class sorting/dedup lint.

## MCP / Browser Validation
- Keep workspace-local VS Code MCP config in `.vscode/mcp.json` using `next-devtools-mcp@latest` when this project needs Next MCP discovery.
- For Next.js work in this repo, initialize `next-devtools` first and follow its `init` guidance when the server is available.
- For browser inspection, layout debugging, console/network investigation, or visual verification, prefer `chrome-devtools` when available.
- For UI/layout/style changes, validate with Playwright before finalizing.
- For UI/layout/style changes, also run an accessibility check via Playwright before finalizing.
