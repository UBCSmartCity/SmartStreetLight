#include <stdint.h>
// added vars and functions for soc
static float soc = 0.50;  // the current state of charge
static float rest_timer_s = 0.0; //how long the system has been at rest(near zero current)
static uint32_t last_soc_ms = 0; //the last time updated SoC

static const float Q_Ah = 7.0;      // battery capacity in amphrs (adjust this?)
static const float REST_TIME_S = 300.0; // how long current is zero before use voltage method
static const float ALPHA = 0.01; // slow adjust factor
static const float I_REST_A = 0.14; // if current below this, start counting rest time

// OCV table (sealed lead acid)
static const float ocv_V[] = {12.89,12.78,12.65,12.51,12.41,12.23,12.11,11.96,11.81,11.70,11.63};
static const float ocv_soc[] = {1.00,0.90,0.80,0.70,0.60,0.50,0.40,0.30,0.20,0.10,0.00};
static const uint32_t OCV_N = sizeof(ocv_V)/sizeof(ocv_V[0]); //no. of points in table

// prevents soc from becoming negative or bigger than 100%
static float clamp01(float x)
{
    if (x < 0.0) return 0.0;
    if (x > 1.0) return 1.0;
    return x;
}

// lookup table
static float ocv_lookup_soc(float V)
{
	// clamp above highest voltage and below lowest voltage
	// prevent garbage values that are outside the lookup table
    if (V >= ocv_V[0]) return ocv_soc[0];
    if (V <= ocv_V[OCV_N-1]) return ocv_soc[OCV_N-1];

    // actual lookup
    for (uint32_t i = 0; i < OCV_N-1; i++)
    {
        float V1 = ocv_V[i];
        float V2 = ocv_V[i+1];

        if (V <= V1 && V >= V2)
        {
            float s1 = ocv_soc[i];
            float s2 = ocv_soc[i+1];

            // how far v is between v1 and v2
            float t = (V - V2) / (V1 - V2);

            // interpolate, moves s2 towards s1 by fraction t
            return s2 + (s1 - s2) * t;
        }
    }
}

// main soc update: couloumb counting and table correction
static void soc_update(float V_batt_V, float I_A, float dt_s)
{
    // Coulomb counting using formula
    soc += (I_A * (dt_s / 3600.0)) / Q_Ah;
    soc = clamp01(soc);

    // Rest detection
    if (fabs(I_A) < I_REST_A)
        rest_timer_s += dt_s;
    else
        rest_timer_s = 0.0;

    // OCV correction
    if (rest_timer_s >= REST_TIME_S)
    {
        float soc_ocv = ocv_lookup_soc(V_batt_V);
        soc += ALPHA * (soc_ocv - soc);
        soc = clamp01(soc);
    }
}

// put this code in main
// uint32_t now = HAL_GetTick(); //current time in millisecs since mcu booted
// float dt_s = (now - last_soc_ms) / 1000.0; //time elapsed since previous soc update
// last_soc_ms = now;

// float V = bmsData.voltage_battery / 1000.0; //millivolts to volts
// float I = bmsData.current_battery / 1000.0;

// soc_update(V, I, dt_s);
// bmsData.percentage = (uint16_t)(soc * 100.0);