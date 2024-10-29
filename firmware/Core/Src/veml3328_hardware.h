/*
Author: Peter Kim
Date:21/05/2023 
Description: 
  Function prototypes for 
  - I2C read / write
  - sensor initialization

  Also includes
  - Command code profile for veml3328
  - Resolution and detection range for veml3329
*/

#include "main.h"

// headers
HAL_StatusTypeDef veml3328_wr(uint8_t registerAddress, uint16_t value);
HAL_StatusTypeDef veml3328_rd(uint8_t registerAddress, uint16_t* value);
HAL_StatusTypeDef veml3328_init(void);
void veml3328_rd_lux(void);
void veml3328_rd_rgb(void);
void veml3328_config(uint16_t mode);

extern I2C_HandleTypeDef hi2c1;
extern HAL_StatusTypeDef r,g,b;
extern uint16_t conf, r_data, g_data, b_data;
extern double r_lux;

// Data registers
#define veml3328_addr                 0x10 //veml3328 salve address
#define veml3328__conf                0x00 //veml3328 configuration is only done in register 0x00
#define veml3328_reg_deviceID         0x0C
#define C_ 														0x04
#define R_ 														0x05
#define G_														0x06
#define B_														0x07
#define IR_	 													0x08

// Resolutions and maximum detection range
// Determined by DG, GAIN, and IT
// SENS = 0
#define res0_1 0.003
#define res0_2 0.006
#define res0_3 0.012
#define res0_4 0.024
#define res0_5 0.048
#define res0_6 0.096
#define res0_7 0.192
#define res0_8 0.328
#define res0_9 0.768

//SES = 1
#define res1_1 0.036
#define res1_2 0.072
#define res1_3 0.144
#define res1_4 0.288
#define res1_5 0.576
#define res1_6 1.152
#define res1_7 2.304

// Command registers w. measurement configurations
typedef enum {
  /*
  Shutdown setting
  0 -> on *SD0 also has to be 0 to power on
  1 -> off
  */ 

  SD1_on = 0,
  SD1_off = 1 //default
} SD1;

typedef enum{

  /*
  0 -> power on all channels
  1 -> power on G, C, and IR
  */

  chnl_on = 0, //default
  chnl_GCIR_on = 1
} SD_ALS;

typedef enum {
	DGx1 = 0, //default
	DGx2 = 1,
	DGx4 = 2
} DG;

typedef enum {
  GAINx1 = 0, //default
  GAINx2 = 1,
  GAINx4 = 2,
  GAINx1_2 = 3
} GAIN;

typedef enum {

  /*
  Sensitivity 
  */

  SENS_hi = 0, //default
  SENS_lo = 1
} SENS;

typedef enum {

  /*
  Integration time setting
  */

  IT_50 = 0, //default
  IT_100 = 1,
  IT_200 = 2,
  IT_400 = 3
} IT;

typedef enum {

  /*
  Auto / Active force mode
  0 -> auto mode, where the sensor make measurements untill off
  1 -> active mode, where the sensor only makes one measurement
  */

  AF_auto = 0, //default
  AF_active = 1
} AF;

typedef enum{

  /*
  Trigger a single measurement cycle when in active force mode
  The bit returns to 0 after a measurement cycle
  */

  TRIG_inf = 0, //default
  TRIG_one = 1
} TRIG;

typedef enum {

  /*
  Shutdown setting
  0 -> on *SD1 also has to be 0 to power on
  1 -> off
  */

  SD0_on = 0, 
  SD0_off = 1 //default
} SD0;





