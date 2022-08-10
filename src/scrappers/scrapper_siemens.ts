const puppeteer = require('puppeteer');

export const siemens = async () => {
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
    'https://jobs.siemens.com/jobs?page=1&location=Turkey&woe=12&stretchUnit=MILES&stretch=0',
    {
      waitUntil: 'load',
    },
  );

  let jobs = [];
  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    await page.waitForSelector('.mat-accordion.cards');
    let jobCards = await page.$$('.mat-expansion-panel');
    for (const jbCard of jobCards) {
      const job_link = await page.evaluate(
        (el) =>
          el.querySelector(
            '.mat-expansion-panel-header span.mat-content .mat-expansion-panel-header-title p.job-title a.job-title-link',
          ).href,
        jbCard,
      );
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector(
              '.mat-expansion-panel-header span.mat-content .mat-expansion-panel-header-title p.job-title a.job-title-link span',
            )
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );
      const job_location = await page.evaluate(
        (el) =>
          el
            .querySelector(
              '.mat-expansion-panel-header span.mat-content .mat-expansion-panel-header-description span.label-value',
            )
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jbCard,
      );
      jobs.push({
        job_link,
        job_title,
        job_location,
        company: 'Siemens',
      });
    }

    await page.click(
      '#all-content > search-app > search-base-search-holder > search-results > div > search-paginator > mat-paginator > div > div > div.mat-paginator-range-actions > button.mat-focus-indicator.mat-tooltip-trigger.mat-paginator-navigation-next.mat-icon-button.mat-button-base',
    );
    isBtnDisabled =
      (await page.$(
        '#all-content > search-app > search-base-search-holder > search-results > div > search-paginator > mat-paginator > div > div > div.mat-paginator-range-actions > button.mat-focus-indicator.mat-tooltip-trigger.mat-paginator-navigation-next.mat-icon-button.mat-button-base.mat-button-disabled',
      )) !== null;
  }
  await browser.close();
  return jobs;
};
