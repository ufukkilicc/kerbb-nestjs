const puppeteer = require('puppeteer');

export const isbankasi = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  await page.goto('https://ik.isbank.com.tr/is-ilanlari-listesi', {
    waitUntil: 'load',
  });

  let jobCards = await page.$$('.openings__content__opening');
  let jobs = [];
  for (const jbCard of jobCards) {
    const job_link = await page.evaluate(
      (el) => el.querySelector('a').href,
      jbCard,
    );
    const job_title = await page.evaluate(
      (el) =>
        el
          .querySelector('a > h2')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      jbCard,
    );
    jobs.push({
      job_link,
      job_title,
      job_location: 'Türkiye',
      company: 'İş Bankası',
    });
  }
  await browser.close();
  return jobs;
};
