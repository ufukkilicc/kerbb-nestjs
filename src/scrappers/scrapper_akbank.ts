const puppeteer = require('puppeteer');

export const akbank = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  await page.goto(
    'https://kariyer.akbank.com/JobSearchMaster/Index?strJobFilter=%7B"Keyword"%3A""%2C"ExperienceStatus"%3A%5B%5D%2C"SubDomainList"%3A%5B%5D%2C"Cities"%3A%5B"00000000-0000-0000-0000-000000000000"%5D%7D&hasPrestigeJob=false',
    {
      waitUntil: 'load',
    },
  );

  let jobs = [];
  let pageNumber = 1;
  let cookieDivClicked = false;

  while (true) {
    await page.waitForSelector('a.advert-rows');
    let jobCards = await page.$$('a.advert-rows');
    let jobCardsSpecials = await page.$$('a.wrapper-hero.data-href');
    if (jobCardsSpecials.length > 0) {
      for (const jbCard of jobCardsSpecials) {
        const job_link = await page.evaluate((el) => el.href, jbCard);
        const job_title = await page.evaluate(
          (el) =>
            el
              .querySelector('.hero-text .text-title')
              .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
              .trim(),
          jbCard,
        );
        jobs.push({
          job_link,
          job_title,
          job_location: 'Türkiye',
          scrape_name: 'akbank',
        });
      }
    }
    for (const jbCard of jobCards) {
      const job_link = await page.evaluate((el) => el.href, jbCard);
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector('.advert-cell.strong')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );
      // const job_location = await page.evaluate(
      //   (el) =>
      //     el
      //       .querySelector(
      //         ".mat-expansion-panel-header span.mat-content .mat-expansion-panel-header-description span.label-value"
      //       )
      //       .textContent.replace(/[\n\r]+|[\s]{2,}/g, " ")
      //       .trim(),
      //   jbCard
      // );
      jobs.push({
        job_link,
        job_title,
        job_location: 'Türkiye',
        scrape_name: 'akbank',
      });
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
