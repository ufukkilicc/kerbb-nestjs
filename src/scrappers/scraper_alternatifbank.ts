const puppeteer = require('puppeteer');

export const alternatifbank = async () => {
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
  await page.goto('https://www.alternatifbank.com.tr/hakkimizda/insan-kaynaklari/ailemize-katilmak-istermisiniz', {
    waitUntil: 'load',
  });
  const iframeHandle = await page.waitForSelector('#main iframe');
  const iframe = await iframeHandle.contentFrame();
  await iframe.waitForSelector('h1.cvviewsh1');
  const jobCards = await iframe.$$('tr.hvr');
  const jobs: { job_link: string; job_title: string; job_location: string; scrape_name: string }[] = [];
  for (const jbCard of jobCards) {
    const job_link = await iframe.evaluate(
      (el: any) => el.querySelector('.list_pozisyon_adi > a').href,
      jbCard,
    );
    let isExist = jobs.find((job) => job.job_link === job_link);
    if (!isExist) {
      const job_title = await iframe.evaluate(
        (el: any) => el.querySelector('.list_pozisyon_adi > a').textContent,
        jbCard,
      );
      const job_location = await iframe.evaluate(
        (el: any) =>
          el
            .querySelector('td.list_sehir')
            .textContent
            .split(',')[0]
            .replace(/\(.*\)/g, '')
            .trim() + ', Türkiye',
        jbCard,
      );
      jobs.push({
        job_link,
        job_title,
        job_location,
        scrape_name: 'alternatifbank',
      });
    }
  }
  await browser.close();
  return jobs;
};