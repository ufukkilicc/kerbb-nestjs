const puppeteer = require('puppeteer');

export const peak = async () => {
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
  await page.goto('https://peak.com/open-positions', {
    waitUntil: 'load',
  });
  await page.waitForSelector('a.clickable-card');
  let jobCards = await page.$$('a.clickable-card');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate((el) => el.href, jbCard);
    const job_title = await page.evaluate(
      (el) => el.querySelector('h4').textContent,
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);

    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location: 'Türkiye',
        scrape_name: 'peak',
      });
    }
  }
  await browser.close();
  return jobs;
};
