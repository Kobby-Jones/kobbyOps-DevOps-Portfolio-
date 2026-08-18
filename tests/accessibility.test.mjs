import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

test("admin editor modals expose dialog semantics and keyboard focus management", async () => {
  const source = await read("src/components/admin/AdminConsole.tsx");

  for (const id of ["content-editor-title", "resource-editor-title", "service-editor-title"]) {
    assert.match(source, new RegExp(`aria-labelledby="${id}"`));
    assert.match(source, new RegExp(`id="${id}"`));
  }

  assert.equal((source.match(/role="dialog"/g) || []).length, 3);
  assert.equal((source.match(/aria-modal="true"/g) || []).length, 3);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /event\.key !== 'Tab'/);
  assert.match(source, /previousFocusRef\.current\?\.focus\(\)/);
});

test("global keyboard focus remains visibly indicated", async () => {
  const css = await read("src/app/globals.css");
  assert.match(css, /a:focus-visible/);
  assert.match(css, /button:focus-visible/);
  assert.match(css, /input:focus-visible/);
  assert.match(css, /textarea:focus-visible/);
  assert.match(css, /select:focus-visible/);
  assert.match(css, /outline:\s*2px\s+solid/);
});

test("Phase 3 and 4 additions retain mobile-first responsive layouts", async () => {
  const admin = await read("src/components/admin/AdminConsole.tsx");
  const resources = await read("src/app/(site)/resources/page.tsx");
  const resource = await read("src/app/(site)/resources/[slug]/page.tsx");
  const order = await read("src/app/(site)/order/[token]/page.tsx");
  const orderComplete = await read("src/app/(site)/order/complete/page.tsx");

  assert.match(admin, /admin-tab-list[^\n]*overflow-x-auto/);
  assert.match(admin, /flex flex-col justify-between gap-4 lg:flex-row/);
  assert.match(resources, /md:grid-cols-2/);
  assert.match(resource, /grid gap-10 lg:grid-cols-/);
  assert.match(resource, /w-full justify-center/);
  assert.match(order, /max-w-2xl/);
  assert.match(orderComplete, /flex flex-wrap justify-center gap-3/);
});

test("checkout fields have programmatic labels and error announcements", async () => {
  const checkout = await read("src/components/site/ResourceCheckout.tsx");
  assert.match(checkout, /<label className="form-label mt-5">[\s\S]*Name[\s\S]*<input/);
  assert.match(checkout, /<label className="form-label mt-4">[\s\S]*Email[\s\S]*<input/);
  assert.match(checkout, /role="alert"/);
  assert.match(checkout, /type="email"/);
  assert.match(checkout, /autoComplete="email"/);
});

test("Vanta hero enhancement preserves reduced-motion and transactional focus", async () => {
  const controller = await read("src/components/site/HeroVantaController.tsx");
  const css = await read("src/app/globals.css");

  assert.match(controller, /prefers-reduced-motion: reduce/);
  assert.match(controller, /STATIC_HERO_PREFIXES = \["\/order", "\/privacy"\]/);
  assert.match(controller, /mouseControls: false/);
  assert.match(controller, /touchControls: false/);
  assert.match(controller, /import\("vanta\/dist\/vanta\.waves\.min"\)/);
  assert.match(controller, /backgroundAlpha: 0/);
  assert.doesNotMatch(css, /vanta-hero-active::after/);
  assert.doesNotMatch(css, /\.hero-section\.vanta-hero-active > \.hero-grid\s*\{[^}]*opacity:/s);
  assert.match(css, /\.hero-grid\s*\{[^}]*opacity:\s*0\.13;/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.vanta-canvas/);
});
