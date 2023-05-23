/*
Author: Peter Kim
Date:21/05/2023 
Description: 
	Perform computations with simple algorithms to get CCT, Lux, and others
*/

/* Convert sensor reading value to LUX*/
int convert(int value) {
	/*pre set number. Get this from datasheet*/
	double x = 0.384;
	double lux;
	
	lux = value * x;
	return lux;
}



