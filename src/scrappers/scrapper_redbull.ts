const puppeteer = require('puppeteer');

export const redbull = async () => {
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
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
  );
  await page.goto(
    'https://jobs.redbull.com/tr-tr/results?locations=12659&locationNames=Türkiye&functions=&functionNames=&keywords=',
    {
      waitUntil: 'load',
    },
  );

  let jobs = [];
  await page.screenshot({ path: 'buddy-screenshot.png' });
  while (true) {
    const [button] = await page.$x('//button[text()="Load more"]');
    if (button) {
      await page.evaluate((el) => {
        el.click();
      }, button);
    } else {
      break;
    }
    await page.waitForTimeout(3000);
  }

  let jobCards = await page.$$('a.JobCard_job-card__1UUOz');
  console.log(jobCards.length);
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate((el) => el.href, jbCard);
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('h3.JobCard_job-card__title__32MBE')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    const job_location = await page.evaluate(
      (el) =>
        el
          .querySelector(
            '.JobCard_job-card__locale-info__3f9pO .JobCard_job-card__locations__2EiG2 span.JobCard_job-card__location__3Col4',
          )
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);

    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location,
        scrape_name: 'redbull',
      });
    }
  }
  await browser.close();
  return jobs;
};
