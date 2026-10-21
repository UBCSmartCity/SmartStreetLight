/*
 * ina260.h
 *
 * Created on: Feb 18, 2026
 */

#ifndef INA260_H_
#define INA260_H_

#include "stm32f1xx_hal.h" // Update to your specific STM32 family

// INA260 default I2C address is 0x40.
// STM32 HAL requires the address to be shifted left by 1 bit for 8-bit addressing.
// 0x40 << 1 = 0x80
#define INA260_I2C_ADDR         0x80

// INA260 Register Addresses
#define INA260_REG_CONFIG       0x00
#define INA260_REG_CURRENT      0x01
#define INA260_REG_VOLTAGE      0x02
#define INA260_REG_POWER        0x03
#define INA260_REG_MANUF_ID     0xFE
#define INA260_REG_DIE_ID       0xFF

// Structure to hold the sensor readings
typedef struct {
    uint16_t voltage_mV; // Bus voltage in millivolts
    int16_t  current_mA; // Current in milliamps (positive = discharging, negative = charging)
    uint16_t power_mW;   // Power in milliwatts
} INA260_Data_t;

// Function Prototypes
HAL_StatusTypeDef INA260_Init(I2C_HandleTypeDef *hi2c);
HAL_StatusTypeDef INA260_Read_All(I2C_HandleTypeDef *hi2c, INA260_Data_t *data);

#endif /* INA260_H_ */
