/* Genera los PDF de demo (rider técnico + press kit) usando el Chrome del sistema */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/demo');
mkdirSync(outDir, { recursive: true });

const fonts = {
  fraunces: pathToFileURL(
    resolve(root, 'node_modules/@fontsource-variable/fraunces/full.css')
  ).href,
  dmsans: pathToFileURL(
    resolve(root, 'node_modules/@fontsource-variable/dm-sans/index.css')
  ).href,
};

const base = (title, body) => `<!DOCTYPE html>
<html lang="es-AR"><head><meta charset="utf-8">
<link rel="stylesheet" href="${fonts.fraunces}">
<link rel="stylesheet" href="${fonts.dmsans}">
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #F4EFE6;
    color: #121310;
    font-family: 'DM Sans Variable', system-ui, sans-serif;
    font-size: 10.5pt;
    line-height: 1.5;
  }
  h1, h2, h3 { font-family: 'Fraunces Variable', Georgia, serif; margin: 0; }
  h1 { font-size: 30pt; line-height: 1.05; font-weight: 600; }
  h2 {
    font-size: 13pt;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
    color: #C85A32;
    border-bottom: 1px solid rgba(18,19,16,0.2);
    padding-bottom: 4px;
    margin: 20px 0 10px;
  }
  .band { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
  .eyebrow { font-size: 8pt; letter-spacing: 0.28em; text-transform: uppercase; color: #5C7A4E; margin-bottom: 6px; }
  .logo { font-family: 'Fraunces Variable', Georgia, serif; font-size: 15pt; letter-spacing: 0.06em; }
  .rule { height: 4px; background: #D99B26; margin: 14px 0 0; }
  .meta { text-align: right; font-size: 9pt; color: #4a4a42; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 4px 0; vertical-align: top; border-bottom: 1px solid rgba(18,19,16,0.09); }
  td:first-child { width: 34%; font-weight: 600; }
  ul { margin: 6px 0 0; padding-left: 18px; }
  li { margin-bottom: 3px; }
  .cols { display: flex; gap: 22px; }
  .cols > div { flex: 1; }
  .quote { border-left: 3px solid #D99B26; padding-left: 10px; margin: 0 0 10px; font-style: italic; }
  .quote span { display: block; font-style: normal; font-size: 8.5pt; color: #4a4a42; margin-top: 3px; }
  .foot { margin-top: 22px; padding-top: 10px; border-top: 1px solid rgba(18,19,16,0.2); font-size: 8.5pt; color: #4a4a42; display: flex; justify-content: space-between; }
  .note { background: #E7DDCB; padding: 8px 10px; font-size: 9pt; }
</style></head>
<body>${body}
</body></html>`;

const rider = base(
  'Rider',
  `<div class="band">
    <div>
      <div class="eyebrow">Rider técnico · 2026</div>
      <h1>Suma Paciencia</h1>
      <div class="logo">SUMA PACIENCIA</div>
    </div>
    <div class="meta">
      Concepción del Uruguay, Entre Ríos<br>
      8 integrantes · 7 piezas + backing<br>
     -booking@sumapaciencia.com.ar<br>
      +54 9 344 200 0000
    </div>
  </div>
  <div class="rule"></div>

  <h2>Escenario y montaje</h2>
  <table>
    <tr><td>Escenario mínimo</td><td>8 m x 6 m (6 x 6 m en salas chicas), piso nivelado, sin gradas, acceso lateral a tablero.</td></tr>
    <tr><td>Montaje</td><td>Backline en línea (no en U). 30 minutos de cambio de set. 15 minutos de prueba de sonido.</td></tr>
    <tr><td>Escaleras</td><td>Dos escaleras necesarias, lado izquierdo del escenario.</td></tr>
    <tr><td>Cortina</td><td>No se utiliza cortina. Entrada de banda por costado.</td></tr>
  </table>

  <h2>Backline y equipo</h2>
  <div class="cols">
    <div>
      <ul>
        <li>Batería: kit 22” (ride, crash, hi-hat, tom y floor), pedal de hi-hat, 2-stage, se acepta uso del local.</li>
        <li>Amplificador de bajo: 4x10 combo o similar, con línea separate.</li>
        <li>Amplificador de guitarra: valvular 100W o 120W, AES.</li>
        <li>Teclado: piano o Rhodes con pedestal.</li>
      </ul>
    </div>
    <div>
      <ul>
        <li>Cajas para saxofón, trompeta y flauta (soplo): 2 microfonos wireless tipo SM58 para saxofón y trompeta, y 1 condensador para flauta.</li>
        <li>Steelpan: placas de metal percusión.</li>
        <li>Micrófonos: 2 SM58 (vocales), 2 cardioides (sax/trompeta), 1 condensador (flauta).</li>
        <li>Cajón/perchero para cables y backline.</li>
      </ul>
    </div>
  </div>

  <h2>Patch de sonido sugerido</h2>
  <table>
    <tr><td>1-2</td><td>Recitados (Pablo y Sebastián Glezer) — SM58</td></tr>
    <tr><td>3</td><td>Guitarra — SM57</td></tr>
    <tr><td>4</td><td>Bajo — DI + THD</td></tr>
    <tr><td>5-6</td><td>Teclados — L/R</td></tr>
    <tr><td>7</td><td>Batería overhead — cardioide</td></tr>
    <tr><td>8-10</td><td>Toms y caja — cardioides</td></tr>
    <tr><td>11</td><td>Platos (metal) — 2 micros cardioides</td></tr>
    <tr><td>12-13</td><td>Saxofón y trompeta — wireless / cardioide</td></tr>
    <tr><td>14</td><td>Flauta — condensador</td></tr>
    <tr><td>AUX 1</td><td>Backline (pre-amp)</td></tr>
  </table>

  <h2>Sonido e iluminación</h2>
  <ul>
    <li>Sonido: PA con sistema de microfonía completo, sub y front fill. Consola de 32 canales con líneas XLR.</li>
    <li>Monitorización: 4 wedges de mezcla (2 al frente y 2 atrás) + in-ear opcional con split propio de la banda.</li>
    <li>Iluminación: 8 frontales en piso, 6 laterales, contraluz y 2 para batería. 12 focos LED de color.</li>
  </ul>

  <h2>Hospitality y logística</h2>
  <div class="cols">
    <div>
      <ul>
        <li>Agua y refrescos en camerino antes de la función.</li>
        <li>Sandwich o vianda vegetariana para 9 personas (1 sin gluten).</li>
        <li>Espacio de camerino con mesa, sillas, espejo y enchufe.</li>
      </ul>
    </div>
    <div>
      <ul>
        <li>Estacionamiento cercano para dos utilitarios y una van.</li>
        <li>Carga y descarga con acceso permitido al palco.</li>
        <li>Coordinación de logística con producción hasta 72 h antes del show.</li>
      </ul>
    </div>
  </div>

  <div class="note">Este documento es una maqueta de demostración. Los datos reales de rider se gestionan desde el panel de administración (/admin → EPK y contacto).</div>

  <div class="foot">
    <span>Suma Paciencia · Concepción del Uruguay, Entre Ríos</span>
    <span>sumapaciencia.com.ar</span>
  </div>`
);

