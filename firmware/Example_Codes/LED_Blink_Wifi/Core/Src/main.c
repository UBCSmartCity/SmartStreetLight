/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2025 STMicroelectronics.
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
#include "string.h"
#include "stdio.h"
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
TIM_HandleTypeDef htim3;
DMA_HandleTypeDef hdma_tim3_ch1_trig;

UART_HandleTypeDef huart1;

/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_DMA_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_TIM3_Init(void);
/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */
#define noOfLEDs 16
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
  MX_USART1_UART_Init();
  MX_TIM3_Init();
  /* USER CODE BEGIN 2 */
   uint8_t rxBuffer[512] = {0};
   uint8_t ATisOK;
   int channel;
   int onoff;
   int led = 0;
   int n=50*24; //no. of leds
   char ATcommand[64];
   char ATcommandB[1024];
   char ATcommandN[100];
   char ATcommandF[100];
   char ATcommandT[16];

   /*sprintf(ATcommandB,"<!DOCTYPE html><html>\n<head>\n\
   <title>STM32 - ESP8266</title>\n<link href=\"data:image/x-icon;base64,\
   A\" rel=\"icon\" type=\"image/x-icon\"><style>\nhtml {\
   display: inline-block; margin: 0px auto; text-align: center;}\n\
   body{margin-top: 50px;}\n.button {display: block;\n\
   width: 70px;\nbackground-color: #008000;\nborder: none;\ncolor: white;\n\
   padding: 14px 28px;\ntext-decoration: none;\nfont-size: 24px;\n\
   margin: 0px auto 36px; \nborder-radius: 5px;}\n\
   .button-on {background-color: #008000;}\n.button-on:active\
   {background-color: #008000;}\n.button-off {background-color: #808080;}\n\
   .button-off:active {background-color: #808080;}\n\
   p {font-size: 14px;color: #808080;margin-bottom: 20px;}\n\
   </style>\n</head>\n<body>\n<h1>STM32 - ESP8266</h1>\n<p>Value of k: %d</p>", led);
   sprintf(ATcommandN,"<p>Light is currently on\
   </p><a class=\"button button-off\" href=\"/lightoff\">OFF</a>");
   sprintf(ATcommandF,"<p>Light is currently off\
   </p><a class=\"button button-on\" href=\"/lighton\">ON</a>");
   sprintf(ATcommandT,"</body></html>");*/


   sprintf(ATcommandB,"11");
   sprintf(ATcommandN,"22");
   sprintf(ATcommandF,"33");
   sprintf(ATcommandT,"123");


   int countB = strlen(ATcommandB);
   int countN = strlen(ATcommandN);
   int countF = strlen(ATcommandF);
   int countT = strlen(ATcommandT);

   sprintf(ATcommand,"AT+RST\r\n");
   memset(rxBuffer,0,sizeof(rxBuffer));
   HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
   HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
   HAL_Delay(500);

   ATisOK = 0;

   /*while(!ATisOK){
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
   }*/

   ATisOK = 0;
   while(!ATisOK){
     sprintf(ATcommand,"AT+CWJAP=\"Testing\",\"12346789\"\r\n");
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
  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */

  while (1)
  {
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

	      if(strstr((char *)rxBuffer,"GET /lighton")) onoff = 0;
	      else if(strstr((char *)rxBuffer,"GET /lightoff")) onoff = 1;
	      else onoff = led;

	      if(channel<8 && onoff == 1)
	      {
	        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
	        led = 1;

	        /*uint16_t pwmData[n]; //16*24=384 (No of LEDs 64 and 24 Pulses for each LED)
	        for (int i=0; i<1536; i++) pwmData[i] = 2;
	        HAL_TIM_PWM_Start_DMA(&htim3, TIM_CHANNEL_1, (uint32_t *)pwmData, n);
	        HAL_Delay (10);
	        HAL_TIM_PWM_Stop_DMA(&htim3, TIM_CHANNEL_1);
	        HAL_Delay (200);*/


	       /* ws2812Send();
	         setLED(0, 255, 0, 0);     // Red
	         ws2812Send();
	         HAL_Delay (500);
	         setLED(1, 0, 255, 0);     // Green
	         ws2812Send();
	         HAL_Delay (500);
	         setLED(2, 0, 0, 255);     // Blue
	         ws2812Send();
	         HAL_Delay (500);
	         setLED(3, 255, 255, 0);   // Yellow
	         ws2812Send();
	         HAL_Delay (500);
	         setLED(4, 0, 255, 255);   // Magenta
	         ws2812Send();
	         HAL_Delay (500);
	         setLED(5, 255, 0, 255);   // Cyan
	         ws2812Send();
	         HAL_Delay (500);
	         resetAllLED();
	         ws2812Send();
	         setLED(6, 255, 255, 255); // Specific color
	         ws2812Send();
	         */

	        sprintf(ATcommand,"AT+CIPSEND=%d,%d\r\n",channel,countB+countF+countT);
	        memset(rxBuffer,0,sizeof(rxBuffer));
	        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
	        HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        if(strstr((char *)rxBuffer,">"))
	        {
	          memset(rxBuffer,0,sizeof(rxBuffer));
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandB,countB,1000);
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandF,countF,1000);
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandT,countT,1000);
	           HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        }
	        sprintf(ATcommand,"AT+CIPCLOSE=%d\r\n",channel);
	        memset(rxBuffer,0,sizeof(rxBuffer));
	        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
	        HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        channel=100;
	      }
	      else if(channel<8 && onoff == 0)
	      {
	        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
	        led = 0;
	        /*for (int i=0; i<n; i++) pwmData[i] = 1;
	        HAL_TIM_PWM_Start_DMA(&htim3, TIM_CHANNEL_1, (uint32_t *)pwmData, n);
	        HAL_Delay (10);
	        HAL_TIM_PWM_Stop_DMA(&htim3, TIM_CHANNEL_1);
	        HAL_Delay (500);*/



	        sprintf(ATcommand,"AT+CIPSEND=%d,%d\r\n",channel,countB+countN+countT);
	        memset(rxBuffer,0,sizeof(rxBuffer));
	        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
	        HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        if(strstr((char *)rxBuffer,">"))
	        {
	          memset(rxBuffer,0,sizeof(rxBuffer));
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandB,countB,1000);
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandN,countN,1000);
	            HAL_UART_Transmit(&huart1,(uint8_t *)ATcommandT,countT,1000);
	            HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        }
	        sprintf(ATcommand,"AT+CIPCLOSE=%d\r\n",channel);
	        memset(rxBuffer,0,sizeof(rxBuffer));
	        HAL_UART_Transmit(&huart1,(uint8_t *)ATcommand,strlen(ATcommand),1000);
	        HAL_UART_Receive (&huart1, rxBuffer, 512, 100);
	        channel=100;
	      }
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
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
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_NONE;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_HSI;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_0) != HAL_OK)
  {
    Error_Handler();
  }
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
  GPIO_InitTypeDef GPIO_InitStruct = {0};
/* USER CODE BEGIN MX_GPIO_Init_1 */
/* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);

  /*Configure GPIO pin : PC13 */
  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

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
