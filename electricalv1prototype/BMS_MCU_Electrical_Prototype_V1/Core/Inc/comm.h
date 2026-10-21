/*
 * comm.h
 *
 * Created on: Feb 18, 2026
 */

#ifndef COMM_H_
#define COMM_H_

#include "stm32f1xx_hal.h" // Note: Update to your specific STM32 family (e.g., stm32g4xx_hal.h)

/**
 * @brief Telemetry packet structure for battery and generation monitoring.
 *        Aggregates operational metrics across storage and power-input rails
 *        to be formatted and dispatched over the communication interface.
 */
typedef struct {
    uint16_t voltage_battery;       /**< Battery terminal voltage (e.g., in mV or scaled ADC counts) */
    uint16_t current_battery;       /**< Net battery current draw/charge magnitude */
    uint16_t power_battery;         /**< Computed battery power flow */
    uint16_t voltage_generation;    /**< Generator input rail voltage */
    uint16_t current_generation;    /**< Current delivered by the generation source */
    uint16_t power_generation;      /**< Total power produced by the generation source */
    uint16_t percentage;            /**< State of Charge (SoC) estimation (0 - 100%) */
    char status;                    /**< System state flag (e.g., charging, discharging, fault, or idle) */
} BMS_Data_t;

/**
 * @brief Serializes and transmits the aggregated BMS metrics over UART.
 * 
 * @param huart Pointer to the STM32 HAL UART handle configured for telemetry output.
 * @param data  Pointer to the populated BMS_Data_t structure containing current measurements.
 */
void COMM_TransmitBMSData(UART_HandleTypeDef *huart, BMS_Data_t *data);

#endif /* COMM_H_ */