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

void Display_InitSystem(void);
void Display_UpdateRoutine(BMS_Data_t *bmsData,const char *busRoute, const char *busTime, const int red, const int green, const int blue);

#endif
