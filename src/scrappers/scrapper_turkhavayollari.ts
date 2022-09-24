const puppeteer = require('puppeteer');

export const turkhavayollari = async () => {
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
  await page.goto('https://careers.turkishairlines.com/acik-pozisyonlar', {
    waitUntil: 'load',
  });
  await page.waitForSelector(
    '#ctl00_ContentPlaceHolder1_RptJobs2_ctl00_JobSection > div > table > tbody > tr',
  );
  let jobCards = await page.$$(
    '#ctl00_ContentPlaceHolder1_RptJobs2_ctl00_JobSection > div > table > tbody > tr',
  );
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelectorAll('a')[0].href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelectorAll('a')[0].textContent,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelectorAll('a')[1]
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location,
      scrape_name: 'turkhavayollari',
    });
  }
  await browser.close();
  return jobs;
};
