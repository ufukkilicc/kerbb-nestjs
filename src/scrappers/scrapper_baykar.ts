const puppeteer = require('puppeteer');

export const baykar = async () => {
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
    'https://kariyer.baykartech.com/tr/basvuru/acik-pozisyonlar/',
    {
      waitUntil: 'load',
    },
  );
  let jobs = [];
  let pageNumber = 1;
  while (true) {
    let jobCards = await page.$$('.liProgram');
    for (const jbCard of jobCards) {
      const job_link = await page.evaluate(
        (el) => el.querySelector('.position-head a').href,
        jbCard,
      );
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector('.position-head a')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );

      let isExist = jobs.find((job) => job.job_link === job_link);
      if (!isExist) {
        jobs.push({
          job_link,
          job_title,
          job_location: 'Türkiye',
          scrape_name: 'baykar',
        });
      }
    }
    const [button] = await page.$x(`//a[text()="${pageNumber + 1}"]`);
    if (button === undefined) {
      break;
    }
    await button.click();
    await page.waitForTimeout(2000);
    pageNumber++;
  }
  await browser.close();
  return jobs;
};
