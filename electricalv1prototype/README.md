# Electrical Prototype V1

Comprehensive system documentation for the **Electrical Prototype V1**, an intelligent transit/shelter monitoring and control system. The prototype integrates two **STM32F103C8T6** microcontrollers (Main MCU and BMS MCU) communicating via UART, connected through Wi-Fi (ESP module) to **ThingSpeak IoT**, and managed via a desktop **Python GUI Dashboard**.

---

## 1. Overall System Capabilities

The Electrical Prototype V1 is an integrated smart infrastructure testbed designed for automated transit shelters and off-grid renewable energy installations:

* **Real-Time Battery Management & Monitoring (BMS)**: Measures battery voltage, charging/discharging current, and instantaneous power via an INA260 sensor with sub-second response times, automatically reporting battery state of charge (SOC) and operational status.
* **Smart Motion-Activated Lighting**: Features an occupancy/radar sensor on hardware interrupt (EXTI) that triggers high-efficiency, WS2812 addressable LED illumination when people approach, saving power when the space is unoccupied.
* **Remote IoT Telemetry & Manual Override**: Bi-directional communication via ThingSpeak lets operators remotely control 24-bit RGB ambient lighting themes, switch operational modes, and stream operational metrics to the cloud.
* **Dynamic Transit Schedule Aggregation**: Web-scrapes real-time estimated bus arrival times for UBC and Vancouver transit corridors, serializes the top arrivals, and broadcasts them down to the physical shelter OLED display over Wi-Fi.
* **Desktop Control, Analytics & Long-Term Logging**: Host-side Python interface offers real-time visualization, customizable historical plotting (from 10-minute zooms to 1-year overviews), automatic data bucketing/downsampling, and continuous CSV data logging.

---

## 2. Repository Structure

Based on the repository layout, the project is organized into four main operational directories:

```
Electrical_Prototype_V1/
├── BMS_MCU_Electrical_Prototype_V1/   # STM32CubeIDE project for the BMS MCU
├── Main_MCU_Electrical_Prototype_V1/  # STM32CubeIDE project for the Main MCU
├── Dashboard/                         # Python dashboard source scripts & assets
├── demo/                              # Pre-built release binaries (.hex) and demo runtime scripts
└── README.md                          # System documentation
```

### Folder Breakdown

1. **`BMS_MCU_Electrical_Prototype_V1/`**:
   * Complete STM32CubeIDE firmware project for the **BMS MCU** (`STM32F103C8T6`).
   * Contains hardware drivers for the Texas Instruments INA260 sensor (I2C2), telemetry packet generation (`comm.c`/`comm.h`), ADC setup, and UART transmission logic.

2. **`Main_MCU_Electrical_Prototype_V1/`**:
   * Complete STM32CubeIDE firmware project for the **Main MCU** (`STM32F103C8T6`).
   * Contains the timing and communication stack: ESP Wi-Fi AT-driver (`wifi.h`), OLED rendering routines (`oled_display.h`), WS2812 DMA/PWM control via TIM3 (`led_light.h`), and radar sensor EXTI handlers.

3. **`Dashboard/`**:
   * Python desktop application source code (`Dashboard_Demo.py`).
   * Hosts the live transit web-scraper, Tkinter GUI widgets, ThingSpeak HTTP read/write handlers, and Matplotlib graphing tools.

4. **`demo/`**:
   * Ready-to-deploy evaluation package.
   * Houses the compiled `.hex` binary firmware files for both the BMS MCU and Main MCU for direct flashing via ST-Link without needing to rebuild in STM32CubeIDE.
   * Includes the standalone Python dashboard script (`.py`) for rapid plug-and-play field demonstration.

---

## 3. System Architecture Overview

