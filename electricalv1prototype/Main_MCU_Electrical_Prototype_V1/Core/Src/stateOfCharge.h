#ifndef SOC_H
#define SOC_H

void soc_update(float V_batt_V, float I_A, float dt_s);
float soc_get(void);

#endif
