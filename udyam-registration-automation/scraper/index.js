const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';

  
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForTimeout(1500);

  const fields = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('input, select, textarea'));
    const getLabel = (el) => {
      if (el.id) {
        const l = document.querySelector(`label[for="${el.id}"]`);
        if (l) return l.innerText.trim();
      }
      const parentLabel = el.closest('label');
      if (parentLabel) return parentLabel.innerText.trim();
      if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
      return el.placeholder || '';
    };
    return nodes.map(n => ({
      tag: n.tagName.toLowerCase(),
      type: n.type || null,
      id: n.id || null,
      name: n.name || null,
      label: getLabel(n),
      required: !!(n.required || n.getAttribute('aria-required') === 'true'),
      pattern: n.getAttribute('pattern') || null,
      maxlength: n.getAttribute('maxlength') || null,
      placeholder: n.placeholder || null
    })).filter(x => x.name || x.id);
  });

  const out = { source: url, extractedAt: new Date().toISOString(), fields };
  const outPath = path.resolve(__dirname, 'schema.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('Wrote schema.json with', fields.length, 'fields');

  await browser.close();
})();
