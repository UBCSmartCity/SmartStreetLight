/*
 * wifi.c
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */
#include "wifi.h"
#include <stdio.h>
#include <string.h>

// Internal buffers
static uint8_t rxBuffer[512];
static char ATcommand[128];

void WiFi_Init(UART_HandleTypeDef *huart) {
    uint8_t ATisOK = 0;

    // 1. Reset
    sprintf(ATcommand, "AT+RST\r\n");
    memset(rxBuffer, 0, sizeof(rxBuffer));
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_UART_Receive(huart, rxBuffer, 512, 100);
    HAL_Delay(500);

    // 2. Set Mode to AP (Access Point) - Blocking Wait
    ATisOK = 0;
    while (!ATisOK) {
        sprintf(ATcommand, "AT+CWMODE_CUR=2\r\n");
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) {
            ATisOK = 1;
        }
        HAL_Delay(500);
    }

    // 3. Set SSID and Password
    ATisOK = 0;
    while (!ATisOK) {
        sprintf(ATcommand, "AT+CWSAP_CUR=\"STM32\",\"12345678\",1,3,4,0\r\n");
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) {
            ATisOK = 1;
        }
        HAL_Delay(500);
    }

    // 4. Set Static IP Address
    ATisOK = 0;
    while (!ATisOK) {
        sprintf(ATcommand, "AT+CIPAP_CUR=\"192.168.51.1\"\r\n");
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) {
            ATisOK = 1;
        }
        HAL_Delay(500);
    }

    // 5. Enable Multiple Connections
    ATisOK = 0;
    while (!ATisOK) {
        sprintf(ATcommand, "AT+CIPMUX=1\r\n");
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) {
            ATisOK = 1;
        }
        HAL_Delay(500);
    }

    // 6. Start Server on Port 80
    ATisOK = 0;
    while (!ATisOK) {
        sprintf(ATcommand, "AT+CIPSERVER=1,80\r\n");
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) {
            ATisOK = 1;
        }
        HAL_Delay(500);
    }
}

// UPDATE: Added busRoute and busTime parameters to intercept the strings
void WiFi_HandleServer(UART_HandleTypeDef *huart, BMS_Data_t *bmsData, uint8_t *ledState, uint8_t *r, uint8_t *g, uint8_t *b, uint8_t *ledStatus, char *busRoute, char *busTime) {
    int channel = 100;

    memset(rxBuffer, 0, sizeof(rxBuffer));
    HAL_UART_Receive(huart, rxBuffer, 512, 1000);

    // 1. Parse Channel ID
    if (strstr((char *)rxBuffer, "+IPD,0")) channel = 0;
    else if (strstr((char *)rxBuffer, "+IPD,1")) channel = 1;
    else if (strstr((char *)rxBuffer, "+IPD,2")) channel = 2;
    else if (strstr((char *)rxBuffer, "+IPD,3")) channel = 3;
    else if (strstr((char *)rxBuffer, "+IPD,4")) channel = 4;
    else if (strstr((char *)rxBuffer, "+IPD,5")) channel = 5;
    else if (strstr((char *)rxBuffer, "+IPD,6")) channel = 6;
    else if (strstr((char *)rxBuffer, "+IPD,7")) channel = 7;
    else channel = 100;

    if (channel < 8) {

        // 2. Check for LED Commands
        char *cmdPtr = strstr((char *)rxBuffer, "CMD:");
        if (cmdPtr != NULL) {
            int l_tmp, r_tmp, g_tmp, b_tmp;
            if (sscanf(cmdPtr, "CMD:L=%d,R=%d,G=%d,B=%d",
                       &l_tmp, &r_tmp, &g_tmp, &b_tmp) == 4) {
                *ledState = (uint8_t)l_tmp;
                *r = (uint8_t)r_tmp;
                *g = (uint8_t)g_tmp;
                *b = (uint8_t)b_tmp;
                *ledStatus = (*ledState > 0) ? 1 : 0;
            }
        }

        // NEW: 2.5 Check for Bus Timing Commands
        char *busPtr = strstr((char *)rxBuffer, "BUS:");
        if (busPtr != NULL) {
            char tempRoute[16] = {0};
            char tempTime[16] = {0};
            // Reads the string up to the comma for the route, then the rest for the time
            if (sscanf(busPtr, "BUS:%15[^,],%15s[^|]", tempRoute, tempTime) == 2) {
                strncpy(busRoute, tempRoute, 16);
                strncpy(busTime, tempTime, 16);
            }
        }

        // 3. Prepare HTTP Response
        char httpResponse[512];
        int dataLen = snprintf(httpResponse, sizeof(httpResponse),
            "Location: UBC ESC 208\r\n"
            "--- BMS STATUS ---\r\n"
            "Battery Voltage: %u mV\r\n"
            "Battery Current: %u mA\r\n"
            "Battery Power:   %u mW\r\n"
            "Solar Voltage:   %u mV\r\n"
            "Solar Power:     %u mW\r\n"
            "SOC:             %u %%\r\n"
            "BMS Status:      %c\r\n"
            "--- LIGHT STATUS ---\r\n"
            "LED State:       %s\r\n"
            "RGB Values:      %u,%u,%u\r\n",
            bmsData->voltage_battery,
            bmsData->current_battery,
            bmsData->power_battery,
            bmsData->voltage_generation,
            bmsData->power_generation,
            bmsData->percentage,
            bmsData->status,
            (*ledState > 0) ? "ON" : "OFF",
            *r, *g, *b
        );

        // 4. Send CIPSEND Command
        sprintf(ATcommand, "AT+CIPSEND=%d,%d\r\n", channel, dataLen);
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 100);

        // 5. Send Actual Data if we got the prompt ">"
        if (strstr((char *)rxBuffer, ">")) {
            HAL_UART_Transmit(huart, (uint8_t *)httpResponse, dataLen, 1000);
            HAL_UART_Receive(huart, rxBuffer, 512, 100);
        }

        // 6. Close Connection
        sprintf(ATcommand, "AT+CIPCLOSE=%d\r\n", channel);
        HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
        HAL_UART_Receive(huart, rxBuffer, 512, 100);

        channel = 100; // Reset channel
    }
}
