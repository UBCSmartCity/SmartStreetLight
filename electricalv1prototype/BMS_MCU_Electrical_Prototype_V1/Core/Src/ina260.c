/*
 * ina260.c
 *
 * Created on: Feb 18, 2026
 */

#include "ina260.h"

/**
 * @brief  Initializes the INA260 with default configuration.
 * @param  hi2c: Pointer to a I2C_HandleTypeDef structure
 * @retval HAL status
 */
HAL_StatusTypeDef INA260_Init(I2C_HandleTypeDef *hi2c) {
    // Default configuration:
    // Averaging mode: 1 (no averaging)
    // Bus Voltage Conversion Time: 1.1ms
    // Shunt Current Conversion Time: 1.1ms
    // Operating Mode: Shunt and Bus, Continuous
    // Config Register value: 0x6127
    uint8_t config_data[2] = {0x61, 0x27};

    return HAL_I2C_Mem_Write(hi2c, INA260_I2C_ADDR, INA260_REG_CONFIG, 1, config_data, 2, 100);
}

/**
 * @brief  Reads voltage, current, and power from the INA260.
 * @param  hi2c: Pointer to a I2C_HandleTypeDef structure
 * @param  data: Pointer to the INA260_Data_t struct to store the readings
 * @retval HAL status
 */
HAL_StatusTypeDef INA260_Read_All(I2C_HandleTypeDef *hi2c, INA260_Data_t *data) {
    uint8_t buf[2];
    HAL_StatusTypeDef status;

    // 1. Read Bus Voltage (1 LSB = 1.25 mV)
    status = HAL_I2C_Mem_Read(hi2c, INA260_I2C_ADDR, INA260_REG_VOLTAGE, 1, buf, 2, 100);
    if (status != HAL_OK) return status;
    uint16_t raw_voltage = (buf[0] << 8) | buf[1];
    // Multiply by 1.25 using integer math: (val * 5) / 4
    data->voltage_mV = (raw_voltage * 5) / 4;

    // 2. Read Current (1 LSB = 1.25 mA)
    status = HAL_I2C_Mem_Read(hi2c, INA260_I2C_ADDR, INA260_REG_CURRENT, 1, buf, 2, 100);
    if (status != HAL_OK) return status;
    // Current can be negative, so we cast to int16_t
    int16_t raw_current = (int16_t)((buf[0] << 8) | buf[1]);
    data->current_mA = (raw_current * 5) / 4;

    // 3. Read Power (1 LSB = 10 mW)
    status = HAL_I2C_Mem_Read(hi2c, INA260_I2C_ADDR, INA260_REG_POWER, 1, buf, 2, 100);
    if (status != HAL_OK) return status;
    uint16_t raw_power = (buf[0] << 8) | buf[1];
    data->power_mW = raw_power * 10;

    return HAL_OK;
}
