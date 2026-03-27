#ifndef BATTERY_SENSORS_H
#define BATTERY_SENSORS_H

#include "main.h"
#include "bms.h"
#include <stdint.h>

// mcp9808 with A0=A1=A2=GND
#define MCP9808_ADDR          (0x18 << 1)
#define MCP9808_REG_TEMP      0x05
#define MCP9808_REG_MANUF_ID  0x06
#define MCP9808_REG_DEVICE_ID 0x07

typedef struct {
    float temperature_c;
    float temperature_f;
    uint8_t is_valid;
} TempSensor_t;

// initialize temperature struct
void TempSensor_Init(TempSensor_t *temp);

// check if mcp9808 is connected
HAL_StatusTypeDef TempSensor_CheckConnection(I2C_HandleTypeDef *hi2c,
                                             uint16_t *manuf_id,
                                             uint16_t *device_id);

// update temperature struct from mcp9808
HAL_StatusTypeDef TempSensor_Update(I2C_HandleTypeDef *hi2c,
                                    TempSensor_t *temp);

// update BMS data from uart
void PowerSensor_Update(UART_HandleTypeDef *huart,
                        BMS_Data_t *bms_data);

// update both power and temperature
HAL_StatusTypeDef BatterySensors_UpdateAll(I2C_HandleTypeDef *hi2c,
                                           UART_HandleTypeDef *huart,
                                           TempSensor_t *temp,
                                           BMS_Data_t *bms_data);

#endif
