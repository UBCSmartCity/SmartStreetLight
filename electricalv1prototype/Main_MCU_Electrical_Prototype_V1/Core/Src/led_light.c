/*
 * led_light.c
 *
 *  Created on: Feb 18, 2026
 *      Author: mishu
 */


#include "led_light.h"

// Buffer to store the PWM duty cycles for every bit of every LED
// 24 bits per LED (G, R, B bytes)
uint16_t pwmData[24 * NO_OF_LEDS];

// We need the DMA handle to stop it in the callback
extern DMA_HandleTypeDef hdma_tim3_ch1_trig;

void LED_Init(void) {
    // Initialize the buffer with '0' bit logic (usually a low duty cycle or 0)
    // Here we initialize to 1 just to have a known state, or 0 to be safe.
    // Adjust based on your specific WS2812 timing requirements.
    for (int i = 0; i < 24 * NO_OF_LEDS; i++) {
        pwmData[i] = 0;
    }
}

void LED_SetColor(int LEDposition, int Red, int Green, int Blue) {
    // WS2812 expects GRB order, not RGB

    // Green Byte (Bit 7 down to 0)
    for (int i = 7; i >= 0; i--) {
        pwmData[24 * LEDposition + 7 - i] = ((Green >> i) & 1) ? 2 : 1;
        // Note: Assuming CCR values: 1 = Logic 0 (~33% duty), 2 = Logic 1 (~66% duty)
        // Verify these match your TIM3 Period (ARR) settings!
    }

    // Red Byte
    for (int i = 7; i >= 0; i--) {
        pwmData[24 * LEDposition + 15 - i] = ((Red >> i) & 1) ? 2 : 1;
    }

    // Blue Byte
    for (int i = 7; i >= 0; i--) {
        pwmData[24 * LEDposition + 23 - i] = ((Blue >> i) & 1) ? 2 : 1;
    }
}

void LED_SetAll(int Red, int Green, int Blue) {
    for (int i = 0; i < NO_OF_LEDS; i++) {
        LED_SetColor(i, Red, Green, Blue);
    }
}

void LED_Send(TIM_HandleTypeDef *htim, uint32_t channel) {
    // Start PWM with DMA
    // length is total bits: 24 bits * Number of LEDs
    HAL_TIM_PWM_Start_DMA(htim, channel, (uint32_t *)pwmData, 24 * NO_OF_LEDS);
}

// HAL Callback: Stops DMA when the transfer is complete so LEDs don't glitch
void HAL_TIM_PWM_PulseFinishedCallback(TIM_HandleTypeDef *htim) {
    HAL_TIM_PWM_Stop_DMA(htim, TIM_CHANNEL_1);

    // Force the line low to latch the data (Reset code > 50us)
    htim->Instance->CCR1 = 0;
}
