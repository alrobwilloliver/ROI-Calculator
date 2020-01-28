const puppeteer = require('puppeteer');

const url = 'https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=';

async function scrapeRightMove(url) {


	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	await page.goto(url);

	const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-moreInfoItem'), element => element.href));

	console.log(urls);

	for (let i = 0, total_urls = urls.length; i < total_urls; i++) {
		const page = await browser.newPage();
  		await page.goto(url), { waitUntil: 'networkidle0', timeout: 0 };

	  await page.goto(urls[i]);

	  // Get the data ...
	  const titleElement = await page.$x('/html/body/div[3]/div[1]/div[3]/div[1]/div/div/div[2]/p/strong/text()');
	const title = await page.evaluate(titleElement => titleElement., titleElement);

	  console.log(title);
	}

	const data = [];

	// await new Promise((resolve, reject) => {
	// 	elements.forEach(async (element, i) => {

	// 		await element.click();
	// 		await page.waitForNavigation();
	// 		const title = await page.$x('//*[@id="primaryContent"]/div[1]/div/div/div[2]/div/h1');
	// 		data.push(title)
			
	// 	  	await page.goBack();
	// 	  	await page.waitForNavigation();
	// 		if (i === data.length - 1) {
	// 			resolve()
	// 		}
	// 	})
	// }).catch( console.log(reject));

	// console.log(data);
	browser.close();
};

scrapeRightMove(url);


		// Get the data you want here and push it into the data array
		// const address = await page.$x('//*[@id="primaryContent"]/div[1]/div/div/div[2]/div/address').textContent;

		// const description = await page.$x('//*[@id="description"]/div/div[1]/div[2]/p').textContent;

		// const images = await page.$$('js-gallery-thumbnail').childNode[1].childNode.src;

		// const prices = await page.$x('//*[@id="propertyHeaderPrice"]/strong/text()');
		// const firstListDate = await page.$x('//*[@id="firstListedDateValue"]').textContent;


		// data.push(title);
		//, description, address, price, firstListDate