```
+-------------------------------------------------------------+
|                        BMS MCU                              |
|                    (STM32F103C8T6)                          |
|                                                             |
|  [ INA260 Sensor ] --(I2C2: PB10/PB11)                      |
|  - Voltage (mV)                                             |
|  - Current (+/- mA)                                         |
|  - Power (mW)                                               |
+------------------------------+------------------------------+
                               |
                               | UART1 (115200 baud)
                               v
+-------------------------------------------------------------+
|                        MAIN MCU                             |
|                    (STM32F103C8T6)                          |
|                                                             |
|  - UART2: Receives BMS telemetry packet                     |
|  - PB1 EXTI: Radar / PIR sensor interrupt                   |
|  - TIM3 CH1 + DMA: WS2812 addressable RGB lighting          |
|  - I2C1: OLED status display (BMS & Transit info)           |
|  - UART1: ESP-based Wi-Fi module (AT commands)              |
+------------------------------+------------------------------+
                               |
                               | Wi-Fi (HTTP GET / REST API)
                               v
+-------------------------------------------------------------+
|                     THINGSPEAK CLOUD                        |
|                                                             |
|  Channel Write (BMS Telemetry from Main MCU)                |
|  Channel Read/Write (LED RGB, Mode, Live Bus JSON)          |
+------------------------------+------------------------------+
                               ^
                               | HTTP GET/POST via urllib
+------------------------------+------------------------------+
|                    PYTHON DASHBOARD                         |
|                   (Windows Host GUI)                        |
|                                                             |
|  - TransitDB NextBus Scraper (Vancouver/UBC routes)         |
|  - RGB Lighting & Mode Control                              |
|  - Live BMS Telemetry & CSV Historical Logging              |
|  - Matplotlib Trend Analysis & Bucketing Engine             |
+-------------------------------------------------------------+
```

---

## 4. Hardware & MCU Details

Both microcontrollers run on the **ARM Cortex-M3 STM32F103C8T6** ("Blue Pill"):

### A. BMS MCU (`BMS_MCU_Electrical_Prototype_V1`)

* **Clock Configuration**: Internal High-Speed Oscillator (HSI, 8 MHz default), PLL disabled.
* **Peripherals**:
  * **I2C2 (PB10/PB11 @ 100 kHz standard mode)**: Interfaces with the **Texas Instruments INA260** precision current and power monitor (I2C address `0x40`).
  * **USART1 (115200 baud, 8N1)**: Serial transmission port sending formatted `BMS_Data_t` packets to the Main MCU.
  * **ADC1**: Configured on Channel 0 for auxiliary analog measurements.
* **Measurement Logic**:
  * Voltage scale: $1.25\text{ mV/bit}$
  * Current scale: $1.25\text{ mA/bit}$ (signed; negative indicates charging, positive indicates discharging)
  * Power scale: $10\text{ mW/bit}$
  * Fault Recovery: Automatic bus de-initialization and re-initialization if I2C bus hang is detected.

### B. Main MCU (`Main_MCU_Electrical_Prototype_V1`)

* **Clock Configuration**: 8 MHz HSE crystal boosted to 72 MHz system clock via PLL ($\times 9$).
* **Peripherals**:
  * **USART1 (115200 baud)**: AT-command Wi-Fi transceiver interface (ESP8266/ESP32 station mode).
  * **USART2 (115200 baud)**: Ingests telemetry frames from the BMS MCU via `BMS_ProcessData()`.
  * **I2C1 (PB6/PB7 @ 400 kHz fast mode)**: Drives the SSD1306/SH1106 OLED display for real-time status and transit arrival schedules.
  * **TIM3 CH1 + DMA1 Channel 6**: High-speed PWM bit-banging pipeline for WS2812/NeoPixel RGB LED strips.
  * **GPIO PB1 (EXTI1 interrupt, pull-down)**: Edge-triggered radar/occupancy sensor pin (`HAL_GPIO_EXTI_Callback`).
* **Control Modes**:
  * **Mode 1 (Manual/Cloud Override)**: RGB LEDs output static user-selected color from ThingSpeak fields.
  * **Mode 2 (Smart Radar Sensing)**: LEDs remain off until motion is detected on PB1, upon which they trigger full-brightness white illumination (`RGB: 255, 255, 255`), reverting to `0, 0, 0` when clear.

---

## 5. Python Dashboard (`Dashboard/Dashboard_Demo.py`)

A Windows-hosted Tkinter application providing real-time bidirectional control, web scraping, and telemetry logging.

### Key Features

1. **Transit Scraper**:
   * Scrapes live estimated arrival times from `transitdb.ca` for Vancouver/UBC transit stops:
     * R4, 4, 9, 14, 25, 33, 44, 49, 68, 84, 99.
   * Ranks schedules, extracts the top 3 upcoming arrivals, formats them into a compact JSON payload, and pushes them to ThingSpeak Field 5.
2. **Lighting Control Interface**:
   * Master power switch (Toggle Mode 1 vs. Mode 2).
   * 8-bit RGB color sliders (0–255 per channel).
3. **Telemetry & Logging**:
   * Polls ThingSpeak every 30 seconds for battery voltage, current, power, auxiliary generator stats, and battery State of Charge (SOC).
   * Automatically persists measurements to `battery_data_log.csv` with standardized timestamps.
