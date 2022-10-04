const puppeteer = require('puppeteer');

export const trendyol = async () => {
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
  await page.goto('https://jobs.lever.co/trendyol', {
    waitUntil: 'load',
  });
  await page.waitForSelector('.posting');
  let jobCards = await page.$$('.posting');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('a h5').textContent,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('a .posting-categories span.sort-by-location')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace(' (All)', '')
          .replace(' (all)', '')
          .replace('I', 'İ')
          .replace(' /', ',')
          .replace('Turkey', 'Türkiye')
          .trim(),
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);

    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location,
        scrape_name: 'trendyol',
      });
    }
  }
  await browser.close();
  return jobs;
};
