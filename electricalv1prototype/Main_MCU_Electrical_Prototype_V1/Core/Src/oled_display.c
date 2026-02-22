/*
 * oled_display.c
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */

#include "oled_display.h"
#include <stdio.h> // Ensure this is here for snprintf

static uint32_t previousDisplayMillis = 0;
static const uint32_t displayInterval = 2000;
static int display_count = 0;

void Display_InitSystem(void) {
    SSD1306_Init();
    SSD1306_GotoXY(0, 0);
    SSD1306_Puts("Smart", &Font_11x18, 1);
    SSD1306_GotoXY(0, 30);
    SSD1306_Puts("Streetlight", &Font_11x18, 1);
    SSD1306_UpdateScreen();
    HAL_Delay(1000);
    SSD1306_Stopscroll();
}

// UPDATE: Added const char* for route and time so the display can show the updated variables
void Display_UpdateRoutine(BMS_Data_t *bmsData, const char *busRoute, const char *busTime) {
    uint32_t currentMillis = HAL_GetTick();

    if (currentMillis - previousDisplayMillis >= displayInterval) {
        previousDisplayMillis = currentMillis;
        display_count++;
        SSD1306_Clear();

        char buf[32]; // Shared buffer for text formatting

        switch(display_count) {
            case 1:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("Next Bus", &Font_11x18, 1);

                // Construct the dynamic string like "R4 - 11:30"
                snprintf(buf, sizeof(buf), "%s - %s", busRoute, busTime);

                SSD1306_GotoXY(0, 20);
                SSD1306_Puts(buf, &Font_11x18, 1);
                break;
            case 2:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("Weather", &Font_11x18, 1);
                SSD1306_GotoXY(0, 20);
                SSD1306_Puts("20% Rain", &Font_11x18, 1);
                break;
            case 3:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("System Health", &Font_11x18, 1);

                snprintf(buf, sizeof(buf), "Charge: %u%%", bmsData->percentage);
                SSD1306_GotoXY(0, 25);
                SSD1306_Puts(buf, &Font_11x18, 1);

                display_count = 0; // Reset loop
                break;
            default:
                display_count = 0;
        }
        SSD1306_UpdateScreen();
    }
}
