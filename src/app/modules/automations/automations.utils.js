import { google } from 'googleapis';
import puppeteer from 'puppeteer';

// Save leads to Google Sheets
const appendToSheet = async (rows) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  console.log(`✅ Saved ${rows.length} leads to Google Sheets`);
};

// Scrape FB Ad Library manually
export const scrapeAdLibrary = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  console.log('🌐 Opening FB Ad Library...');
  await page.goto(process.env.FB_AD_LIBRARY_URL, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  console.log(
    '⚠️ Please select the country, ad category, and type your search keyword manually in the browser.'
  );
  console.log('Press Enter in the console when you are ready to continue scraping...');
  await new Promise((resolve) => process.stdin.once('data', () => resolve()));

  console.log('✅ Continuing script after manual selection...');

  await page.waitForTimeout(3000);

  // Scroll to load more results
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(2000);
  }

  // Extract ad data
  const results = await page.evaluate(() => {
    const ads = [];
    document.querySelectorAll("a[role='link']").forEach((el) => {
      const name = el.innerText.trim();
      const link = el.href;
      if (name && link.includes('facebook.com')) {
        ads.push([name, link]); // Wrap in array for Google Sheets
      }
    });
    return ads;
  });

  await browser.close();

  // Send results to Google Sheets
  if (results.length > 0) {
    await appendToSheet(results);
  } else {
    console.log('⚠️ No ads found to save.');
  }

  return results;
};

// Export utilities
export const AumationUtils = {
  appendToSheet,
  scrapeAdLibrary,
};
