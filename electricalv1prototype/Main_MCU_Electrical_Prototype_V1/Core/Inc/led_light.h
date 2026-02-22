/*
 * led_light.h
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */

#ifndef LED_LIGHT_H
#define LED_LIGHT_H

#include "main.h"

// Define the number of LEDs in your strip
#define NO_OF_LEDS 24

// Initialize data structures (sets all LEDs to OFF state in memory)
void LED_Init(void);

// Set color for a specific LED index (0 to NO_OF_LEDS-1)
void LED_SetColor(int index, int Red, int Green, int Blue);

// Update all LEDs with one solid color
void LED_SetAll(int Red, int Green, int Blue);

// Send the data to the strip via DMA
// Pass the timer handle (e.g., &htim3) and the channel (e.g., TIM_CHANNEL_1)
void LED_Send(TIM_HandleTypeDef *htim, uint32_t channel);

#endif /* LED_LIGHT_H */
