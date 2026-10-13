import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const COMMENT = /\/\*[\s\S]*?\*\//g;

const bridge = readFileSync(new URL("./nuxt-ui.css", import.meta.url), "utf8").replace(COMMENT, "");
const theme = readFileSync(
  fileURLToPath(import.meta.resolve("@skaile/brand/theme.css")),
  "utf8",
).replace(COMMENT, "");

/** Custom properties declared by the theme rule whose selector list contains `selector`. */
function declaredIn(selector: string): Set<string> {
  for (const [, selectors, body] of theme.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selectors.split(",").some((s) => s.trim() === selector)) {
      return new Set([...body.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
    }
  }
  throw new Error(`@skaile/brand/theme.css has no rule for ${selector}`);
}

const referenced = [...new Set([...bridge.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];

// A brand variable the bridge reads but the theme no longer declares leaves the
// matching --ui-* token unset, and Nuxt UI silently paints with its defaults.
describe("every brand variable the bridge reads is declared by @skaile/brand/theme.css", () => {
  for (const mode of [":root", ".dark"]) {
    test(mode, () => {
      const declared = declaredIn(mode);
      expect(referenced.filter((v) => !declared.has(v))).toEqual([]);
    });
  }
});
