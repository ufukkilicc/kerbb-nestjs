const puppeteer = require('puppeteer');

export const mastercard = async () => {
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
  await page.goto('https://mastercard.jobs/tur/jobs/', {
    waitUntil: 'load',
  });
  await page.waitForSelector('li.direct_joblisting');
  let jobCards = await page.$$('li.direct_joblisting');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('h4 a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('h4 a span').textContent,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('.direct_joblocation span')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace('Istanbul', 'İstanbul')
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
        scrape_name: 'mastercard',
      });
    }
  }
  await browser.close();
  return jobs;
};
