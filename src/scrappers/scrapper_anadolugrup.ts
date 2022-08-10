const puppeteer = require('puppeteer');

export const anadolugrup = async () => {
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
    'https://careers.anadolukariyerim.com/search/?createNewAlert=false&q=&locationsearch=Türkiye',
    {
      waitUntil: 'load',
    },
  );

  let jobCards = await page.$$('tr.data-row');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) =>
        el.querySelector('td.colTitle span.jobTitle a.jobTitle-link').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('td.colTitle span.jobTitle a.jobTitle-link')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('td.colLocation span.jobLocation')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location: 'Turkey',
      company: 'Anadolu Grup',
    });
  }
  await browser.close();
  return jobs;
};
