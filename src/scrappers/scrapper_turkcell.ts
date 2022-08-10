const puppeteer = require('puppeteer');

export const turkcell = async () => {
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
  await page.goto('https://kariyer.turkcell.com.tr/S/JobSearch', {
    waitUntil: 'load',
  });
  let jobCards = await page.$$('.special-search-item');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('.search-content a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('.search-content a')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim()
          .split('-')[1]
          .substring(1),
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('.search-content div span:last-of-type b')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );

    jobs.push({
      job_link,
      job_title,
      job_location,
      company: 'Turkcell',
    });
  }
  await browser.close();
  return jobs;
};
