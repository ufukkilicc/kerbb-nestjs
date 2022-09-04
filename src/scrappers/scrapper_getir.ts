const puppeteer = require('puppeteer');

export const getir = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
    headless: true,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  await page.goto('https://career.getir.com/#job-section', {
    waitUntil: 'load',
  });
  await page.waitForSelector('.opening');
  await page.select('select#office-container', 'Turkey');
  let jobCards = await page.$$('.opening');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('div.opening-details > a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('div.opening-details > a').innerText,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) => el.getAttribute('data-office_id'),
      jbCard,
    );
    if (job_location.includes('Turkey')) {
      jobs.push({
        job_link,
        job_title,
        job_location,
        scrape_name: 'getir',
      });
    }
  }
  await browser.close();
  return jobs;
};
