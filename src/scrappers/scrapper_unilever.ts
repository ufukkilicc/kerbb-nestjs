const puppeteer = require('puppeteer');

export const unilever = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  await page.goto(
    'https://careers.unilever.com.tr/iş-arama/türkiye/34155/1/1',
    {
      waitUntil: 'load',
    },
  );
  let jobCards = await page.$$('li.color-default');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('li.color-default a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('li.color-default a span')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('li.color-default a span.job-location')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );

    jobs.push({
      job_link,
      job_title,
      job_location,
      company: 'Unilever',
    });
  }
  await browser.close();
  return jobs;
};
