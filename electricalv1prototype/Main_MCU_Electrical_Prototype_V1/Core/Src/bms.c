/*
 * bms.c
 *
 * Created on: Feb 18, 2026
 * Author: mishu
 */

#include "bms.h"
#include <stdio.h>
#include <string.h>

static uint8_t rx2Buffer[64];

// Restoring your original state tracking variables
uint8_t dataReady = 0;
int rxIndex = 0;

void BMS_ProcessData(UART_HandleTypeDef *huart, BMS_Data_t *data) {
    memset(rx2Buffer, 0, sizeof(rx2Buffer));

    uint8_t rxByte;
    uint8_t bufferIndex = 0;

    // 1. Read byte-by-byte until we hit the newline or fill the buffer
    while (bufferIndex < (sizeof(rx2Buffer) - 1)) {
        // Read exactly 1 byte with a short timeout
        if (HAL_UART_Receive(huart, &rxByte, 1, 50) == HAL_OK) {
            rx2Buffer[bufferIndex++] = rxByte;

            // Stop reading if we hit the end-of-line character
            if (rxByte == '\n') {
                break;
            }
        } else {
            // Break loop if UART times out (no more data arriving)
            break;
        }
    }

    // 2. If we actually received data, parse it
    if (bufferIndex > 0) {
        char *v_pointer = strchr((char*)rx2Buffer, 'V');

        if (v_pointer != NULL) {
            if (sscanf(v_pointer,
                       "V=%hu I=%hu P=%hu A=%hu B=%hu C=%hu D=%hu E=%c",
                       &data->voltage_battery,
                       &data->current_battery,
                       &data->power_battery,
                       &data->voltage_generation,
                       &data->current_generation,
                       &data->power_generation,
                       &data->percentage,
                       &data->status) == 8)
            {
                rxIndex = (uint8_t)(v_pointer - (char*)rx2Buffer);
                dataReady = 1;
            }
        }
    }
}
