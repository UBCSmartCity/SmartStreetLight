#include "battery_sensors.h"

// read 16-bit register from mcp9808
static HAL_StatusTypeDef MCP9808_Read16(I2C_HandleTypeDef *hi2c,
                                        uint8_t reg,
                                        uint16_t *value);

// convert raw register value to temperature
static float MCP9808_ConvertTemp(uint16_t raw);

// initialize temperature struct
void TempSensor_Init(TempSensor_t *temp)
{
    if (temp == NULL) return;

    temp->temperature_c = 0.0f;
    temp->temperature_f = 0.0f;
    temp->is_valid = 0;
}

// checks if device responds and optionally reads IDs
HAL_StatusTypeDef TempSensor_CheckConnection(I2C_HandleTypeDef *hi2c,
                                             uint16_t *manuf_id,
                                             uint16_t *device_id)
{
    if (hi2c == NULL) return HAL_ERROR;

    // check if device is alive on I2C bus
    if (HAL_I2C_IsDeviceReady(hi2c, MCP9808_ADDR, 3, 100) != HAL_OK) {
        return HAL_ERROR;
    }

    // read manufacturer ID if requested
    if (manuf_id != NULL) {
        if (MCP9808_Read16(hi2c, MCP9808_REG_MANUF_ID, manuf_id) != HAL_OK) {
            return HAL_ERROR;
        }
    }

    // read device ID if requested
    if (device_id != NULL) {
        if (MCP9808_Read16(hi2c, MCP9808_REG_DEVICE_ID, device_id) != HAL_OK) {
            return HAL_ERROR;
        }
    }

    return HAL_OK;
}

// reads temperature register and updates struct
HAL_StatusTypeDef TempSensor_Update(I2C_HandleTypeDef *hi2c,
                                    TempSensor_t *temp)
{
    uint16_t raw_temp;
    float temp_c;

    if (hi2c == NULL || temp == NULL) {
        return HAL_ERROR;
    }

    // read raw temperature register
    if (MCP9808_Read16(hi2c, MCP9808_REG_TEMP, &raw_temp) != HAL_OK) {
        temp->is_valid = 0;
        return HAL_ERROR;
    }

    // convert raw value to celsius
    temp_c = MCP9808_ConvertTemp(raw_temp);

    temp->temperature_c = temp_c;
    temp->temperature_f = temp_c * 9.0f / 5.0f + 32.0f;
    temp->is_valid = 1;

    return HAL_OK;
}

// uses your existing UART parsing from bms.c
void PowerSensor_Update(UART_HandleTypeDef *huart,
                        BMS_Data_t *bms_data)
{
    if (huart == NULL || bms_data == NULL) return;

    // update struct from incoming UART data
    BMS_ProcessData(huart, bms_data);
}

// updates both temperature and power data
HAL_StatusTypeDef BatterySensors_UpdateAll(I2C_HandleTypeDef *hi2c,
                                           UART_HandleTypeDef *huart,
                                           TempSensor_t *temp,
                                           BMS_Data_t *bms_data)
{
    HAL_StatusTypeDef temp_status;

    temp_status = TempSensor_Update(hi2c, temp);
    PowerSensor_Update(huart, bms_data);

    return temp_status;
}

// reads 2 bytes from given register
static HAL_StatusTypeDef MCP9808_Read16(I2C_HandleTypeDef *hi2c,
                                        uint8_t reg,
                                        uint16_t *value)
{
    uint8_t data[2];

    if (hi2c == NULL || value == NULL) {
        return HAL_ERROR;
    }

    if (HAL_I2C_Mem_Read(hi2c,
                         MCP9808_ADDR,
                         reg,
                         I2C_MEMADD_SIZE_8BIT,
                         data,
                         2,
                         HAL_MAX_DELAY) != HAL_OK) {
        return HAL_ERROR;
    }

    *value = ((uint16_t)data[0] << 8) | data[1];
    return HAL_OK;
}

// converts mcp9808 raw format to celsius
static float MCP9808_ConvertTemp(uint16_t raw)
{
    // clear alert bits
    raw &= 0x1FFF;

    // negative temperature
    if (raw & 0x1000) {
        raw &= 0x0FFF;
        return (raw / 16.0f) - 256.0f;
    }

    // positive temperature
    return raw / 16.0f;
}
