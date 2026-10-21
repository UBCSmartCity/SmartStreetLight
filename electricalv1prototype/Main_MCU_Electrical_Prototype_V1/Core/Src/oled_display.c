/*
 * oled_display.c
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */
#include "oled_display.h"
#include "wifi.h"
#include <stdio.h>

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

// UPDATE: Added BusInfo array to pass the 3 buses in easily
void Display_UpdateRoutine(BMS_Data_t *bmsData, BusInfo *buses, const int red, const int green, const int blue) {
    uint32_t currentMillis = HAL_GetTick();

    if (currentMillis - previousDisplayMillis >= displayInterval) {
        previousDisplayMillis = currentMillis;
        display_count++;
        SSD1306_Clear();

        char buf[64]; // Shared buffer for text formatting

        switch(display_count) {
        case 1:
                        SSD1306_GotoXY(0, 0);
                        SSD1306_Puts("Next Bus 1", &Font_11x18, 1);

                        snprintf(buf, sizeof(buf), "Bus:  %s", buses[0].name);
                        SSD1306_GotoXY(0, 20);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Dir:  %s", buses[0].route);
                        SSD1306_GotoXY(0, 32);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Time: %s", buses[0].time);
                        SSD1306_GotoXY(0, 44);
                        SSD1306_Puts(buf, &Font_7x10, 1);
                        break;

                    case 2:
                        SSD1306_GotoXY(0, 0);
                        SSD1306_Puts("Next Bus 2", &Font_11x18, 1);

                        snprintf(buf, sizeof(buf), "Bus:  %s", buses[1].name);
                        SSD1306_GotoXY(0, 20);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Dir:  %s", buses[1].route);
                        SSD1306_GotoXY(0, 32);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Time: %s", buses[1].time);
                        SSD1306_GotoXY(0, 44);
                        SSD1306_Puts(buf, &Font_7x10, 1);
                        break;

                    case 3:
                        SSD1306_GotoXY(0, 0);
                        SSD1306_Puts("Next Bus 3", &Font_11x18, 1);

                        snprintf(buf, sizeof(buf), "Bus:  %s", buses[2].name);
                        SSD1306_GotoXY(0, 20);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Dir:  %s", buses[2].route);
                        SSD1306_GotoXY(0, 32);
                        SSD1306_Puts(buf, &Font_7x10, 1);

                        snprintf(buf, sizeof(buf), "Time: %s", buses[2].time);
                        SSD1306_GotoXY(0, 44);
                        SSD1306_Puts(buf, &Font_7x10, 1);
                        break;
            case 4:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("Weather", &Font_11x18, 1);
                SSD1306_GotoXY(0, 20);
                SSD1306_Puts("20% Rain", &Font_11x18, 1);
                break;
            case 5:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("System Health", &Font_7x10, 1);
                snprintf(buf, sizeof(buf), "Charge: %u%%", bmsData->percentage);
                SSD1306_GotoXY(0, 25);
                SSD1306_Puts(buf, &Font_11x18, 1);
                break;
            case 6:
                SSD1306_GotoXY(0, 0);
                SSD1306_Puts("color rgb", &Font_11x18, 1);
                snprintf(buf, sizeof(buf), "%d %d %d %%", red, blue, green); // Note: Original code mapped it red, blue, green.
                SSD1306_GotoXY(0, 25);
                SSD1306_Puts(buf, &Font_11x18, 1);

                display_count = 0; // Reset loop back to the start
                break;
            default:
                display_count = 0;
        }
        SSD1306_UpdateScreen();
    }
}
