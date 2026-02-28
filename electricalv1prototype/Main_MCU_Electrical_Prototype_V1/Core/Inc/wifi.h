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

// 2. Function Prototypes
// Access Point (AP) Functions
void WiFi_Init(UART_HandleTypeDef *huart);
void WiFi_HandleServer(UART_HandleTypeDef *huart, BMS_Data_t *bmsData, uint8_t *ledState,
                        uint8_t *r, uint8_t *g, uint8_t *b, uint8_t *ledStatus,
                        char *busRoute, char *busTime);

// Station (Client) Functions
void WiFi_Init_Station(UART_HandleTypeDef *huart, char* ssid, char* pass);
void WiFi_SendDataToLaptop(UART_HandleTypeDef *huart, BMS_Data_t *bmsData);
void WiFi_SendDataToThingSpeak(UART_HandleTypeDef *huart, BMS_Data_t *bmsData);
void WiFi_SendDataToBlynk(UART_HandleTypeDef *huart, BMS_Data_t *bmsData);

void WiFi_ReadThingSpeak(UART_HandleTypeDef *huart, int *mode, uint8_t *r, uint8_t *g, uint8_t *b, char *busRoute, char *busTime);

// Health Check
uint8_t WiFi_IsModuleAlive(UART_HandleTypeDef *huart);

#endif
