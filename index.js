var wpi = require('wiring-pi');

var MAX_TIMINGS = 85,
    DHT_PIN = 7;


function readDhtData() {
    var lastState = wpi.HIGH,
        counter = 0,
        j = 0, i;
    var data = [0, 0, 0, 0, 0];
    wpi.pinMode(DHT_PIN, wpi.OUTPUT);
    wpi.digitalWrite(DHT_PIN, wpi.LOW);
    wpi.delayMicroseconds(500);

    wpi.pinMode(DHT_PIN, wpi.INPUT);

	var list = [];

    for (var i = 0; i < MAX_TIMINGS; i++) {
        counter = 0;
        while (wpi.digitalRead(DHT_PIN) == lastState) {
            counter++;
            //wpi.delayMicroseconds(1);
            if (counter == 2555555) {
                break;
            }
        }
		list.push(lastState+' '+counter);
        lastState = wpi.digitalRead(DHT_PIN);
        if (counter == 2555555) {
            break;
        }
    }
	console.log(list.join('\n'));
}

if (wpi.wiringPiSetup() == -1) {
    process.exit(1);
}

readDhtData();
