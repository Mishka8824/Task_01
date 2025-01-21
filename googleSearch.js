const { chromium } = require('playwright');
require('dotenv').config();
const emailSender = require('./util/emailSender');

(async () => {
  let browser, context, page;

  try {
    // Launch the browser and create context and page
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    // Navigate to Google and accept cookies
    await page.goto('https://www.google.com', { waitUntil: 'load' });

    try {
      // Check if the "I agree" button appears for cookies and click it
      await page.click('text=I agree', { timeout: 3000 });
    } catch (error) {
      console.log('No cookie prompt appeared.');
    }

    // Enter the search query and submit
    const searchQuery = 'Main Battle Tanks';
    const inputSelector = 'textarea[name="q"]';
    // await page.fill(inputSelector, searchQuery);
    await page.locator(inputSelector).pressSequentially(searchQuery, { delay: 200 });
    await page.locator(inputSelector).press('Enter'); // Simulate pressing Enter to search

    // Wait for results to load (Google results)
    await page.waitForSelector('#search', { timeout: 20000 });
    await page.waitForTimeout(5000);
    // Extract the top 5 search results
    const results = [];
    const locator = page.locator('#search .tF2Cxc');
    const count = await locator.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = locator.nth(i);
      const title = await element.locator('h3').textContent() || 'No title';

      // Refine the <a> locator to select the first link explicitly
      const url = await element.locator('a').first().getAttribute('href') || 'No URL';
      results.push({ title: title.trim(), url });
    }

    // Log the results
    console.log('Top 5 Google search results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title} - ${result.url}`);
    });

    // Format the results as an HTML string
    const resultsHtml = results
      .map((result, index) => `<p>${index + 1}. <a href="${result.url}">${result.title}</a></p>`)
      .join('');

    // Send the results via email
    await emailSender(results, resultsHtml, searchQuery);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close browser regardless of success or failure
    if (browser) await browser.close();
  }
  console.log('Script execution completed.');
})();
