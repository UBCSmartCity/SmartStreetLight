#include "wifi.h"
#include <stdio.h>
#include <string.h>
#include<stdlib.h>

static uint8_t rxBuffer[512];
static char ATcommand[512];

// --- UTILITIES ---
uint8_t WiFi_IsModuleAlive(UART_HandleTypeDef *huart) {
    uint8_t response[32];
    memset(response, 0, sizeof(response));
    HAL_UART_Transmit(huart, (uint8_t *)"AT\r\n", 4, 100);
    HAL_UART_Receive(huart, response, sizeof(response), 50);
    return (strstr((char *)response, "OK") != NULL);
}

// --- ACCESS POINT MODE ---
void WiFi_Init(UART_HandleTypeDef *huart) {
    uint8_t ATisOK = 0;
    // 1. Reset
    HAL_UART_Transmit(huart, (uint8_t *)"AT+RST\r\n", 8, 1000);
    HAL_Delay(1000);

    // 2. Set Mode to AP
    while (!ATisOK) {
        HAL_UART_Transmit(huart, (uint8_t *)"AT+CWMODE_CUR=2\r\n", 17, 1000);
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) ATisOK = 1;
        HAL_Delay(500);
    }

    // 3. Set SSID and Password
    ATisOK = 0;
    while (!ATisOK) {
        HAL_UART_Transmit(huart, (uint8_t *)"AT+CWSAP_CUR=\"STM32\",\"12345678\",1,3,4,0\r\n", 41, 1000);
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) ATisOK = 1;
        HAL_Delay(500);
    }

    // 4. Set Static IP, MUX, and Server
    HAL_UART_Transmit(huart, (uint8_t *)"AT+CIPAP_CUR=\"192.168.51.1\"\r\n", 29, 1000);
    HAL_Delay(500);
    HAL_UART_Transmit(huart, (uint8_t *)"AT+CIPMUX=1\r\n", 13, 1000);
    HAL_Delay(500);
    HAL_UART_Transmit(huart, (uint8_t *)"AT+CIPSERVER=1,80\r\n", 19, 1000);
}

