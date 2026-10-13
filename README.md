# @ecsplico/brand

Skaile brand → Nuxt UI 4 bridge. `nuxt-ui.css` imports
[`@skaile/brand/theme.css`](https://www.npmjs.com/package/@skaile/brand) and
maps its variables onto the semantic `--ui-*` tokens Nuxt UI components read,
so every Nuxt UI component takes the brand palette, radius and light/dark
switch without per-app overrides.

`@skaile/brand` stays framework-neutral (tokens, CSS variables, Tailwind
preset, assets). Everything Nuxt UI-specific lives here.

## Use

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

## What it sets

| Selector | Effect |
|---|---|
| `:root, .light, .dark` | `--ui-primary/secondary/success/warning/error/info`, `--ui-bg-*`, `--ui-text-*`, `--ui-border-*`, `--ui-radius` from the brand variables |
| `.dark .bg-inverted` | label on solid-neutral surfaces takes the dark page colour |
| `.dark` | `--ui-primary` switches to `--color-primary-bright`; #7300ff is ~2.3:1 on the dark page |

An app with its own dark selector (forge-common's `.forge-project-dark`) has to
repeat the `--ui-*` mapping under that selector, because a custom property
referencing another is resolved where it is declared.

## Develop

```bash
bun install
bun test   # every brand variable the bridge reads must exist in theme.css, light and dark
```

## Release

Bump `version` in `package.json`, commit, then `git tag vX.Y.Z && git push origin vX.Y.Z`.
`.github/workflows/publish.yml` tests and publishes to npmjs (repository secret
`NPM_TOKEN`, publish rights on the `@ecsplico` scope).