const presskit = base(
  'Press kit',
  `<div class="band">
    <div>
      <div class="eyebrow">Press kit · 2026</div>
      <h1>Todo queda acá</h1>
      <div class="logo">SUMA PACIENCIA</div>
    </div>
    <div class="meta">
      Reggae roots · Concepción del Uruguay<br>
      Tercer disco · 9 canciones · 37:30<br>
      Editado por Impronta Music (2026)
    </div>
  </div>
  <div class="rule"></div>

  <h2>Biografía corta</h2>
  <p>Suma Paciencia nació en el 2009 en Concepción del Uruguay, Entre Ríos, y desde su primer recital —6 de junio de 2009— no dejó de crecer ni de tocar. La banda se construyó alrededor de la voz de Pablo Glezer y el rap de Sebastián Glezer. Tres discos, más de una década y media de escenario y un sonido que mezcla roots, soul, ska y fusion.</p>

  <h2>Biografía extendida</h2>
  <p>El primer álbum homónimo (2016) se grabó en Salas Gallo y contó con la colaboración de Pablo Molina en “Celebra” y Hugo Lobo en “Depende de mí”. En 2018 llegaron a los estudios Romaphonic para grabar un EP en vivo, uno de los espacios de grabación más importantes de Latinoamérica. Desde entonces el sonido se abrió: reggae roots, soul, ska, fusion y rock conviven en la misma playlist.</p>
  <p>En 2026 publicaron “Todo queda acá”, su tercer disco, con nueve canciones que mezclan roots, lovers y steppers, con invitados como Ras Kuko y Nonpalidece. Entre los escenarios compartidos se cuentan Los Cafres, Nonpalidece, Gondwana, Eruca Sativa, Kapanga, Riddim, Kameleba, Natty Combo y Alika y la Nueva Alianza.</p>

  <h2>Conformación</h2>
  <table>
    <tr><td>Pablo Glezer</td><td>Voces</td></tr>
    <tr><td>Sebastián Glezer</td><td>Voces y rap</td></tr>
    <tr><td>Agustín Anselmino</td><td>Saxofón</td></tr>
    <tr><td>Franco Traverso</td><td>Guitarra</td></tr>
    <tr><td>Miguel Mercanzini</td><td>Batería</td></tr>
    <tr><td>Franco Ratzkov</td><td>Bajo</td></tr>
    <tr><td>Jony Deny</td><td>Teclados</td></tr>
    <tr><td>Carlos Arrizabalaga</td><td>Flauta</td></tr>
    <tr><td>Néstor Zwenger</td><td>Trompeta</td></tr>
  </table>

  <h2>Discografía</h2>
  <table>
    <tr><td>Todo queda acá (2026)</td><td>9 canciones · 37:30 · guests: Ras Kuko, Nonpalidece</td></tr>
    <tr><td>En Vivo – Estudio Romaphonic (2018)</td><td>EP en vivo</td></tr>
    <tr><td>Suma Paciencia (2016)</td><td>Disco debut · “Celebra”, “Depende de mí”</td></tr>
  </table>

  <h2>Notas de prensa</h2>
  <p class="quote">“Un camino de 16 años: nunca dejaron de crecer y de tocar.”<span>La Mala</span></p>
  <p class="quote">“Suma Paciencia amplía su propuesta de reggae con cruces de soul.”<span>Indie Hoy</span></p>
  <p class="quote">“Influenciados por el sonido jamaicano de los 70, fiddlearon un proyecto de canciones propias.”<span>Reggae.es</span></p>

  <h2>Material gráfico</h2>
  <ul>
    <li>Fotos en alta resolución disponibles para prensa.</li>
    <li>Arte de tapa y material de diseño del álbum “Todo queda acá”.</li>
    <li>Logotipos en vector para usos editoriales.</li>
  </ul>

  <div class="foot">
    <span>Prensa: prensa@sumapaciencia.com.ar · +54 9 344 200 0000</span>
    <span>sumapaciencia.com.ar</span>
  </div>`
);

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });

async function render(name, html) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: resolve(outDir, name),
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '16mm', right: '16mm' },
  });
  await page.close();
  console.log('OK', name);
}

await render('rider-suma-paciencia.pdf', rider);
await render('press-kit-suma-paciencia.pdf', presskit);

await browser.close();
process.exit(0);
