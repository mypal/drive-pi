var wpi = require('wiring-pi');

const MAX_TIMINGS = 85,
    DHT_PIN = 3;


function readDhtData() {
    let lastState = wpi.HIGH,
        counter = 0,
        j = 0, i;
    let data = [0, 0, 0, 0, 0];
    wpi.pinMode(DHT_PIN, wpi.OUTPUT);
    wpi.digitalWrite(DHT_PIN, wpi.LOW);
    wpi.delay(18);

    wpi.pinMode(DHT_PIN, wpi.INPUT);

    for (let i = 0; i < MAX_TIMINGS; i++) {
        counter = 0;
        while (wpi.digitalRead(DHT_PIN) == lastState) {
            counter++;
            wpi.delayMicroseconds(1);
            if (counter == 255) {
                break;
            }
        }
        console.log(lastState, counter);
        lastState = wpi.digitalRead(DHT_PIN);
        if (counter == 255) {
            break;
        }
    }
}

if (wpi.wiringPiSetup() == -1) {
    process.exit(1);
}

readDhtData();