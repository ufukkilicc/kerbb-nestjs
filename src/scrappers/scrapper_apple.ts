const puppeteer = require('puppeteer');

export const apple = async () => {
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
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
  );
  await page.goto('https://jobs.apple.com/tr-tr/search?location=turkey-TURC', {
    waitUntil: 'load',
  });
  let jobCards = await page.$$('table#tblResultSet tbody');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('tr td.table-col-1 a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('tr td.table-col-1 a')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .replace('TR-', '')
          .trim(),
      jbCard,
    );
    // const job_location = await page.evaluate(
    //   (el) =>
    //     el
    //       .querySelector(
    //         "tr td:nth-child(2) span.table--advanced-search__location-sub"
    //       )
    //       .textContent.replace(/[\n\r]+|[\s]{2,}/g, " ")
    //       .trim(),
    //   jbCard
    // );
    let isExist = jobs.find((job) => job.job_link === job_link);
    if (!isExist) {
      jobs.push({
        job_link,
        job_title,
        job_location: 'Türkiye',
        scrape_name: 'apple',
      });
    }
  }
  await browser.close();
  return jobs;
};
