const puppeteer = require("puppeteer");

async function scraper(url) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors'
    ]
  });
  const page = await browser.newPage();
  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

  await page.goto(url, { waitUntil: 'load', timeout: 0 })
  .then(() => console.log("Goto Success!!"))
  .catch((err) => console.log("GOTO:", err));

  const horses = await page.$$eval('div.upcoming-race-table__result-runner', els => els.map(el => el.textContent.trim()));
  
  await browser.close();
  return horses;
}

document.querySelector("button").addEventListener("click", async function () {
  const horses = await scraper("https://www.racenet.com.au/form-guide/horse-racing");
  const table = document.createElement("table");

  // create header row
  const headerRow = document.createElement("tr");
  const headerCol = document.createElement("th");
  headerCol.innerText = "NUMBER - NAME";
  // headerCol.innerText = "NAME";
  headerRow.appendChild(headerCol);
  table.appendChild(headerRow);

  // create rows for each horse
  for (let horse of horses) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.innerText = horse;
    tr.appendChild(td);
    table.appendChild(tr);
  }
  document.querySelector("#result").appendChild(table);
});

