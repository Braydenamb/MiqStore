const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`BROWSER CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    console.log(`UNCAUGHT EXCEPTION: ${exception}`);
  });

  console.log("Navigating to homepage...");
  const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  console.log(`Status: ${response.status()}`);

  // Wait a bit just in case
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
