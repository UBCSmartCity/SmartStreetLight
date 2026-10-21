/*
 * comm.c
 *
 * Created on: Feb 18, 2026
 */

#include "comm.h"
#include <stdio.h>
#include <string.h>

void COMM_TransmitBMSData(UART_HandleTypeDef *huart, BMS_Data_t *data) {
    char txBuffer[64];

    // Clear the buffer to prevent garbage data
    memset(txBuffer, 0, sizeof(txBuffer));

    // Format the string exactly as the receiver expects it.
    // We use snprintf to prevent buffer overflows.
    // Adding \r\n at the end is good practice for UART frame separation.
    snprintf(txBuffer, sizeof(txBuffer),
             "V=%hu I=%hu P=%hu A=%hu B=%hu C=%hu D=%hu E=%c\r\n",
             data->voltage_battery,
             data->current_battery,
             data->power_battery,
             data->voltage_generation,
             data->current_generation,
             data->power_generation,
             data->percentage,
             data->status);

    // Transmit the formatted string over the provided UART interface
    HAL_UART_Transmit(huart, (uint8_t*)txBuffer, strlen(txBuffer), 1000);
}
