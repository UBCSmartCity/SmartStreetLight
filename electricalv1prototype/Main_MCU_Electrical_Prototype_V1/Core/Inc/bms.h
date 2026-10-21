/*
 * bms.h
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */

#ifndef BMS_H
#define BMS_H

#include "main.h"
#include <stdio.h>
#include <string.h>

/**
 * Parsed telemetry structure matching the incoming BMS serial packet.
 * Holds processed electrical metrics and operating state for the main controller.
 */
typedef struct {
    uint16_t voltage_battery;
    uint16_t current_battery;
    uint16_t power_battery;
    uint16_t voltage_generation;
    uint16_t current_generation;
    uint16_t power_generation;
    uint16_t percentage; // Calculated battery state of charge (0 - 100%)
    char     status; // System state indicator
} BMS_Data_t;

// Process incoming UART data and update the struct
void BMS_ProcessData(UART_HandleTypeDef *huart, BMS_Data_t *data);

#endif
