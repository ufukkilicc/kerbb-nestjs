const puppeteer = require('puppeteer');

export const ciceksepeti = async () => {
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
  await page.goto('https://jobs.lever.co/ciceksepeti', {
    waitUntil: 'load',
  });
  await page.waitForSelector('.posting');
  let jobCards = await page.$$('.posting');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a.posting-title').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('a.posting-title h5').textContent,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector(
            'a.posting-title .posting-categories span.sort-by-location ',
          )
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace('Turkey', 'Türkiye')
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location,
      scrape_name: 'ciceksepeti',
    });
  }
  await browser.close();
  return jobs;
};
