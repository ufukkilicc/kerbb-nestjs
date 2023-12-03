const puppeteer = require('puppeteer');

export const philipmorris = async () => {
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
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
  const page2 = await browser.newPage();
  await page2.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
  const jobs: { job_link: string; job_title: string; job_location: string; scrape_name: string }[] = [];
  let pageno = 0
  while (true) {
    pageno += 1
    await page.goto('https://www.pmi.com/careers/explore-our-job-opportunities?title=&locations=Turkey&departments=&contracts=&page=' + pageno, {
      waitUntil: 'load',
    });
    //await page.waitForSelector('ul.jss193.jss194');
    const jobCards = await page.$$('a.job-row');
    for (const jbCard of jobCards) {
      const job_link = await page.evaluate(
        (el: any) => el.href,
        jbCard,
      );
      let isExist = jobs.find((job) => job.job_link === job_link);
      if (!isExist) {
        const job_title = await page.evaluate(
          (el: any) => el
            .querySelector('.job-row--title')
            .textContent.replace(/[\n\t]*/gm, '')
            .trim(),
          jbCard,
        );
        await page2.goto(job_link, {
          waitUntil: 'load',
        });
        const job_location = await page2.$eval('.details--note.location',
          (el: any) => el
            .textContent
            .replace('Turkey', 'Türkiye')
            .trim()
        );
        jobs.push({
          job_link,
          job_title,
          job_location,
          scrape_name: 'philipmorris',
        });
      }
    }
    const wasLast = await page.$('.pages-nav--last.active')
    if (wasLast) {
      break
    }
  }
  await browser.close();
  // writeToFile(jobs)
  return jobs;
};