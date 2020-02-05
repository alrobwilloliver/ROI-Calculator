const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const propertySchema = require('./models/propertiesSchema');

const RIGHTMOVE_URL = (rightmove) => `https://www.rightmove.co.uk/property-for-sale${rightmove}`;
const OPENRENT_URL = 'https://www.openrent.co.uk/';

const addToDb = property => {
	const { propertyTitle, propertyAddress, propertyUrl, propertyImage, propertyPrice, propertyDesc } = property;
	return propertySchema.findOne({propertyAddress, propertyPrice, propertyUrl}).then(doc => {
		if (doc) return 'item is already in the database';
		if (!doc) {
			const newProperty = new propertySchema();
			newProperty.propertyTitle = propertyTitle;
			newProperty.propertyAddress = propertyAddress;
			newProperty.propertyPrice = propertyPrice;
			newProperty.propertyImage = propertyImage;
			newProperty.propertyUrl = propertyUrl; 
			newProperty.propertyDesc = propertyDesc;
			newProperty.timeStamp = Date.now();
			return newProperty.save()
				.then(() => 'property added to database').catch(() => 'database saving error');
		}
	}).catch(() => 'database finding error');
};

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
			});
			
			// console.log(
			// 	'/* -----------------------------------*/',
			// 	title, address, description, value, images,
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

			addToDb(results);

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