'use strict';
var spawn = require('child_process').spawnSync;

module.exports = {
	loadData: function(cb) {
		var cpu = spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);
		var gpu = spawn('/opt/vc/bin/vcgencmd', ['measure_temp']);
		cb && cb({
			time: new Date(),
			cpuTemp: (+cpu.stdout.toString())/1000 || 0,
			gpuTemp: +gpu.stdout.toString().match(/[\d\.]+/)[0] || 0
		});
	}
};

