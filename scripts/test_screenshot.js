const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function test() {
  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  console.log('Using browser at:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const testDir = path.join(__dirname, '..', 'docs', 'capturas');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  await page.screenshot({ path: path.join(testDir, 'test_landing.png') });
  console.log('Screenshot saved to docs/capturas/test_landing.png');

  await browser.close();
}

test().catch(console.error);
