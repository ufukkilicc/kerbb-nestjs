const puppeteer = require('puppeteer');

export const binance = async () => {
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
  await page.goto('https://www.binance.com/tr/careers/job-openings?team=All', {
    waitUntil: 'load',
  });
  const dropdownButton = await page.$$('.css-13c2b5p');

  await dropdownButton[1].click();
  await page.waitForSelector('.bn-sdd-dropdown.showing.css-fxluzf');

  let dropdownItems = await page.$$('[role="option"]');

  for (let i = 0; i < dropdownItems.length; i++) {
    const item = await page.evaluate(
      (el) => el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(),
      dropdownItems[i],
    );
    if (item === 'Turkey, Istanbul') {
      await dropdownItems[i].click();
    }
  }
  await page.waitForTimeout(1000);

  let jobCards = await page.$$('.posting.css-1wro8kh');
  let jobs = [];

  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('a')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);
    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location: 'İstanbul, Türkiye',
        scrape_name: 'binance',
      });
    }
  }
  await browser.close();
  return jobs;
};
