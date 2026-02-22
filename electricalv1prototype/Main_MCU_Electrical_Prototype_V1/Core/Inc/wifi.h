/*
 * wifi.h
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */

#ifndef WIFI_H
#define WIFI_H

#include "main.h"
#include "bms.h" // Needed to access BMS data for reporting

// Initializes ESP8266 with AT commands
void WiFi_Init(UART_HandleTypeDef *huart);

// Checks for incoming web requests and updates LED colors if command received
void WiFi_HandleServer(UART_HandleTypeDef *huart, BMS_Data_t *bmsData, uint8_t *ledState, uint8_t *r, uint8_t *g, uint8_t *b, uint8_t *ledStatus, char *busRoute, char *busTime);

#endif
