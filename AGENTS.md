# Agent instructions

These instructions apply when creating or changing a screen, settings tab, table, toolbar, modal, or chart in `apps/koku-ui-hccm`. They do not apply to `apps/koku-ui-sources`, `apps/koku-ui-ros`, or `apps/koku-ui-onprem`. Those apps keep their own instructions.

Before writing any component, read:

- `.cursor/skills/transform-generated-ui/organization.md`
- `.cursor/skills/transform-generated-ui/composition.md`
- `.cursor/skills/transform-generated-ui/presentation.md`
- `.cursor/skills/transform-generated-ui/data.md`

Generate that structure on the first pass. Do not leave a flat prototype for a later transform.

Before writing a page, a table, or an action, open one of each under `apps/koku-ui-hccm/src/routes/settings/exchangeRates` or `priceLists`. Do not copy those directory or file names. Do not use the settings integrations feature as a style reference.

`.cursor/skills/transform-generated-ui/SKILL.md` is only for rewriting an existing generated tree (`/transform-generated-ui`). Creating a new feature uses `.cursor/skills/create-hccm-ui/SKILL.md`.
