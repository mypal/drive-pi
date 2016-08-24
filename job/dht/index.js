'use strict';
var spawn = require('child_process').spawn,
	path = require('path');

var DHT_PIN = 7;

module.exports = {
	loadData: function(cb, dhtPin) {
		var cmd = spawn(path.join(__dirname, 'dht'), [ dhtPin || DHT_PIN]);
		var out = '';
		cmd.stdout.on('data', function(data) {
			out += data.toString();
		});
		cmd.on('exit', function() {
			var res = out.split(' ');
			if (res.length != 3) {
				cb && cd(null);
				return;
			}
			cb && cb({
				time: new Date(res[0]*1000),
				humidity: +res[1],
				temperature: +res[2]
			});
		});
	}
};
