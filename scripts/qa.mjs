/* QA visual: usa el Chrome del sistema (sin descargar chromium) */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.QA_BASE ?? 'http://localhost:3000';
const OUT = '/tmp/sp-qa';
mkdirSync(OUT, { recursive: true });

const routes = [
  ['home', '/'],
  ['shows', '/shows'],
  ['musica', '/musica'],
  ['galeria', '/galeria'],
  ['epk', '/epk'],
  ['tienda', '/tienda'],
  ['producto', '/tienda/remera-todo-queda-aca'],
  ['checkout', '/checkout'],
  ['login', '/admin/login'],
];

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--no-sandbox'],
});

const errors = [];

async function shoot(name, path, viewport, full = true) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${name}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[${name}] pageerror: ${err.message}`));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Scroll para disparar el lazy-loading de las imágenes
  await page.evaluate(async () => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < root.scrollHeight; y += step) {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    root.style.scrollBehavior = prev;
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => {
    for (const img of document.images) {
      img.loading = 'eager';
      if (img.dataset.src) img.src = img.dataset.src;
    }
  });
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((res) => {
              img.onload = img.onerror = res;
              setTimeout(res, 3000);
            })
        )
    )
  );
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}-${viewport.width}.png`, fullPage: full });
  await context.close();
}

for (const [name, path] of routes) {
  await shoot(name, path, { width: 1440, height: 900 });
  await shoot(name, path, { width: 390, height: 844 });
}

// Flujo admin: login demo + dashboard + tienda
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', (err) => errors.push(`[admin] pageerror: ${err.message}`));
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#admin-email', 'admin@sumapaciencia.com');
await page.fill('#admin-password', 'suma2026');
await page.click('button[type="submit"]');
await page.waitForURL('**/admin', { timeout: 8000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/admin-dashboard.png`, fullPage: true });
await page.goto(`${BASE}/admin/tienda`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/admin-tienda.png`, fullPage: true });
await page.goto(`${BASE}/admin/epk`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/admin-epk.png`, fullPage: true });
await context.close();

// Flujo de compra: agregar al carrito y abrir el drawer
const shop = await browser.newContext({ viewport: { width: 390, height: 844 } });
const shopPage = await shop.newPage();
shopPage.on('pageerror', (err) => errors.push(`[shop] pageerror: ${err.message}`));
await shopPage.goto(`${BASE}/tienda`, { waitUntil: 'networkidle' });
await shopPage.waitForTimeout(500);
const addButtons = shopPage.getByRole('button', { name: /Agregar al pedido/i });
await addButtons.first().click();
await shopPage.waitForTimeout(700);
await shopPage.screenshot({ path: `${OUT}/carrito-mobile.png` });
await shop.close();

await browser.close();

console.log('Capturas en', OUT);
if (errors.length) {
  console.log('\nERRORES DE CONSOLA:');
  for (const e of [...new Set(errors)]) console.log(' -', e);
} else {
  console.log('Sin errores de consola.');
}

process.exit(0);
