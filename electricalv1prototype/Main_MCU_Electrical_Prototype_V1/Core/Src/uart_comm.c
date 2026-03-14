#include "uart_comm.h"
#include <stdio.h>
#include <string.h>

/* Temporary variable for received UART byte */
static uint8_t ch;

/* Buffer to store incoming UART line */
static char rxline[80];

/* Current index in rxline buffer */
static uint16_t idx = 0;

/* Struct holding most recent parsed battery data */
volatile LatestData last = {0};

/* Flag indicating if last parsed message was valid */
volatile uint8_t last_valid = 0;

/* Simulated battery parameters for 18650 cell */
static uint16_t voltage_mV = 3700;     // nominal voltage 3.7V
static uint16_t current_mA = 500;      // simulated current draw
static const uint16_t capacity_mAh = 2000; // battery capacity

/* Buffer used to format outgoing UART message */
static char txbuf[80];


/* Handles UART receive and parses incoming battery data string */
void UART_Comm_Receiver_Process(UART_HandleTypeDef *huart)
{
    /* Attempt to read one byte from UART */
    if (HAL_UART_Receive(huart, &ch, 1, 100) == HAL_OK)
    {
        /* Toggle LED to indicate data reception */
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_1);
        HAL_Delay(50);
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_1);

        /* Check for end of message */
        if (ch == '\n')
        {
            /* Terminate string */
            rxline[idx] = '\0';

            /* Reset buffer index for next message */
            idx = 0;

            /* Variables for parsed numeric values */
            unsigned int v_int, v_frac;
            unsigned int i_int, i_frac;
            unsigned long p;
            unsigned int c;

            /* Parse formatted UART string */
            if (sscanf(rxline, "V=%u.%u,I=%u.%u,P=%lu,C=%u",
                       &v_int, &v_frac, &i_int, &i_frac, &p, &c) == 6)
            {
                /* Convert parsed values to millivolts and milliamps */
                last.voltage_mV = (uint16_t)(v_int * 1000 + v_frac);
                last.current_mA = (uint16_t)(i_int * 1000 + i_frac);

                /* Store power and capacity values */
                last.power_mW = (uint32_t)p;
                last.capacity_mAh = (uint16_t)c;

                /* Mark data as valid */
                last_valid = 1;
            }
            else
            {
                /* Parsing failed */
                last_valid = 0;
            }
        }
        else
        {
            /* Store received character in buffer */
            if (idx < sizeof(rxline) - 1)
            {
                rxline[idx++] = (char)ch;
            }
            else
            {
                /* Reset buffer if overflow occurs */
                idx = 0;
            }
        }
    }
}


/* Generates simulated battery data and transmits it over UART */
void UART_Comm_Transmitter_Process(UART_HandleTypeDef *huart)
{
    /* Button state controls battery simulation behavior */
    if (HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_0) == GPIO_PIN_RESET)
    {
        /* Reset to nominal battery conditions */
        voltage_mV = 3700;
        current_mA = 500;
    }
    else
    {
        /* Increment voltage gradually */
        voltage_mV += 10;

        /* Wrap voltage within Li-ion operating range */
        if (voltage_mV > 4200)
        {
            voltage_mV = 3000;
        }

        /* Increment simulated current */
        current_mA += 20;

        /* Wrap current range */
        if (current_mA > 2000)
        {
            current_mA = 100;
        }
    }

    /* Calculate electrical power */
    uint32_t power_mW = (voltage_mV * current_mA) / 1000;

    /* Format UART transmission string */
    int n = snprintf(
        txbuf, sizeof(txbuf),
        "V=%u.%03u,I=%u.%03u,P=%lu,C=%u\n",
        voltage_mV / 1000, voltage_mV % 1000,
        current_mA / 1000, current_mA % 1000,
        (unsigned long)power_mW,
        capacity_mAh
    );

    /* Send formatted message over UART */
    HAL_UART_Transmit(huart, (uint8_t *)txbuf, (uint16_t)n, 200);

    /* Delay between transmissions */
    HAL_Delay(200);
}
