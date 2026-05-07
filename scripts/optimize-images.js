const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const defaultBreakpoints = [480, 768, 1024, 1440, 1920];
const jobs = [
  { input: 'image.webp', base: 'image', widths: defaultBreakpoints },
  { input: 'Tbilisi_old_Town.webp', base: 'tbilisi-old-town', widths: defaultBreakpoints },
  { input: 'Kazbegi.webp', base: 'Kazbegi', widths: defaultBreakpoints },
  { input: 'logo.jpeg', base: 'logo', widths: [256, 512] },
  { input: 'Batumi.webp', base: 'Batumi', widths: defaultBreakpoints },
  { input: 'Signagi.webp', base: 'Signagi', widths: defaultBreakpoints },
  { input: 'Martvili.webp', base: 'Martvili', widths: defaultBreakpoints },
  { input: 'Tbilisi.webp', base: 'Tbilisi', widths: defaultBreakpoints }
];

const report = [];

(async () => {
  for (const job of jobs) {
    if (!fs.existsSync(job.input)) continue;
    for (const w of job.widths) {
      const webpOut = `${job.base}-${w}.webp`;
      const avifOut = `${job.base}-${w}.avif`;
      await sharp(job.input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 65, smartSubsample: true }).toFile(webpOut);
      await sharp(job.input).resize({ width: w, withoutEnlargement: true }).avif({ quality: 40, effort: 6 }).toFile(avifOut);
      console.log(`generated ${webpOut} + ${avifOut}`);
      report.push({
        input: job.input,
        width: w,
        webp: { file: webpOut, bytes: fs.statSync(webpOut).size },
        avif: { file: avifOut, bytes: fs.statSync(avifOut).size }
      });
    }
  }

  const reportPath = path.resolve('scripts/audit/perf/image-optimization-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
  console.log(`report written to ${reportPath}`);
})();
