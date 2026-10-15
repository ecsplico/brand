# @ecsplico/brand

Nuxt UI 4 themes for ecsplico apps. Pick one per app:

| Theme | Files | For |
|---|---|---|
| Skaile brand bridge | `nuxt-ui.css` | apps in the Skaile brand (forge, markboard, …) |
| ecsplico default | `default/nuxt-ui.css` + `default/app-config` | internal ecsplico apps without a brand of their own |

## Skaile brand bridge

`nuxt-ui.css` imports
[`@skaile/brand/theme.css`](https://www.npmjs.com/package/@skaile/brand) and
maps its variables onto the semantic `--ui-*` tokens Nuxt UI components read,
so every Nuxt UI component takes the brand palette, radius and light/dark
switch without per-app overrides.

`@skaile/brand` stays framework-neutral (tokens, CSS variables, Tailwind
preset, assets). Everything Nuxt UI-specific lives here.

### Use

```bash
bun add @ecsplico/brand
```

```css
@import "tailwindcss";
@import "@nuxt/ui";
@import "@ecsplico/brand/nuxt-ui.css"; /* after @nuxt/ui: same specificity, source order decides */
```

`@skaile/brand` comes in as a dependency; the app does not need to list it.
Dark mode follows the `.dark` class Nuxt UI's color mode puts on `<html>`.

### What it sets

| Selector | Effect |
|---|---|
| `:root, .light, .dark` | `--ui-primary/secondary/success/warning/error/info`, `--ui-bg-*`, `--ui-text-*`, `--ui-border-*`, `--ui-radius` from the brand variables |
| `.dark .bg-inverted` | label on solid-neutral surfaces takes the dark page colour |
| `.dark` | `--ui-primary` switches to `--color-primary-bright`; #7300ff is ~2.3:1 on the dark page |

An app with its own dark selector (forge-common's `.forge-project-dark`) has to
repeat the `--ui-*` mapping under that selector, because a custom property
referencing another is resolved where it is declared.

## ecsplico default theme

A [Nuxt UI Theme Studio](https://ui.nuxt.com/theme) export, split into its two
halves: warning `amber`, neutral `mist`, Roboto at a 15px root size, heroicons,
soft buttons/badges/inputs, and lighter neutral surfaces than stock Nuxt UI.

```bash
bun add @ecsplico/brand @iconify-json/heroicons
```

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
@import "@ecsplico/brand/default/nuxt-ui.css"; /* after @nuxt/ui */
```

```ts
// app/app.config.ts
import ecsplicoDefault from '@ecsplico/brand/default/app-config'

export default defineAppConfig(ecsplicoDefault)
```

- Needs Tailwind CSS ≥ 4.2 (the `mist` palette); Nuxt UI 4.11 brings it.
- `@iconify-json/heroicons` is an optional peer: without it Nuxt Icon fetches
  each icon from the Iconify API at runtime.
- Roboto is self-hosted by `@nuxt/fonts` (part of Nuxt UI) from the
  `--font-sans` declaration.
- App-specific overrides: merge, don't spread, so nested keys survive:
  `defineAppConfig(defu({ ui: { colors: { primary: 'teal' } } }, ecsplicoDefault))`.

To change the theme, open the Theme Studio link in the header of
`src/default/nuxt-ui.css`, edit, and replace both files with the new export.

## Develop

```bash
bun install
bun test   # every brand variable the bridge reads must exist in theme.css, light and dark
```

## Release

Bump `version` in `package.json`, commit, then `git tag vX.Y.Z && git push origin vX.Y.Z`.
`.github/workflows/publish.yml` tests and publishes to npmjs (repository secret
`NPM_TOKEN`, publish rights on the `@ecsplico` scope).
