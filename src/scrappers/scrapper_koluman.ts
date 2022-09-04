const puppeteer = require('puppeteer');

export const koluman = async () => {
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
  await page.goto('https://www.koluman-otomotiv.com.tr/ilanlar', {
    waitUntil: 'load',
  });
  let jobCards = await page.$$('.blog-post');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('.blog-content p.read-more a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('.blog-title .blog-title-body h3')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location: 'Türkiye',
      scrape_name: 'koluman',
    });
  }
  await browser.close();
  return jobs;
};
