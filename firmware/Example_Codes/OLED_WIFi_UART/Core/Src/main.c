/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2026 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include "stdio.h"
#include "string.h"
#include "fonts.h"
#include "ssd1306.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
I2C_HandleTypeDef hi2c1;

TIM_HandleTypeDef htim3;
DMA_HandleTypeDef hdma_tim3_ch1_trig;

UART_HandleTypeDef huart1;
UART_HandleTypeDef huart2;

/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_DMA_Init(void);
static void MX_I2C1_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_TIM3_Init(void);
/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */


//************ BMS UART **********//
typedef struct
{
    uint16_t voltage_battery;
    uint16_t current_battery;
    uint16_t power_battery;

    uint16_t voltage_generation;
    uint16_t current_generation;
    uint16_t power_generation;

    uint16_t percentage;
    char     status;

} BMS_Data_t;

BMS_Data_t bmsData = {0};

uint8_t rx2Buffer[64];
uint8_t dataReady = 0; //data ready flag can be changed to bool
int rxIndex = 0;


//************ LED PWM**********//

#define noOfLEDs 24
uint16_t pwmData[24*noOfLEDs];
void HAL_TIM_PWM_PulseFinishedCallback(TIM_HandleTypeDef *htim)
{
    HAL_TIM_PWM_Stop_DMA(&htim3, TIM_CHANNEL_1);
    htim3.Instance->CCR1 = 0;
}

void resetAllLED (void)
{
    for (int i=0; i<24*noOfLEDs; i++) pwmData[i] = 1;

}

void setAllLED (void)
{
    for (int i=0; i<24*noOfLEDs; i++) pwmData[i] = 2;
}

void setLED (int LEDposition, int Red, int Green, int Blue)
{
    for (int i=7; i>=0; i--) // Set the first 8 out of 24 to green
    {
        pwmData[24*LEDposition + 7 - i] = ((Green >> i) & 1) + 1;
    }
    for (int i=7; i>=0; i--) // Set the second 8 out of 24 to red
    {
        pwmData[24*LEDposition + 15 - i] = ((Red >> i) & 1) + 1;
    }
    for (int i=7; i>=0; i--) // Set the third 8 out of 24 to blue
    {
        pwmData[24*LEDposition + 23 - i] = ((Blue >> i) & 1) + 1;
    }
}

void ws2812Send(void)
{
    HAL_TIM_PWM_Start_DMA(&htim3, TIM_CHANNEL_1, (uint32_t *)pwmData, 24*noOfLEDs);
}

//************ LED State Variable **********//
uint8_t light_state = 0;
uint8_t red = 180, green = 0, blue = 180;


