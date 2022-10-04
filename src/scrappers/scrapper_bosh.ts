const puppeteer = require('puppeteer');

export const bosh = async () => {
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
  await page.goto('https://careers.smartrecruiters.com/BoschGroup/turkey', {
    waitUntil: 'load',
  });

  await autoScroll(page);
  await page.waitForTimeout(5000);
  //   await page.waitForSelector(
  //     "section.openings-section.opening opening--grouped.js-group"
  //   );
  const sectionCards = await page.$$(
    '#st-openings > div > div > div > section',
  );

  for (let scCards of sectionCards) {
    while (true) {
      const [button] = await page.$x('//a[text()="Daha çok iş göster"]');
      if (button) {
        await button.click();
        await page.waitForTimeout(5000);
      } else {
        break;
      }
    }
  }
  let jobs = [];
  for (let i = 0; i < sectionCards.length; i++) {
    let job_location = await page.evaluate(
      (el) =>
        el
          .querySelector('.opening-header h3')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      sectionCards[i],
    );
    let job_count = await page.evaluate(
      (el) =>
        el
          .querySelector('.opening-header span')
          .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
          .trim(),
      sectionCards[i],
    );
    job_count = parseInt(job_count.split(' ')[0]);
    const job_location_first = job_location.split(', ')[0];
    const job_location_second = job_location.split(', ')[1];
    job_location =
      job_location_first.toLowerCase() + ', ' + job_location_second;
    job_location =
      job_location[0].toUpperCase() +
      job_location.slice(1, job_location.length);
    const jobCards = await page.$x(
      `//*[@id="st-openings"]/div/div/div/section[${i + 1}]/ul/li`,
    );
    for (let i = 0; i < job_count; i++) {
      const job_link = await page.evaluate(
        (el) => el.querySelector('a').href,
        jobCards[i],
      );
      const job_title = await page.evaluate(
        (el) =>
          el
            .querySelector('a h4')
            .textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim(),
        jobCards[i],
      );
      let isExist = jobs.find((job) => job.job_link === job_link);

      if (!isExist) {
        jobs.push({
          job_link,
          job_title,
          job_location,
          scrape_name: 'bosh',
        });
      }
    }
  }
  await browser.close();
  return jobs;
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
