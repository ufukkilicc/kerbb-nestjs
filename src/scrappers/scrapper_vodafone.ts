const puppeteer = require('puppeteer');

export const vodafone = async () => {
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
    'https://jobs.vodafone.com/careers/search?query=%2A&location=İstanbul%2C%2021706%2C%20TUR&pid=563018674833641&domain=vodafone.com',
    {
      waitUntil: 'load',
    },
  );
  let jobs = [];
  let cookieDivClicked = false;
  let selectorCount = 0;
  let jobCards = [];
  let jobActive = true;

  await page.waitForSelector(
    '#main-container > div > div.inline-block.position-cards-container',
  );

  let cookieDiv = (await page.$('#onetrust-banner-sdk')) !== null;

  if (cookieDiv && !cookieDivClicked) {
    await page.click('#onetrust-reject-all-handler');
    cookieDivClicked = true;
  }
  while (true) {
    const [button] = await page.$x('//button[text()="Show More Positions"]');
    if (button === undefined) {
      break;
    }
    await page.evaluate(async (el) => await el.click(), button);
    try {
      await page.waitForSelector(
        '#main-container > div > div.inline-block.position-cards-container > div > div.iframe-button-wrapper > button',
        { timeout: 5000 },
      );
    } catch {
      (err) => (err);
    }
  }
  while (true) {
    const select =
      (await page.$(`[data-test-id="position-card-${selectorCount}"]`)) !==
      null;
    if (select) {
      const selector = await page.$(
        `[data-test-id="position-card-${selectorCount}"]`,
      );
      selectorCount++;
      jobCards.push(selector);
    } else {
      break;
    }
  }
  for (let i = 0; i < jobCards.length; i++) {
    jobActive =
      (await page.$(
        '#main-container > div > div.inline-block.mobile-hide.position-top-container > div > div > div:nth-child(2) > div > h1',
      )) !== null;

    if (jobActive) {
      const job_link = await page.evaluate(() => document.location.href);
      const jobTitleValue = await page.$(
        '#main-container > div > div.inline-block.mobile-hide.position-top-container > div > div > div:nth-child(2) > div > h1',
      );
      let job_title = await page.evaluate(
        (el) => el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(),
        jobTitleValue,
      );
      let isExist = jobs.find((job) => job.job_link === job_link);
      if (!isExist) {
        jobs.push({
          job_link,
          job_title,
          job_location: 'İstanbul, Türkiye',
          scrape_name: 'vodafone',
        });
      }
    }

    // await page.evaluate((el) => {
    //   el.scrollIntoView();
    // }, jobCards[i]);
    await jobCards[i].click();
    await page.waitForTimeout(1000);
  }

  await browser.close();
  return jobs;
};
