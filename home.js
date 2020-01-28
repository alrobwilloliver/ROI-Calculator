const puppeteer = require('puppeteer');

(async function main() {

	try {

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(0);
		page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36');

		await page.setRequestInterception(true);

    	page.on('request', (req) => {
	        if(req.resourceType() === 'image'){
	            req.abort();
	        }
	        else {
	            req.continue();
	        }
	    });

		await page.goto('https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=');
		await page.waitForSelector('.propertyCard');

		console.log('it\'s showing');

		const properties = await page.$$('.propertyCard');
		console.log(properties.length);
		
		for (let i = 0; i < properties.length; i++) {
			page.setDefaultTimeout(0);
			await page.goto('https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=');
			await page.waitForSelector('.propertyCard');
			const properties = await page.$$('.propertyCard');

			const property = properties[i];
			const clicker = await property.$('.propertyCard-title');
			clicker.click();

			await page.waitForSelector('.property-header-price')
			// const price = await page.$eval('p.property-header-price', (p) => {
			// 	return p.innerText;
			// });
			// const address = await page.$eval('address.pad-0.fs-16.grid-25', (address) => {
			// 	return address.innerText;
			// });
			// const title = await page.$eval('h1.fs-22', (h1) => {
			// 	return h1.innerText;
			// })
			const images = await page.$eval('.gallery-thumbs-list', (imageList) => {
				return imageList
			})
			console.log(typeof images)
			// const imagesList = []
			// for (let i = 0; i < images.length; i++) {
			// 	await images[i].$eval('meta', (meta) => {
			// 		return meta.getAttribute('content')
			// 	});
			// }
		
			console.log(images);
		}

	} catch (e) {
		console.log('our error', e);
	}

	page.close()
	browser.close();

})();