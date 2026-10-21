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
void WiFi_Init_Station(UART_HandleTypeDef *huart, char* ssid, char* pass); // Connects to a WiFi network with given SSID and password
void WiFi_SendDataToLaptop(UART_HandleTypeDef *huart, BMS_Data_t *bmsData); //  Sends BMS data to a laptop via a TCP tunnel
void WiFi_SendDataToThingSpeak(UART_HandleTypeDef *huart, BMS_Data_t *bmsData); // Sends BMS data to ThingSpeak for cloud logging
void WiFi_SendDataToBlynk(UART_HandleTypeDef *huart, BMS_Data_t *bmsData); // Sends BMS data to Blynk for mobile app monitoring

// ThingSpeak Read Function
void WiFi_ReadThingSpeak(UART_HandleTypeDef *huart,
                         volatile uint8_t *mode,
                         volatile uint8_t *r,
                         volatile uint8_t *g,
                         volatile uint8_t *b,
                         BusInfo *buses);

// Health Check
uint8_t WiFi_IsModuleAlive(UART_HandleTypeDef *huart);
// Utility Functions
void urlDecode(char *src, char *dest);

#endif
