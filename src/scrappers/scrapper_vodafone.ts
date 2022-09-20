const puppeteer = require('puppeteer');

export const vodafone = async () => {
  console.log('-1');
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
    'https://jobs.vodafone.com/careers/search?query=%2A&location=İstanbul%2C%2021706%2C%20TUR&pid=563018675310025&domain=vodafone.com&triggerGoButton=false',
    {
      waitUntil: 'load',
    },
  );
  console.log('0');
  let jobs = [];
  let cookieDivClicked = false;
  let selectorCount = 0;
  let jobCards = [];
  let jobActive = true;
  let cookieDiv = (await page.$('#onetrust-banner-sdk')) !== null;

  if (cookieDiv && !cookieDivClicked) {
    await page.click('#onetrust-reject-all-handler');
    cookieDivClicked = true;
  }

  while (true) {
    console.log('1');
    try {
      await page.waitForSelector(
        '#main-container > div > div.inline-block.position-cards-container > div > div.iframe-button-wrapper > button',
        { timeout: 5000 },
      );
    } catch {
      (err) => console.log(err);
    }
    const [button] = await page.$x('//button[text()="Show More Positions"]');
    if (button === undefined) {
      break;
    }
    await button.click();
  }
  while (true) {
    console.log('2');
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
  console.log(jobCards.length);
  for (let i = 0; i < jobCards.length; i++) {
    console.log('3');
    try {
      await page.waitForSelector(
        '#main-container > div > div.inline-block.mobile-hide.position-top-container > div > div > div:nth-child(2) > div > h1',
        { timeout: 1500 },
      );
      jobActive = true;
    } catch {
      jobActive = false;
    }
    if (jobActive) {
      const job_link = await page.evaluate(() => document.location.href);
      const jobTitleValue = await page.$(
        '#main-container > div > div.inline-block.mobile-hide.position-top-container > div > div > div:nth-child(2) > div > h1',
      );
      let job_title = await page.evaluate(
        (el) => el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(),
        jobTitleValue,
      );
      console.log({ job_link, job_title });
      jobs.push({
        job_link,
        job_title,
        job_location: 'İstanbul, Türkiye',
        scrape_name: 'vodafone',
      });
    }
    await jobCards[i].click();
  }

  await browser.close();
  return jobs;
};
