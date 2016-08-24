//compile command: cc -Wall dht.c -o dht -lwiringPi
/*
 *  dht.c:
 *	read temperature and humidity from DHT11 or DHT22 sensor
 */
 
#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
 
#define MAX_TIMINGS	85
//#define DHT_PIN		7	/* GPIO-22 */
int DHT_PIN = 7; 
int data[5] = { 0, 0, 0, 0, 0 };
double res[2];

double* read_dht_data()
{
	uint8_t laststate	= HIGH;
	uint8_t counter		= 0;
	uint8_t j			= 0, i;
 
	data[0] = data[1] = data[2] = data[3] = data[4] = 0;
 
	/* pull pin down for 18 milliseconds */
	pinMode( DHT_PIN, OUTPUT );
	digitalWrite( DHT_PIN, LOW );
	delay( 18 );
 
	/* prepare to read the pin */
	pinMode( DHT_PIN, INPUT );
 
	/* detect change and read data */
	for ( i = 0; i < MAX_TIMINGS; i++ )
	{
		counter = 0;
		while ( digitalRead( DHT_PIN ) == laststate )
		{
			counter++;
			delayMicroseconds( 1 );
			if ( counter == 255 )
			{
				break;
			}
		}
		laststate = digitalRead( DHT_PIN );
 
		if ( counter == 255 )
			break;
 
		/* ignore first 3 transitions */
		if ( (i >= 4) && (i % 2 == 0) )
		{
			/* shove each bit into the storage bytes */
			data[j / 8] <<= 1;
			if ( counter > 16 )
				data[j / 8] |= 1;
			j++;
		}
	}
 
	/*
	 * check we read 40 bits (8bit x 5 ) + verify checksum in the last byte
	 * print it out if data is good
	 */
	if ( (j >= 40) &&
	     (data[4] == ( (data[0] + data[1] + data[2] + data[3]) & 0xFF) ) )
	{
		float h = (float)((data[0] << 8) + data[1]) / 10;
		if ( h > 100 )
		{
			h = data[0];	// for DHT11
		}
		float c = (float)(((data[2] & 0x7F) << 8) + data[3]) / 10;
		if ( c > 125 )
		{
			c = data[2];	// for DHT11
		}
		if ( data[2] & 0x80 )
		{
			c = -c;
		}
		res[0] = h; res[1] = c;
		return res;
	}else  {
		return (double*)0;
	}
}
 
int main( int argc, char *argv[] )
{
	if ( wiringPiSetup() == -1 )
		exit( 1 );

	read_dht_data();

	if (argc == 2) {
		char* tmp = argv[1];
		int dhtPin = 0;
		while (*tmp) {
			dhtPin = 10*dhtPin+*tmp-'0';
			tmp++;
		}
		DHT_PIN = dhtPin;
	}

	int retry = 0;
	int count = 0;
	double h = 0.0, c = 0.0;
	while (count < 5) {
		double* data = read_dht_data();
		if (data) {
			h += data[0];
			c += data[1];
			count++;
		}
		if (++retry > 10) break;
		delay( 2000 ); /* wait 2 seconds before next read */
	}
	if (count) {
		printf("%ld %.3f %.3f", time(0), h/count, c/count);
	} else {
	}

	return(0);
}
