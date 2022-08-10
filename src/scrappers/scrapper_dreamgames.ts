const puppeteer = require('puppeteer');
const fs = require('fs');

export const dreamgames = async () => {
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
  await page.goto('https://dreamgames.com/careers/', {
    waitUntil: 'load',
  });

  let jobCards = await page.$$(
    'a.uk-tile.uk-tile-default.uk-display-block.uk-link-reset',
  );
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_title = await page.evaluate(
      (el) => el.querySelector('h3').textContent,
      jbCard,
    );
    const job_link = await page.evaluate((el) => el.href, jbCard);
    jobs.push({
      job_link,
      job_title,
      job_location: 'Turkey',
      company: 'Dream Games',
    });
  }
  await browser.close();
  return jobs;
};
