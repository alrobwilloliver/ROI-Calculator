const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const propertySchema = require('./models/propertiesSchema');

const RIGHTMOVE_URL = (rightmove) => `https://www.rightmove.co.uk/property-for-sale${rightmove}`;

const self = {

	browser: null,
	page: null,

	initialize: async (rightmove) => {
		
		self.browser = await puppeteer.launch(
			{ headless: false }
		);
		self.page = await self.browser.newPage();
		
		/* go to the page */
		await self.page.goto(RIGHTMOVE_URL(rightmove), { waitUntil: 'networkidle0' });
		// self.page.waitForSelector('.propertyCard');

	},

	rightMovePaginations: async () => {
		
		const pages = await self.page.$eval('.searchHeader-resultCount', pages => pages.innerText);
		console.log(pages);

		return pages;
		
	},

	scrapeRightMove: async () => {
		
		let nr = await self.rightMovePaginations();
		nr = parseInt(nr);

		let results = [];

		do {
			
			let newResults = await self.parseRightMove();

			results = [ ...results, ...newResults ];

			if (results.length < nr) {
				let nextPageButton = await self.page.$('.pagination-direction--next');

				if (nextPageButton) {
					await nextPageButton.click()
					await self.page.waitForSelector('.propertyCard-address');
				} else {
					break;
				}
			}

			// below commented out not required here [can delete]
			// await nextPageButton.click();
			// await self.page.waitForNavigation({ waitUntil: 'networkidle0' });
			// nextPageButton = await self.page.$('.pagination-direction--next');
		} while(results.length < nr);
		
		return results.slice(0, nr);

	},

	parseRightMove: async () => {
		let properties = await self.page.$$('.propertyCard');
		let results = [];

		for (let property of properties) {

			let propertyTitle = await property.$eval('.propertyCard-title', node => node.innerText);
			let propertyAddress = await property.$eval('.propertyCard-address', node => node.innerText);
			let propertyDesc = await property.$eval('.propertyCard-description', node => node.innerText);
			let propertyPrice = await property.$eval('.propertyCard-priceValue', node => node.innerText);
			let propertyImage = await property.$eval('img', node => 
				node.src ? node.src : node.href 
			);
			let propertyUrl = await property.$eval('.propertyCard-moreInfoItem', node => {
				const href = node.getAttribute('href');
				return `rightmove.co.uk${href}`;
			}).catch(() => {return null})
			
			// console.log(
			// 	'/* -----------------------------------*/',
			// 	propertyTitle, propertyAddress, propertyDesc, propertyPrice, propertyImage, propertyUrl
			// 	'/* -----------------------------------*/'
			// );

			results.push({

				propertyTitle,
				propertyAddress,
				propertyDesc,
				propertyPrice,
				propertyImage,
				propertyUrl

			})

			// addToDb(results);

		}
	
		return results;
	},

	closeBrowser: async () => {
		self.browser.close();
	}
 
}

module.exports = self;