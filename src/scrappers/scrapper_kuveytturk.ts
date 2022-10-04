const puppeteer = require('puppeteer');

export const kuveytturk = async () => {
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
  await page.goto('https://www.katilbize.com/w/kt/ilan/site.aspx', {
    waitUntil: 'load',
  });

  let jobs = [];
  let isBtnDisabled = false;

  while (true) {
    let jobCards = await page.$$('#C_G > tbody > tr');
    for (let i = 1; i < jobCards.length; i++) {
      const job_link = await page.evaluate(
        (el) => el.querySelector('a.GL').href,
        jobCards[i],
      );
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector('a.GL')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jobCards[i],
      );
      const job_location = await page.evaluate(
        (el) =>
          el
            .querySelector('td:nth-child(2)')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .replace(' /', '')
            .trim(),
        jobCards[i],
      );
      let isExist = jobs.find((job) => job.job_link === job_link);

      if (!isExist) {
        jobs.push({
          job_link,
          job_title,
          job_location: job_location + ', Türkiye',
          scrape_name: 'kuveytturk',
        });
      }
    }
    const [button] = await page.$x('//a[text()="Sonraki Sayfa"]');
    if (button) {
      await button.click();
      await page.waitForNavigation();
    } else {
      break;
    }
  }
  await browser.close();
  return jobs;
};
