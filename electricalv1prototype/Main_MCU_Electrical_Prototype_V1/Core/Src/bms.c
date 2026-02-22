/*
 * bms.c
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */


#include "bms.h"
#include <stdio.h>
#include <string.h>

static uint8_t rx2Buffer[64];

// Restoring your original state tracking variables just in case you need them later
uint8_t dataReady = 0;
int rxIndex = 0;

void BMS_ProcessData(UART_HandleTypeDef *huart, BMS_Data_t *data) {
    memset(rx2Buffer, 0, sizeof(rx2Buffer));


    if (HAL_UART_Receive(huart, rx2Buffer, 64, 1000) == HAL_OK) {
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
