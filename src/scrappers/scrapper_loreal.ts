const puppeteer = require('puppeteer');

export const loreal = async () => {
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
    'https://careers.loreal.com/en_US/jobs/SearchJobs/?3_110_3=18072',
    {
      waitUntil: 'load',
    },
  );
  let cookieDivClicked = false;
  let cookieDiv = (await page.$('#onetrust-banner-sdk')) !== null;
  if (cookieDiv && !cookieDivClicked) {
    await page.click('#onetrust-accept-btn-handler');
    cookieDivClicked = true;
  }
  while (true) {
    const button = await page.$(
      'button.button.button--default.button--loadmore',
    );
    const buttonSecond = await page.$(
      'button.button.button--default.button--loadmore.button--disabled',
    );
    if (button && !buttonSecond) {
      await page.evaluate((el) => {
        el.click();
      }, button);
      await page.waitForTimeout(5000);
    } else {
      break;
    }
  }

  let jobCards = await page.$$(
    '.article__content--result.column__item.column__item--main',
  );
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) =>
        el.querySelector(
          '.article__header__text h3.article__header__text__title.module__header__text__title--1 a',
        ).href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector(
            '.article__header__text h3.article__header__text__title.module__header__text__title--1 a',
          )
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector(
            '.article__header__text .article__header__text__subtitle.serif span',
          )
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace(' Turkey', ', Türkiye')
          .trim(),
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);

    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location,
        scrape_name: 'loreal',
      });
    }
  }
  await browser.close();
  return jobs;
};