// --- STATION MODE (CLIENT) ---
void WiFi_Init_Station(UART_HandleTypeDef *huart, char* ssid, char* pass) {

    uint8_t ATisOK = 0;
    // 1. Reset
    HAL_UART_Transmit(huart, (uint8_t *)"AT+RST\r\n", 8, 1000);
    HAL_Delay(1000);

    // 2. Set Mode to Station
    while (!ATisOK) {
        HAL_UART_Transmit(huart, (uint8_t *)"AT+CWMODE_CUR=1\r\n", 17, 1000);
        memset(rxBuffer, 0, sizeof(rxBuffer));
        HAL_UART_Receive(huart, rxBuffer, 512, 1000);
        if (strstr((char *)rxBuffer, "OK")) ATisOK = 1;
        HAL_Delay(500);
    }


        ATisOK = 0;
        while(!ATisOK){
          sprintf(ATcommand,"AT+CWJAP_CUR=\"Testing\",\"12346789\"\r\n");
          memset(rxBuffer,0,sizeof(rxBuffer));
          HAL_UART_Transmit(huart,(uint8_t *)ATcommand,strlen(ATcommand),1000);
          HAL_UART_Receive (huart, rxBuffer, 512, 20000);
          if(strstr((char *)rxBuffer,"OK")){
            ATisOK = 1;
          }
          HAL_Delay(500);
        }

        ATisOK = 0;
        while(!ATisOK){
          sprintf(ATcommand,"AT+CIPMUX=0\r\n");
          memset(rxBuffer,0,sizeof(rxBuffer));
          HAL_UART_Transmit(huart,(uint8_t *)ATcommand,strlen(ATcommand),1000);
          HAL_UART_Receive (huart, rxBuffer, 512, 1000);
          if(strstr((char *)rxBuffer,"OK")){
            ATisOK = 1;
          }
          HAL_Delay(500);
        }
}
void WiFi_SendDataToLaptop(UART_HandleTypeDef *huart, BMS_Data_t *bmsData) {
    // 1. Use the IP we just found from the ping command
    char remoteIP[] = "3.208.46.244";
    int remotePort = 80; // The tunnel always listens on 80 for the internet

    // 2. Open the connection to the tunnel server
    sprintf(ATcommand, "AT+CIPSTART=0,\"TCP\",\"%s\",%d\r\n", remoteIP, remotePort);
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_Delay(1000);

    // 3. Prepare your BMS Data (JSON format)
    char body[128];
    int bodyLen = snprintf(body, sizeof(body),
        "{\"volt\":%lu,\"soc\":%lu}",
        (unsigned long)bmsData->voltage_battery,
        (unsigned long)bmsData->percentage);

    // 4. Prepare the HTTP Header
    // IMPORTANT: 'Host' must match your unique lhr.life URL exactly
    char header[256];
    int headerLen = snprintf(header, sizeof(header),
        "POST /update HTTP/1.1\r\n"
        "Host: 08e090705d2a78.lhr.life\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: %d\r\n"
        "Connection: close\r\n"
        "\r\n", bodyLen);

    // 5. Send the command to tell ESP-01 how much data is coming
    sprintf(ATcommand, "AT+CIPSEND=0,%d\r\n", headerLen + bodyLen);
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_Delay(200); // Small pause for ESP-01 to prepare

    // 6. Send the Header and then the Body
    HAL_UART_Transmit(huart, (uint8_t *)header, headerLen, 1000);
    HAL_UART_Transmit(huart, (uint8_t *)body, bodyLen, 1000);

    // 7. Close the session
    HAL_UART_Transmit(huart, (uint8_t *)"AT+CIPCLOSE=0\r\n", 15, 500);
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



void WiFi_SendDataToBlynk(UART_HandleTypeDef *huart, BMS_Data_t *bmsData) {
    // Your specific credentials
    char blynkToken[] = "a_00qqndsS3TN-w_eZw7pf4L30cazA3j";
    char blynkHost[] = "blynk.cloud";

    // 1. Start TCP Connection (Port 80)
    // Note: No '0,' used here because you set CIPMUX=0 in Init
    sprintf(ATcommand, "AT+CIPSTART=\"TCP\",\"%s\",80\r\n", blynkHost);
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_Delay(500);

    // 2. Prepare the Request String
    // V0 = Voltage, V1 = SOC percentage
    char request[400];
    int reqLen = snprintf(request, sizeof(request),
        "GET /external/api/batch/update?token=%s&V0=%lu&V1=%lu HTTP/1.1\r\n"
        "Host: %s\r\n"
        "Connection: close\r\n"
        "\r\n",
        blynkToken,
		(unsigned long)300,//(unsigned long)bmsData->voltage_battery,
		(unsigned long)67,//(unsigned long)bmsData->percentage,
        blynkHost);

    // 3. Tell ESP how many bytes to send
    sprintf(ATcommand, "AT+CIPSEND=%d\r\n", reqLen);
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_Delay(200); // Wait for the ">" prompt from ESP

    // 4. Send the HTTP request
    HAL_UART_Transmit(huart, (uint8_t *)request, reqLen, 1000);

    // 5. Brief delay to let the transmission finish
    HAL_Delay(500);
}


void WiFi_SendDataToThingSpeak(UART_HandleTypeDef *huart, BMS_Data_t *bmsData) {
    // Note: Use the base URL for the GET request
    char api_key[] = "V5ANR0ZJ99TQ2AZS";
    char toPost[300]; // Increased buffer to accommodate all 7 fields
    char ATcommand[64];

    // 1. Start TCP Connection
    sprintf(ATcommand, "AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80\r\n");
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    HAL_Delay(500); // Wait for connection

    // 2. Prepare the Request (Mapping fields 1 through 7)
    // f1:Batt_V, f2:SOC, f3:Batt_I, f4:Gen_V, f5:Gen_I, f6:Temp(Dummy), f7:Status
    int reqLen = snprintf(toPost, sizeof(toPost),
        "GET /update?api_key=%s&field1=%u&field2=%u&field3=%u&field4=%u&field5=%u&field6=%u&field7=%d\r\n",
        api_key,
        bmsData->voltage_battery,    // Field 1
        bmsData->percentage,         // Field 2
        bmsData->current_battery,    // Field 3
        bmsData->voltage_generation, // Field 4
        bmsData->current_generation, // Field 5
        25,                          // Field 6 (Temperature Placeholder)
        (bmsData->status == 'A' ? 1 : 0) // Field 7 (Logic: 1 if Active, else 0)
    );

    // 3. Send CIPSEND with the length of the string
    sprintf(ATcommand, "AT+CIPSEND=%d\r\n", reqLen);
    memset(rxBuffer, 0, sizeof(rxBuffer));
    HAL_UART_Transmit(huart, (uint8_t *)ATcommand, strlen(ATcommand), 1000);

    // Brief wait for the ">" prompt
    HAL_UART_Receive(huart, (uint8_t *)rxBuffer, sizeof(rxBuffer), 500);

    // 4. Send actual data if prompt is received
    if(strstr((char *)rxBuffer, ">"))
    {
        HAL_UART_Transmit(huart, (uint8_t *)toPost, reqLen, 1000);
        // Final receive to clear the buffer of the "SEND OK" message
        HAL_UART_Receive(huart, (uint8_t *)rxBuffer, sizeof(rxBuffer), 1000);
    }

    // 5. Close Connection (Good practice for ThingSpeak)
    HAL_UART_Transmit(huart, (uint8_t *)"AT+CIPCLOSE\r\n", 13, 500);
}




/**
  * @brief Clears UART Overrun errors to keep the ESP32 communication active.
  */
void UART_Reset(UART_HandleTypeDef *huart) {
    if (__HAL_UART_GET_FLAG(huart, UART_FLAG_ORE)) {
        // This is a manual hardware clear:
        // 1. Read SR (Status Register)
        // 2. Read DR (Data Register)
        __HAL_UART_CLEAR_OREFLAG(huart);

        // OR simply:
        __HAL_UART_CLEAR_FLAG(huart, UART_FLAG_ORE);
    }
}

/**
  * @brief Fetches ThingSpeak CSV data and updates main variables via pointers.
  * Handles the format: Timestamp, EntryID, Field1, Field2, Field3, Field4, Field5, Field6
  */




void WiFi_ReadThingSpeak(UART_HandleTypeDef *huart,
                         int *mode,
                         uint8_t *r,
                         uint8_t *g,
                         uint8_t *b,
                         char *busRoute,
                         char *busTime)
{
    char rxBuf[1024] = {0};
    char getReq[256];
    char atCmd[32];

    UART_Reset(huart);

    // -----------------------
    // 1. Start TCP connection
    // -----------------------
    HAL_UART_Transmit(huart,
        (uint8_t*)"AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80\r\n",
        44, 1000);
    HAL_Delay(800);

    // -----------------------
    // 2. Prepare HTTP GET
    // -----------------------
    snprintf(getReq, sizeof(getReq),
             "GET /channels/2897632/feeds.csv?api_key=0EZLFMJSEPWM8N6C&results=1 HTTP/1.1\r\n"
             "Host: api.thingspeak.com\r\n"
             "Connection: close\r\n\r\n");

    snprintf(atCmd, sizeof(atCmd),
             "AT+CIPSEND=%d\r\n",
             (int)strlen(getReq));

    HAL_UART_Transmit(huart, (uint8_t*)atCmd, strlen(atCmd), 500);
    HAL_Delay(200);

    HAL_UART_Transmit(huart, (uint8_t*)getReq, strlen(getReq), 1000);

    // -----------------------
    // 3. Receive response
    // -----------------------
    HAL_UART_Receive(huart,
                     (uint8_t*)rxBuf,
                     sizeof(rxBuf) - 1,
                     5000);

    // -----------------------
    // 4. Parse using "UTC,"
    // -----------------------
    char *dataPtr = strstr(rxBuf, "UTC,");

    if (dataPtr)
    {
        dataPtr += 4;  // move past "UTC,"

        int entryID, m_tmp, r_tmp, g_tmp, b_tmp;

        int matched = sscanf(dataPtr,
                             "%d,%d,%d,%d,%d,%15[^,],%15s",
                             &entryID,
                             &m_tmp,
                             &r_tmp,
                             &g_tmp,
                             &b_tmp,
                             busRoute,
                             busTime);

        if (matched == 7)
        {
            *mode = m_tmp;
            *r = (uint8_t)r_tmp;
            *g = (uint8_t)g_tmp;
            *b = (uint8_t)b_tmp;
        }
    }

    // -----------------------
    // 5. Close TCP connection
    // -----------------------
    HAL_UART_Transmit(huart,
        (uint8_t*)"AT+CIPCLOSE\r\n",
        13, 500);

    HAL_Delay(300);   // small delay for clean reconnect next cycle
}