//************ time Variables **********//
uint32_t previousDisplayMillis = 0;
const uint32_t displayInterval = 2000; // 2 seconds

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{

  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_DMA_Init();
  MX_I2C1_Init();
  MX_USART1_UART_Init();
  MX_USART2_UART_Init();
  MX_TIM3_Init();
  /* USER CODE BEGIN 2 */
    uint8_t rxBuffer[512] = {0};
	uint8_t ATisOK;
    int channel;
    char ATcommand[64];
	int display_count=0;


    sprintf(ATcommand,"AT+RST\r\n");
    memset(rxBuffer,0,sizeof(rxBuffer));
    HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
    HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
    HAL_Delay(500);

    ATisOK = 0;
    while(!ATisOK){
      sprintf(ATcommand,"AT+CWMODE_CUR=2\r\n");
        memset(rxBuffer,0,sizeof(rxBuffer));
        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
        HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
      if(strstr((char *)rxBuffer,"OK")){
        ATisOK = 1;
      }
      HAL_Delay(500);
    }

    ATisOK = 0;
    while(!ATisOK){
      sprintf(ATcommand,"AT+CWSAP_CUR=\"STM32\",\"12345678\",1,3,4,0\r\n");
        memset(rxBuffer,0,sizeof(rxBuffer));
        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
        HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
      if(strstr((char *)rxBuffer,"OK")){
        ATisOK = 1;
      }
      HAL_Delay(500);
    }

    ATisOK = 0;
    while(!ATisOK){
      sprintf(ATcommand,"AT+CIPAP_CUR=\"192.168.51.1\"\r\n");
      memset(rxBuffer,0,sizeof(rxBuffer));
      HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
      HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
      if(strstr((char *)rxBuffer,"OK")){
        ATisOK = 1;
      }
      HAL_Delay(500);
    }

    ATisOK = 0;
    while(!ATisOK){
      sprintf(ATcommand,"AT+CIPMUX=1\r\n");
        memset(rxBuffer,0,sizeof(rxBuffer));
        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
        HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
        if(strstr((char *)rxBuffer,"OK")){
          ATisOK = 1;
        }
        HAL_Delay(500);
    }

    ATisOK = 0;
    while(!ATisOK){
      sprintf(ATcommand,"AT+CIPSERVER=1,80\r\n");
      memset(rxBuffer,0,sizeof(rxBuffer));
      HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
      HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
      if(strstr((char *)rxBuffer,"OK")){
          ATisOK = 1;
      }
      HAL_Delay(500);
    }
  SSD1306_Init();

  SSD1306_GotoXY (0,0);
  SSD1306_Puts ("Smart", &Font_11x18, 1);
  SSD1306_GotoXY (0, 30);
  SSD1306_Puts ("Streetlight", &Font_11x18, 1);
  SSD1306_UpdateScreen();
  HAL_Delay (1000);
  SSD1306_Stopscroll();


  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {


    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
	  //sprintf(ATcommandB,"energy_usage: %u, light_status: OFF,brightness_level: %d,", (unsigned int)last.batt_perc, (int)brightness_level);
	  //sprintf(ATcommandN,"power_consumption: %f, battery_status: %f, sensor_health: Excellent,", power_consumption, battery_status);



      memset(rxBuffer,0,sizeof(rxBuffer));
      HAL_UART_Receive (&huart1, rxBuffer, 512, 1000);
      if(strstr((char *)rxBuffer,"+IPD,0")) channel = 0;
      else if(strstr((char *)rxBuffer,"+IPD,1")) channel = 1;
      else if(strstr((char *)rxBuffer,"+IPD,2")) channel = 2;
      else if(strstr((char *)rxBuffer,"+IPD,3")) channel = 3;
      else if(strstr((char *)rxBuffer,"+IPD,4")) channel = 4;
      else if(strstr((char *)rxBuffer,"+IPD,5")) channel = 5;
      else if(strstr((char *)rxBuffer,"+IPD,6")) channel = 6;
      else if(strstr((char *)rxBuffer,"+IPD,7")) channel = 7;
      else channel = 100;

      if(channel<8){

    	  char *cmdPtr = strstr((char *)rxBuffer, "CMD:");
    	            if (cmdPtr != NULL)
    	            {
    	                int l_tmp, r_tmp, g_tmp, b_tmp;
    	                // We use int for sscanf, then cast to uint8_t
    	                if (sscanf(cmdPtr, "CMD:L=%d,R=%d,G=%d,B=%d",
    	                           &l_tmp, &r_tmp, &g_tmp, &b_tmp) == 4)
    	                {
    	                    light_state = (uint8_t)l_tmp;
    	                    red   = (uint8_t)r_tmp;
    	                    green = (uint8_t)g_tmp;
    	                    blue  = (uint8_t)b_tmp;
    	                }
    	            }
    	  char httpResponse[512];

    	          // Format all data into one string (JSON-like or simple text format)
    	          // We use the actual data from your bmsData structure here.
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
    	              bmsData.voltage_battery,
    	              bmsData.current_battery,
    	              bmsData.power_battery,
    	              bmsData.voltage_generation,
    	              bmsData.power_generation,
    	              bmsData.percentage,
    	              bmsData.status,
    	              (pwmData[0] > 1) ? "ON" : "OFF", // Simple check if LEDs are active
    	              red, green, blue
    	          );
    	          // Prepare the CIPSEND command with the exact length of our new string
    	          sprintf(ATcommand, "AT+CIPSEND=%d,%d\r\n", channel, dataLen);

    	          // Send CIPSEND
    	          memset(rxBuffer, 0, sizeof(rxBuffer));
    	          HAL_UART_Transmit(&huart1, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    	          HAL_UART_Receive(&huart1, rxBuffer, 512, 100);

    	          // Wait for the module to be ready (">") then send the data
    	          if (strstr((char *)rxBuffer, ">"))
    	          {
    	              HAL_UART_Transmit(&huart1, (uint8_t *)httpResponse, dataLen, 1000);
    	              // Wait briefly for "SEND OK"
    	              HAL_UART_Receive(&huart1, rxBuffer, 512, 100);
    	          }

    	          // Close the connection
    	          sprintf(ATcommand, "AT+CIPCLOSE=%d\r\n", channel);
    	          HAL_UART_Transmit(&huart1, (uint8_t *)ATcommand, strlen(ATcommand), 1000);
    	          HAL_UART_Receive(&huart1, rxBuffer, 512, 100);

    	          channel = 100; // Reset channel
    	      }



      memset(rx2Buffer, 0, sizeof(rx2Buffer));

            if (HAL_UART_Receive(&huart2, rx2Buffer, 64, 1000) == HAL_OK)
            {
                char *v_pointer = strchr((char*)rx2Buffer, 'V');

                if (v_pointer != NULL)
                {
                    // Updated sscanf to use new variable names
                	if (sscanf(v_pointer,
                	                   "V=%hu I=%hu P=%hu A=%hu B=%hu C=%hu D=%hu E=%c",
                	                   &bmsData.voltage_battery,
                	                   &bmsData.current_battery,
                	                   &bmsData.power_battery,
                	                   &bmsData.voltage_generation,
                	                   &bmsData.current_generation,
                	                   &bmsData.power_generation,
                	                   &bmsData.percentage,
                	                   &bmsData.status) == 8)
                    {
                        rxIndex = (uint8_t)(v_pointer - (char*)rx2Buffer);
                        dataReady = 1;
                    }
                }
            }

      for (int i=0; i<noOfLEDs; i++) { setLED(i, red, green, blue); } // Blue (Dim)
      ws2812Send();

      uint32_t currentMillis = HAL_GetTick();

      if (currentMillis - previousDisplayMillis >= displayInterval)
      {
          previousDisplayMillis = currentMillis;

          display_count++;

          SSD1306_Clear();

          if(display_count == 1)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("Next Bus Time", &Font_11x18, 1);
              SSD1306_GotoXY(0, 20);
              SSD1306_Puts("R4 - 11:30", &Font_11x18, 1);
          }
          else if(display_count == 2)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("Weather", &Font_11x18, 1);
              SSD1306_GotoXY(0, 20);
              SSD1306_Puts("20% Rain", &Font_11x18, 1);
              SSD1306_GotoXY(0, 40);
              SSD1306_Puts("7 C", &Font_11x18, 1);

          }
          else if(display_count == 3)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("Current Time", &Font_11x18, 1);
              SSD1306_GotoXY(0, 20);
              SSD1306_Puts("11:29", &Font_11x18, 1);
          }
          else if(display_count == 4)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("Bus Time", &Font_11x18, 1);
              SSD1306_GotoXY(0, 20);
              SSD1306_Puts("49 - 11:47", &Font_11x18, 1);

          }
          else if(display_count == 5)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("Emergency", &Font_11x18, 1);
              SSD1306_GotoXY(0, 20);
              SSD1306_Puts("Call Campus", &Font_11x18, 1);
              SSD1306_GotoXY(0, 40);
              SSD1306_Puts("Security", &Font_11x18, 1);

          }
          else if(display_count >= 6)
          {
              SSD1306_GotoXY(0, 0);
              SSD1306_Puts("System Health", &Font_11x18, 1);

              char buf[32];
              sprintf(buf, "Charge: %u%%", bmsData.percentage);
              SSD1306_GotoXY(0, 25);
              SSD1306_Puts(buf, &Font_11x18, 1);

              display_count = 0;
          }

          SSD1306_UpdateScreen();
      }

  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_ON;
  RCC_OscInitStruct.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C1_Init(void)
{

  /* USER CODE BEGIN I2C1_Init 0 */

  /* USER CODE END I2C1_Init 0 */

  /* USER CODE BEGIN I2C1_Init 1 */

  /* USER CODE END I2C1_Init 1 */
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 400000;
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = 0;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C1_Init 2 */

  /* USER CODE END I2C1_Init 2 */

}

