const puppeteer = require('puppeteer');

export const samsung = async () => {
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
    'https://sec.wd3.myworkdayjobs.com/Samsung_Careers?locations=189767dd6c920142da91457da529b66f&locations=af1154f4252401ae3f431903ce2bc53e',
    {
      waitUntil: 'load',
    },
  );
  let jobs = [];

  while (true) {
    await page.waitForSelector('.css-1q2dra3');
    let jobCards = await page.$$('.css-1q2dra3');
    for (const jbCard of jobCards) {
      const job_link = await page.evaluate(
        (el) => el.querySelector('.css-qiqmbt h3 a').href,
        jbCard,
      );
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector('.css-qiqmbt h3 a')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );
      const job_location = await page.evaluate(
        (el) =>
          el
            .querySelector('.css-248241 dd')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );

      let isExist = jobs.find((job) => job.job_link === job_link);
      if (!isExist) {
        jobs.push({
          job_link,
          job_title,
          job_location: job_location,
          scrape_name: 'samsung',
        });
      }
    }
    const button = await page.$('button[aria-label="next"]');
    if (button) {
      await button.click({ clickCount: 1 });
      await page.waitForTimeout(2000);
    } else {
      break;
    }
  }
  await browser.close();
  return jobs;
};
