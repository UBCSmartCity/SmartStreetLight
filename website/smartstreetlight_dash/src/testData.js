export let testData = [
  // 1 year ago (Feb 13, 2024)
  { date: new Date("2024-02-13T01:10:10"), energyUsage: 150, lightStatus: "OFF", brightnessLevel: 60, powerConsumption: 40, batteryStatus: 85, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T03:20:10"), energyUsage: 300, lightStatus: "ON", brightnessLevel: 80, powerConsumption: 100, batteryStatus: 75, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T05:40:10"), energyUsage: 250, lightStatus: "ON", brightnessLevel: 75, powerConsumption: 80, batteryStatus: 65, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T07:15:10"), energyUsage: 200, lightStatus: "OFF", brightnessLevel: 70, powerConsumption: 60, batteryStatus: 70, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T09:25:10"), energyUsage: 175, lightStatus: "ON", brightnessLevel: 85, powerConsumption: 50, batteryStatus: 80, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T11:10:10"), energyUsage: 125, lightStatus: "OFF", brightnessLevel: 60, powerConsumption: 35, batteryStatus: 90, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T13:10:10"), energyUsage: 280, lightStatus: "ON", brightnessLevel: 90, powerConsumption: 75, batteryStatus: 85, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T15:50:10"), energyUsage: 320, lightStatus: "ON", brightnessLevel: 95, powerConsumption: 95, batteryStatus: 70, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T18:10:10"), energyUsage: 375, lightStatus: "ON", brightnessLevel: 85, powerConsumption: 110, batteryStatus: 60, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2024-02-13T20:30:10"), energyUsage: 400, lightStatus: "ON", brightnessLevel: 100, powerConsumption: 120, batteryStatus: 50, sensorHealth: "Good", location: "Langara 49th Station" },

  // Year-to-date (Jan 1, 2025 - Feb 13, 2025)
  { date: new Date("2025-01-01T01:30:10"), energyUsage: 180, lightStatus: "ON", brightnessLevel: 70, powerConsumption: 50, batteryStatus: 90, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-01-07T02:10:10"), energyUsage: 220, lightStatus: "ON", brightnessLevel: 85, powerConsumption: 55, batteryStatus: 80, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-01-15T12:45:10"), energyUsage: 300, lightStatus: "OFF", brightnessLevel: 90, powerConsumption: 75, batteryStatus: 75, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2025-01-21T13:55:10"), energyUsage: 250, lightStatus: "ON", brightnessLevel: 70, powerConsumption: 80, batteryStatus: 65, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-01-28T14:20:10"), energyUsage: 280, lightStatus: "ON", brightnessLevel: 80, powerConsumption: 60, batteryStatus: 85, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-01T06:30:10"), energyUsage: 340, lightStatus: "OFF", brightnessLevel: 60, powerConsumption: 90, batteryStatus: 55, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2025-02-05T09:40:10"), energyUsage: 190, lightStatus: "ON", brightnessLevel: 75, powerConsumption: 50, batteryStatus: 95, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-08T11:50:10"), energyUsage: 350, lightStatus: "ON", brightnessLevel: 80, powerConsumption: 70, batteryStatus: 70, sensorHealth: "Warning", location: "Langara 49th Station" },

  // Today (Feb 13, 2025)
  { date: new Date("2025-02-15T01:10:10"), energyUsage: 175, lightStatus: "OFF", brightnessLevel: 65, powerConsumption: 45, batteryStatus: 85, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T03:30:10"), energyUsage: 225, lightStatus: "ON", brightnessLevel: 75, powerConsumption: 60, batteryStatus: 80, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T05:50:10"), energyUsage: 310, lightStatus: "ON", brightnessLevel: 85, powerConsumption: 90, batteryStatus: 70, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T08:10:10"), energyUsage: 200, lightStatus: "OFF", brightnessLevel: 65, powerConsumption: 70, batteryStatus: 85, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T10:20:10"), energyUsage: 280, lightStatus: "ON", brightnessLevel: 90, powerConsumption: 75, batteryStatus: 65, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T12:30:10"), energyUsage: 320, lightStatus: "ON", brightnessLevel: 85, powerConsumption: 85, batteryStatus: 70, sensorHealth: "Warning", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T15:00:10"), energyUsage: 190, lightStatus: "ON", brightnessLevel: 70, powerConsumption: 55, batteryStatus: 75, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T17:30:10"), energyUsage: 250, lightStatus: "ON", brightnessLevel: 80, powerConsumption: 65, batteryStatus: 60, sensorHealth: "Good", location: "Langara 49th Station" },
  { date: new Date("2025-02-15T19:10:10"), energyUsage: 275, lightStatus: "ON", brightnessLevel: 90, powerConsumption: 80, batteryStatus: 50, sensorHealth: "Good", location: "Langara 49th Station" },
]


