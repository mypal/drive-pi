var config = require('./config'),
	moment = require('moment'),
	spawn = require('child_process').spawn;

config.list.forEach(function(it) {
	setInterval(function() {
		try {
			it.func(function(data) {
				it.keys.forEach(function(item, idx) {
					spawn('curl', [
						'--request', 'POST',
						'--data', JSON.stringify({timestamp: moment(data.time).format('YYYY-MM-DDTHH:mm:ss'), value: data[item]}),
						'--header', 'U-ApiKey: '+config.apiKey,
						'http://api.yeelink.net/v1.0/device/'+config.deviceId+'/sensor/'+it.sensorId[idx]+'/datapoints'
					]);
					
					var test = spawn('curl', [
						'-X', 'POST',
						'-H', 'Content-Type: application/json',
						'-d', JSON.stringify({value: data[item]}),
						'https://things.ubidots.com/api/v1.6/variables/'+it.variableId[idx]+'/values/?token='+config.token
					]);
				});
				console.log(it.name, JSON.stringify(data));
			});
		} catch(e) {
			console.log(e);
		}
	}, it.interval*60*1000);
});
