const puppeteer = require('puppeteer');

export const acibadem = async () => {
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
  await page.goto('https://kariyer.acibadem.com.tr/Basvur', {
    waitUntil: 'load',
  });

  let jobCards = await page.$$('li.list-group-item');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_id = await page.evaluate(
      (el) => el.querySelector('div.job-apply-button').getAttribute('id'),
      jbCard,
    );
    const job_link = `https://kariyer.acibadem.com.tr/IlanBilgileri?j=${job_id}`;
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('div.job-position-name')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .split('(')[0]
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location: 'Türkiye',
      scrape_name: 'acibadem',
    });
  }
  await browser.close();
  return jobs;
};