/**
  * @brief TIM3 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM3_Init(void)
{

  /* USER CODE BEGIN TIM3_Init 0 */

  /* USER CODE END TIM3_Init 0 */

  TIM_ClockConfigTypeDef sClockSourceConfig = {0};
  TIM_MasterConfigTypeDef sMasterConfig = {0};
  TIM_OC_InitTypeDef sConfigOC = {0};

  /* USER CODE BEGIN TIM3_Init 1 */

  /* USER CODE END TIM3_Init 1 */
  htim3.Instance = TIM3;
  htim3.Init.Prescaler = 30-1;
  htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim3.Init.Period = 3-1;
  htim3.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim3.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  if (HAL_TIM_Base_Init(&htim3) != HAL_OK)
  {
    Error_Handler();
  }
  sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_INTERNAL;
  if (HAL_TIM_ConfigClockSource(&htim3, &sClockSourceConfig) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_Init(&htim3) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim3, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 0;
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  if (HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM3_Init 2 */

  /* USER CODE END TIM3_Init 2 */
  HAL_TIM_MspPostInit(&htim3);

}

/**
  * @brief USART1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART1_UART_Init(void)
{

  /* USER CODE BEGIN USART1_Init 0 */

  /* USER CODE END USART1_Init 0 */

  /* USER CODE BEGIN USART1_Init 1 */

  /* USER CODE END USART1_Init 1 */
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART1_Init 2 */

  /* USER CODE END USART1_Init 2 */

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 115200;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * Enable DMA controller clock
  */
static void MX_DMA_Init(void)
{

  /* DMA controller clock enable */
  __HAL_RCC_DMA1_CLK_ENABLE();

  /* DMA interrupt init */
  /* DMA1_Channel6_IRQn interrupt configuration */
  HAL_NVIC_SetPriority(DMA1_Channel6_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(DMA1_Channel6_IRQn);

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
/* USER CODE BEGIN MX_GPIO_Init_1 */
/* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

/* USER CODE BEGIN MX_GPIO_Init_2 */
/* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
