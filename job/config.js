module.exports = {
	list: [{
		name: 'dht',
		interval: 1,
		sensorId: [393238, 393247],
		variableId: ['57bd58327625426ea3d6bfe7', '57bd57bc7625426c0c49794d'],
		func: require('./dht').loadData,
		keys: ['temperature', 'humidity'],
	}, {
		name: 'internal temperature',
		interval: 1,
		sensorId: [393249, 393250],
		variableId: ['57bd585d7625426f4a500a35', '57bd586f7625426fe6f46024'],
		func: require('./dev-temp').loadData,
		keys: ['cpuTemp', 'gpuTemp']
	}],
	deviceId: 350418,
	apiKey: '0f1ab325f75103d459c4c6df123fb2eb',
	token: '0Cy2LIdC21jCOHPMHRiVufl4tPRimN'
};
