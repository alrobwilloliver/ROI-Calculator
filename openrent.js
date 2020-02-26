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

		MongoClient.connect('mongodb://localhost:27017/rightmovescraper', { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
				if (err) { console.log(err) }

				db.collection('properties', function (err, collection) {
        
			        collection.find().toArray(function(err, items) {
			            if(err) throw err;    
			            console.log(items);           
			        });
			    });
		});
        
    },

				// console.log('connected to database')
				// assert.equal(null, err);

	  	// 		const db = client.db("rightmovescraper");

		// var cursor = db.collection('properties').find({});

		// 		let data = []
	 //  			function iterateFunc(doc) {
		// 		   let prop = JSON.stringify(doc, null, 4);
		// 		   data.push(prop);
		// 		   console.log(data);
		// 		}

		// cursor.forEach(iterateFunc);

	searchOpenRent: async () => {
	
		const data = await self.readDb();
		console.log(data);

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

