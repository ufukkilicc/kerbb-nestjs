const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

declare var window: {
  location: {
    href: string;
  };
};

export const enuygun = async () => {
  console.log("enuygun")
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
  await page.goto('https://www.enuygun.com/kariyer/ilanlar', {
    waitUntil: 'load',
  });
  await page.waitForSelector('div.jss10.jss13.jss11.jss9.jss188');
  const jobCards = await page.$$('li.jss257.jss260.jss264');
  const jobs: { job_link: string; job_title: string; job_location: string; scrape_name: string }[] = [];
  let lastURL = ''
  for (const jbCard of jobCards) {
    await jbCard.click()
    await page.waitForFunction(
      (lastURL: string) => {
        return window.location.href !== lastURL;
      },
      {},
      lastURL
    );
    const job_link = await page.url();
    lastURL = job_link
    let isExist = jobs.find((job) => job.job_link === job_link);
    if (!isExist) {
      const job_title = await page.evaluate(
        (el: any) => el.querySelector('span:nth-child(1)').textContent,
        jbCard,
      );
      jobs.push({
        job_link,
        job_title,
        job_location: 'Türkiye',
        scrape_name: 'enuygun',
      });
    }
  }
  await browser.close();
  // writeToFile(jobs)
  return jobs;
};
// enuygun()
// Convert the jobs data to CSV format
// function writeToFile(jobs: any) {
//   const csvHeader = 'Job Link,Job Title,Job Location,Scrape Name\n';
//   const csvRows = jobs.map(job =>
//     `"${job.job_link}","${job.job_title}","${job.job_location}","${job.scrape_name}"`
//   ).join('\n');

//   const csvContent = csvHeader + csvRows;

//   // Define file path
//   const filePath = path.join(__dirname, 'jobs.csv');

//   // Write the CSV content to a file
//   fs.writeFileSync(filePath, csvContent, 'utf8');
// }