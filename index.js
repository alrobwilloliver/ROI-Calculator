(async () => {

	const rightMove = require('./rightmove');
	const mongoose = require('mongoose');
	const propertySchema = require('./models/propertiesSchema');

	mongoose.connect('mongodb://localhost:27017/rightmovescraper', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
		console.log('connected to database')
	});

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

	try {

		await rightMove.initialize('/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=');
		let results = await rightMove.scrapeRightMove();

		results.forEach(async property => {
			const dbMsg = await addToDb(property);
			console.log(dbMsg);
		});
		// rightMove.searchOpenRent(results);
		rightMove.closeBrowser();

	} catch (e) {

		console.log('my error', e);

	}

})();












