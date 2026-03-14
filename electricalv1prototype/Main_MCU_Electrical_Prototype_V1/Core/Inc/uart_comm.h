#ifndef UART_COMM_H
#define UART_COMM_H

#include "main.h"
#include <stdint.h>

typedef struct {
    uint16_t voltage_mV;
    uint16_t current_mA;
    uint32_t power_mW;
    uint16_t capacity_mAh;
} LatestData;

extern volatile LatestData last;
extern volatile uint8_t last_valid;

void UART_Comm_Receiver_Process(UART_HandleTypeDef *huart);
void UART_Comm_Transmitter_Process(UART_HandleTypeDef *huart);

#endif /* UART_COMM_H */
