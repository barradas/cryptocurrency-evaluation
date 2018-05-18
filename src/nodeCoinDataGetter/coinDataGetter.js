const cron = require('node-cron');
const fs = require('fs');
const request = require('request');


function writeJsonFile(data){
	//let parsedData = JSON.stringify(data);
	data = JSON.stringify(data);
	fs.writeFile('coinData.json', data, 'utf8', (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
}

function getCoinData(){

	request({url: 'https://api.coinmarketcap.com/v1/ticker/?limit=500', json: true}, function(err, res, json) {
		if (err) {
			throw err;
		}
		writeJsonFile(json);
	});
}

getCoinData();

cron.schedule('* * * * *', function(){
	console.log('running a task every minute');
	getCoinData();

});



