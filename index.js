const rightMove = require('./rightmove');

(async () => {

	try {

		await rightMove.initialize('/find.html?locationIdentifier=REGION%5E984&maxPrice=100000&radius=3.0&sortType=1&propertyTypes=detached%2Csemi-detached%2Cterraced&primaryDisplayPropertyType=houses&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords='); 
		let results = await rightMove.scrapeRightMove(511);
		
		console.log(results);


	} catch (e) {

		console.log('my error', e);

	}

})();












