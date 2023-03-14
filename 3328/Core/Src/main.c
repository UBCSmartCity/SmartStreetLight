/*
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2023 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
*/

/* Includes ------------------------------------------------------------------ */
#include "main.h"
#include "stdio.h"

#define veml3328_reg_deviceID					0x0C
#define veml3328_addr									0x10
#define veml3328__conf								0x00
#define C_ 														0x04
#define R_ 														0x05
#define G_														0x06
#define B_														0x07
#define IR_	 													0x08

#define True	1
#define False 0 

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_I2C1_Init(void);
HAL_StatusTypeDef veml3328_wr(uint8_t registerAddress, uint16_t value);
HAL_StatusTypeDef veml3328_rd(uint8_t registerAddress, uint16_t* value);
HAL_StatusTypeDef veml3328_init(void);
int hextodec(uint16_t hex[16]);

I2C_HandleTypeDef hi2c1;
HAL_StatusTypeDef r,g,b;
uint8_t deviceId;
uint16_t conf, r_data, g_data, b_data;
double r_lux;

/**
  * @brief  The application entry point.
  * @retval int
  */

HAL_StatusTypeDef veml3328_wr(uint8_t registerAddress, uint16_t value) {
	HAL_StatusTypeDef status;

	status = HAL_I2C_Mem_Write(&hi2c1, veml3328_addr<< 1, registerAddress, sizeof(registerAddress), (uint8_t*)&value, sizeof(value), 100);
	if (status) {
		return status;
	}
	return status;
}

HAL_StatusTypeDef veml3328_rd(uint8_t registerAddress, uint16_t* value) {
	HAL_StatusTypeDef status;

	status = HAL_I2C_Mem_Read(&hi2c1, veml3328_addr << 1, registerAddress, sizeof(registerAddress), (uint8_t*)value, sizeof(*value), 100);
	if (status) {
		return status;
	}

	return status;
}

HAL_StatusTypeDef veml3328_init(void) {
	
	HAL_StatusTypeDef stat0, stat1, stat2, deviceId;
	uint16_t regVal;

	// Check i2c1 port 
	stat0 = HAL_I2C_Init(&hi2c1);
	if (stat0 != HAL_OK){return False;} 
	 
	// Check register device ID (should be 0x28)
	stat1 = veml3328_rd(veml3328_reg_deviceID, &regVal);
	deviceId = (uint8_t)(regVal & 0xFF);
	if (deviceId != 0x28) {return False;}
	
	return True;
	
}

/* Convert sensor reading value to LUX*/
int convert(int value) {
	/*pre set number. Get this from datasheet*/
	double x = 0.384;
	double lux;
	
	lux = value * x;
	return lux;
}


int main(void)
{

	/*STM32 Init*/
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_I2C1_Init();
	
	/*Sensor Init*/
	while (veml3328_init() == False) {
		return False;
	}
	
	/*configure sensor*/
	veml3328_wr(veml3328__conf, 1000);
	veml3328_rd(veml3328__conf, &conf);
	
	/*read from sensor*/
	while(1){
		HAL_Delay(150);
		r = veml3328_rd(R_, &r_data);
		g = veml3328_rd(G_, &g_data);
		b = veml3328_rd(B_, &b_data);
		
		r_lux = convert(r_data);
	}
}






/********************************************************************************************************/

/**
  * @brief System Clock Configuration
  * @retval None
**/

void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);

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
  hi2c1.Init.ClockSpeed = 100000;
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
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOB_CLK_ENABLE();

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
