const puppeteer = require('puppeteer');

export const tiktak = async () => {
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
  await page.goto('https://tiktak.breezy.hr', {
    waitUntil: 'load',
  });
  await page.waitForSelector('li.position.transition');
  let jobCards = await page.$$('li.position.transition');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('a h2').textContent,
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('a ul.meta li.location span')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace(', TR', ', Türkiye')
          .trim(),
      jbCard,
    );
    console.log({ job_link, job_title, job_location });
    jobs.push({
      job_link,
      job_title,
      job_location,
      scrape_name: 'tiktak',
    });
  }
  await browser.close();
  return jobs;
};
