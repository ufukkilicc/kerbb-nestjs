const puppeteer = require('puppeteer');

export const danone = async () => {
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
  await page.goto(
    'https://careers.danone.com/en-global/jobs.html?countries=Turkey',
    {
      waitUntil: 'load',
    },
  );

  let jobs = [];
  await page.waitForSelector('li.dn-job-card-item');

  while (true) {
    let JobCount = await page.$('span.dn-job-footer__text--item');
    let pay = await page.evaluate(
      (el) => el.textContent.split(' / ')[0],
      JobCount,
    );
    let payda = await page.evaluate(
      (el) => el.textContent.split(' / ')[1],
      JobCount,
    );
    const button = await page.$('button.dn-job-footer__load-more');
    if (button && pay !== payda) {
      await page.evaluate(async (el) => await el.click(), button);
      await page.waitForTimeout(3000);
    } else {
      break;
    }
  }

  let jobCards = await page.$$('li.dn-job-card-item');
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a.dn-job-card').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) => el.querySelector('a .dn-job-card__header h3').textContent,
      jbCard,
    );
    const job_location_city = await page.evaluate(
      (el) =>
        el
          .querySelector('a .dn-job-card__content .dn-job-card__content-city')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace(', TR', ', Türkiye')
          .trim(),
      jbCard,
    );
    const job_location_country = await page.evaluate(
      (el) =>
        el
          .querySelector(
            'a .dn-job-card__content .dn-job-card__content-country',
          )
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace(', TR', ', Türkiye')
          .trim(),
      jbCard,
    );
    const job_location = job_location_city + ', ' + job_location_country;
    let isExist = jobs.find((job) => job.job_link === job_link);

    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location: job_location.replace('Turkey', 'Türkiye'),
        scrape_name: 'danone',
      });
    }
  }
  await browser.close();
  return jobs;
};
