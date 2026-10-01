# Agent instructions

These instructions apply when creating or changing a screen, settings tab, table, toolbar, modal, or chart in `apps/koku-ui-hccm` or `apps/koku-ui-ros`. They do not apply to `apps/koku-ui-sources` or `apps/koku-ui-onprem`. Sources has its own instructions. The on-prem app is a shell, not this route UI.

Follow `.cursor/rules/hccm-ui-style.mdc` as well. Cursor attaches that rule when route files in either app are open. It is a short reminder of the same standards, not a second copy. Before writing any component, read:

- `.cursor/skills/transform-generated-ui/organization.md`
- `.cursor/skills/transform-generated-ui/composition.md`
- `.cursor/skills/transform-generated-ui/presentation.md`
- `.cursor/skills/transform-generated-ui/data.md`

Generate that structure on the first pass. Do not leave a flat prototype for a later transform.

Before writing a page, a table, or an action, open one of each under `apps/koku-ui-hccm/src/routes/settings/exchangeRates` or `priceLists`, including when the new feature is in `apps/koku-ui-ros`. Do not copy those directory or file names. Do not use the settings integrations feature as a style reference.

`.cursor/skills/transform-generated-ui/SKILL.md` is only for rewriting an existing generated tree (`/transform-generated-ui`). Creating a new feature uses `.cursor/skills/create-hccm-ui/SKILL.md`.
