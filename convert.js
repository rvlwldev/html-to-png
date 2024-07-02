const puppeteer = require('puppeteer');
const fs = require('fs');

async function convertHtmlToPng(htmlFilePath, outputFilePath) {
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: outputFilePath, fullPage: true });

  await browser.close();
}

module.exports = { convertHtmlToPng };
