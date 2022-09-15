const puppeteer = require('puppeteer');

export const emlakkatilim = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  await page.goto('https://kariyer.emlakkatilim.com.tr/jobs', {
    waitUntil: 'load',
  });

  let jobs = [];
  let isBtnDisabled = false;
  let jobCards = await page.$$('td a.GL');

  while (true) {
    await page.waitForSelector('td a.GL');
    for (let i = 0; i < jobCards.length; i++) {
      await page.waitForSelector('td a.GL');
      const job_link = await page.evaluate((el) => el.href, jobCards[i]);

      await jobCards[i].click();
      await page.waitForNavigation();

      // get the data

      const value = await page.$('.ilan h3');
      let job_title = await page.evaluate(
        (el) =>
          el.textContent
            .replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .split('-')[0]
            .trim(),
        value,
      );
      const value2 = await page.$('.ilan span.kurum');
      let job_location_raw = await page.evaluate(
        (el) =>
          el.textContent
            .replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim()
            .split('/')
            .slice(1),
        value2,
      );
      let job_location = '';
      job_location_raw.forEach((location) => {
        if (location.trim() !== 'Türkiye') job_location += location;
      });
      let new_job_location =
        job_location === ''
          ? 'Türkiye'
          : job_location.replace('  ', ', ').trim() + ', Türkiye';
      jobs.push({
        job_link,
        job_title,
        job_location: new_job_location,
        company: 'Emlak Katılım',
        scrape_name: 'emlakkatilim',
      });

      await page.goBack();
      jobCards = await page.$$('td a.GL');
    }
    const [button] = await page.$x(
      "//*[@id='form1']/div[4]/div[3]/div[1]/div[2]/a[2][contains(., 'Sonraki Sayfa')]",
    );
    if (button) {
      await button.click();
    } else {
      break;
    }
  }
  await browser.close();
  return jobs;
};