4. **Interactive Matplotlib Visualizer**:
   * Graph window selector: 10 Minutes, 1 Hour, 6 Hours, 1 Day, 1 Week, 1 Month, 1 Year.
   * Dynamic data bucketing to preserve rendering performance over extended run times.

---

## 6. ThingSpeak Channel & Field Mapping

| Field | Channel Parameter | Data Direction | Description |
| :--- | :--- | :--- | :--- |
| **Field 1** | System Mode | Dashboard $\rightarrow$ Main MCU | `1` = Manual RGB, `2` = Smart Radar trigger |
| **Field 2** | Red Channel | Dashboard $\rightarrow$ Main MCU | Red PWM intensity ($0 - 255$) |
| **Field 3** | Green Channel | Dashboard $\rightarrow$ Main MCU | Green PWM intensity ($0 - 255$) |
| **Field 4** | Blue Channel | Dashboard $\rightarrow$ Main MCU | Blue PWM intensity ($0 - 255$) |
| **Field 5** | Bus JSON Payload | Dashboard $\rightarrow$ Main MCU | URL-encoded transit schedule array |
| **Field 1 (Read)** | Battery Voltage | Main MCU $\rightarrow$ Dashboard | Logged battery voltage ($V \times 10$) |
| **Field 2 (Read)** | Battery SOC | Main MCU $\rightarrow$ Dashboard | Battery State of Charge ($0 - 100\%$) |
| **Field 3 (Read)** | Battery Current | Main MCU $\rightarrow$ Dashboard | Current draw ($A \times 10$) |
| **Field 4 (Read)** | Auxiliary/Wind Voltage | Main MCU $\rightarrow$ Dashboard | Generation bus voltage |
| **Field 5 (Read)** | Auxiliary/Wind Current | Main MCU $\rightarrow$ Dashboard | Generation bus current |
| **Field 7 (Read)** | BMS Status Flag | Main MCU $\rightarrow$ Dashboard | `'C'` = Charging, `'D'` = Discharging |

> [!WARNING]
> **API Key Notice**: The ThingSpeak channels and associated Read/Write API keys configured in the code belong to **Pratik's MATLAB/ThingSpeak account**. Please use these credentials responsibly to avoid tripping account rate limits. These keys may become private, reset, or unavailable in future revisions; ensure you replace them with your own project channel keys when deploying a private setup.

---

## 7. Software Requirements & Setup

### Embedded Firmware
* **IDE / Toolchain**: STM32CubeIDE (or Keil MDK / Make + arm-none-eabi-gcc).
* **HAL Library**: STM32F1xx HAL drivers.
* **Firmware Flashing**: ST-Link V2 over SWD (Pins: `SWDIO`, `SWCLK`, `GND`, `3V3`). Pre-compiled `.hex` files are located in the `demo/` folder for direct flashing.

### Python Host Environment
* Python 3.8+ (Windows 10/11 tested)
* Required dependencies:
  ```bash
  pip install matplotlib
  ```
  *(Standard libraries `tkinter`, `urllib`, `json`, `csv`, and `datetime` are bundled with standard Python installations).*

### Running the Dashboard
```bash
python Dashboard/Dashboard_Demo.py
# or run directly from the demo/ folder
python demo/Dashboard_Demo.py
```

---

## 8. Wiring & Pinout Reference

| MCU Pin | Signal / Function | Connected Peripheral |
| :--- | :--- | :--- |
| **BMS MCU** | | |
| `PB10` | I2C2_SCL | INA260 SCL (Pull-up required) |
| `PB11` | I2C2_SDA | INA260 SDA (Pull-up required) |
| `PA9` | USART1_TX | Main MCU PA3 (USART2_RX) |
| `PA10` | USART1_RX | Debug / Telemetry Header |
| **Main MCU** | | |
| `PA2` | USART2_TX | Debug / Handshake |
| `PA3` | USART2_RX | BMS MCU PA9 (USART1_TX) |
| `PA9` | USART1_TX | ESP Wi-Fi RX |
| `PA10` | USART1_RX | ESP Wi-Fi TX |
| `PB1` | EXTI_1 | Radar / Motion Sensor Digital Output |
| `PA6` | TIM3_CH1 | WS2812 Data Pin (via Level Shifter / Resistor) |
| `PB6` | I2C1_SCL | OLED Display SCL |
| `PB7` | I2C1_SDA | OLED Display SDA |
