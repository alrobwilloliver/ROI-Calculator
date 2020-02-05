const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const OPENRENT_URL = "https://www.openrent.co.uk/";

const self = {
	
	browser: null,
	page: null,
	initialize: async () => {
		self.browser = await puppeteer.launch(
			{ headless: false }
		);
		self.page = await self.browser.newPage();

		/* go to the page */
		await self.page.goto(OPENRENT_URL, { waitUntil: 'networkidle0' });
	},

	readDb: async () => {

		await MongoClient.connect('mongodb://localhost:27017/rightmovescraper', { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
				console.log('connected to database')
				assert.equal(null, err);
				client.close();

	  			const db = client.db("rightmovescraper");
				
	  			var cursor = db.collection('properties').find({});

	  			function iterateFunc(doc) {
				   return JSON.stringify(doc, null, 4);
				}

				const data = cursor.forEach(iterateFunc);
				console.log(data);
				client.close();
		});

	},

	searchOpenRent: async () => {
	
		const data = self.readDb();
		

		// let addresses = [];

		// for (let i = 0; i < rightMoveResults.length; i++) {
			
		// 	addresses.push(rightMoveResults[i].address);

		// 	// await self.page.openrent[0].focus('#searchBox');
		// 	// await self.page.openrent[0].type(`${address[i]}`);
		// 	// await self.page.openrent[0].$eval('#embeddedSearchBtn', btn => btn.click );
		// 	// await self.page.openrent[0].waitForNavigation();
			
		// }

		// console.log(addresses);
		

	}


}

self.searchOpenRent();

