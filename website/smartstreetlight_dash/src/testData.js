export let testData = [
  // 1 year ago (Feb 10, 2024)
  {
    date: new Date("2024-02-10T10:10:10"),
    energyUsage: 190, // not in range, will not appear
    lightStatus: "OFF",
    brightnessLevel: 65,
    powerConsumption: 45,
    batteryStatus: 75,
    sensorHealth: "Warning",
    location: "Langara 49th Station",
  },

  // Year-to-date (YTD) example (first day of the year, Wednesday, Jan 1, 2025)
  {
    date: new Date("2025-01-01T08:45:00"),
    energyUsage: 275,
    lightStatus: "ON",
    brightnessLevel: 85,
    powerConsumption: 70,
    batteryStatus: 95,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },

  // 1 month ago (Wednesday, Jan 8, 2025)
  {
    date: new Date("2025-01-08T15:22:45"),
    energyUsage: 300,
    lightStatus: "OFF",
    brightnessLevel: 50,
    powerConsumption: 65,
    batteryStatus: 85,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },

  // 1 day ago (Friday, Feb 7, 2025)
  {
    date: new Date("2025-02-07T12:30:15"),
    energyUsage: 180, // not in range, will not appear
    lightStatus: "ON",
    brightnessLevel: 75,
    powerConsumption: 55,
    batteryStatus: 88,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },

  {
    date: new Date("2025-02-08T09:03:37"),
    energyUsage: 200, // on lower boundary, will appear
    lightStatus: "ON",
    brightnessLevel: 80,
    powerConsumption: 50,
    batteryStatus: 90,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },

  // today
  {
    date: new Date("2025-02-11T11:15:01"),
    energyUsage: 350,
    lightStatus: "OFF",
    brightnessLevel: 60,
    powerConsumption: 75,
    batteryStatus: 80,
    sensorHealth: "Warning",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T17:48:31"),
    energyUsage: 225,
    lightStatus: "ON",
    brightnessLevel: 70,
    powerConsumption: 60,
    batteryStatus: 70,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T17:49:31"),
    energyUsage: 235,
    lightStatus: "ON",
    brightnessLevel: 70,
    powerConsumption: 60,
    batteryStatus: 70,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T18:48:31"),
    energyUsage: 400, // on upper boundary, will appear
    lightStatus: "ON",
    brightnessLevel: 70,
    powerConsumption: 60,
    batteryStatus: 70,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T19:48:31"),
    energyUsage: 300,
    lightStatus: "ON",
    brightnessLevel: 70,
    powerConsumption: 60,
    batteryStatus: 70,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },

  // Adding extra data points to meet the "7" requirement
  {
    date: new Date("2025-02-11T20:20:10"),
    energyUsage: 220,
    lightStatus: "ON",
    brightnessLevel: 65,
    powerConsumption: 55,
    batteryStatus: 60,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T21:10:10"),
    energyUsage: 250,
    lightStatus: "ON",
    brightnessLevel: 72,
    powerConsumption: 55,
    batteryStatus: 80,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T22:12:45"),
    energyUsage: 280,
    lightStatus: "ON",
    brightnessLevel: 60,
    powerConsumption: 65,
    batteryStatus: 90,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
  {
    date: new Date("2025-02-11T23:12:45"),
    energyUsage: 280,
    lightStatus: "ON",
    brightnessLevel: 60,
    powerConsumption: 65,
    batteryStatus: 90,
    sensorHealth: "Good",
    location: "Langara 49th Station",
  },
];
