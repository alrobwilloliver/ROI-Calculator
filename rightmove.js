const puppeteer = require('puppeteer');

const RIGHTMOVE_URL = (rightmove) => `https://www.rightmove.co.uk/property-for-sale${rightmove}`;
const OPENRENT_URL = 'https://www.openrent.co.uk/';

const self = {

	browser: null,
	page: {
		rightmove: null,
		openrent: null
	},

	initialize: async (rightmove) => {
		
		self.browser = await puppeteer.launch(
			{ headless: false }
		);
		self.page.rightmove = await self.browser.newPage();
		
		/* go to the page */
		await self.page.rightmove.goto(RIGHTMOVE_URL(rightmove), { waitUntil: 'networkidle0' });
		// self.page.waitForSelector('.propertyCard');

	},

	rightMovePaginations: async () => {
		
		const pages = await self.page.rightmove.$eval('.searchHeader-resultCount', pages => pages.innerText);
		console.log(pages);

		return pages;
		
	},

	scrapeRightMove: async () => {
		
		// let nr = await self.rightMovePaginations();
		let nr = '10';
		nr = parseInt(nr);

		let results = [];

		do {
			
			let newResults = await self.parseRightMove();

			results = [ ...results, ...newResults ];

			if (results.length < nr) {
				let nextPageButton = await self.page.rightmove.$('.pagination-direction--next');

				if (nextPageButton) {
					await nextPageButton.click()
					await self.page.rightmove.waitForSelector('.propertyCard-address');
				} else {
					break;
				}
			}


			// await nextPageButton.click();
			// await self.page.waitForNavigation({ waitUntil: 'networkidle0' });
			// nextPageButton = await self.page.$('.pagination-direction--next');
		} while(results.length < nr);
		
		return results.slice(0, nr);

	},

	parseRightMove: async () => {
		let properties = await self.page.rightmove.$$('.propertyCard');
		let results = [];

		for (let property of properties) {

			let title = await property.$eval('.propertyCard-title', node => node.innerText);
			let address = await property.$eval('.propertyCard-address', node => node.innerText);
			let description = await property.$eval('.propertyCard-description', node => node.innerText);
			let value = await property.$eval('.propertyCard-priceValue', node => node.innerText);
			let images = await property.$eval('img', node => 
				node.src ? node.src : node.href 
			);
			
			// console.log(
			// 	'/* -----------------------------------*/',
			// 	title, address, description, value, images,
			// 	'/* -----------------------------------*/'
			// );

			results.push({

				title,
				address,
				description,
				value,
				images

			})

		}
	
		return results;
	},

	searchOpenRent: async (rightMoveResults) => {

		let addresses = [];

		self.page.openrent = await self.browser.pages();

		for (let i = 0; i < rightMoveResults.length; i++) {
			
			addresses.push(rightMoveResults[i].address);

			await self.page.openrent[0].goto(OPENRENT_URL, { waitUntil: 'networkidle0'});

			await self.page.openrent[0].focus('#searchBox');
			await self.page.openrent[0].type(`${address[i]}`);
			await self.page.openrent[0].$eval('#embeddedSearchBtn', btn => btn.click );
			await self.page.openrent[0].waitForNavigation();
			
		}

		console.log(addresses);
		

	},

	closeBrowser: async () => {
		self.browser.close();
	}
 
}

module.exports = self;