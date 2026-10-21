/*
 * oled_display.h
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */
#ifndef OLED_DISPLAY_H
#define OLED_DISPLAY_H

#include "main.h"
#include "ssd1306.h"
#include "fonts.h"
#include "bms.h"

void Display_InitSystem(void);// Initialize the OLED display and show a welcome message
void Display_UpdateRoutine(BMS_Data_t *bmsData, BusInfo *buses, const int red, const int green, const int blue); // Update the OLED display with BMS data, bus info, and LED colors
#endif
