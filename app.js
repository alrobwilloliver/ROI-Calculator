'use strict';
// const v8 = require('v8');
// const totalHeapSize = v8.getHeapStatistics().total_available_size;
// const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
// console.log('totalHeapSizeGb: ', totalHeapSizeGb);

const puppeteer = require('puppeteer');
// var _ = require('underscore');

const data = [];

async function scrapeRightMove(url) {
	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	await page.goto(url);

	const titles = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-title'), element => element.textContent));

	const addresses = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-address'), element => element.textContent));

	const descriptions = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-description'), element => element.textContent));

	const images = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-img'), element => element.childNodes[1].src));

	const prices = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-priceValue'), element => element.textContent));

	// const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.propertyCard-main-img'), element =>
	// 	let url = 
	// 	return `https://www.rightmove.co.uk/property-for-sale/${}.html`
	// ));

	await browser.close();

		for (let i = 0; i < titles.length; i++) {
			// console.log(titles[i], addresses[i], descriptions[i], prices[i]);
			data.push(titles[i], descriptions[i], addresses[i], prices[i]);
		}
		
		console.log(data);

	


}



scrapeRightMove('https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=');

'https://www.openrent.co.uk/properties-to-rent/keel-gardens-bedlington?term=Keel%20Gardens,%20Bedlington&area=2&sortType=0&prices_min=100&prices_max=600&bedrooms_min=3&bedrooms_max=3&bathrooms_max=1';


