export let testData = [
  // Maximum historical data (oldest recorded data, Feb 8, 2023)
  { 
    date: new Date('2023-02-08T07:30:30'), 
    energyUsage: 150,
    lightStatus: 'ON',
    brightnessLevel: 40,
    powerConsumption: 35,
    batteryStatus: 60,
    sensorHealth: 'Critical',
    location: 'Langara 49th Station'
  },

  // 1 year ago (Feb 10, 2024)
  { 
    date: new Date('2024-02-10T10:10:10'), 
    energyUsage: 190,
    lightStatus: 'OFF',
    brightnessLevel: 65,
    powerConsumption: 45,
    batteryStatus: 75,
    sensorHealth: 'Warning',
    location: 'Langara 49th Station'
  },

  // Year-to-date (YTD) example (first day of the year, Wednesday, Jan 1, 2025)
  { 
    date: new Date('2025-01-01T08:45:00'), 
    energyUsage: 275,
    lightStatus: 'ON',
    brightnessLevel: 85,
    powerConsumption: 70,
    batteryStatus: 95,
    sensorHealth: 'Good',
    location: 'Langara 49th Station'
  },

  // 1 month ago (Wednesday, Jan 8, 2025)
  { 
    date: new Date('2025-01-08T15:22:45'), 
    energyUsage: 300,
    lightStatus: 'OFF',
    brightnessLevel: 50,
    powerConsumption: 65,
    batteryStatus: 85,
    sensorHealth: 'Good',
    location: 'Langara 49th Station'
  },

  // 1 day ago (Friday, Feb 7, 2025)
  { 
    date: new Date('2025-02-07T12:30:15'), 
    energyUsage: 180,
    lightStatus: 'ON',
    brightnessLevel: 75,  
    powerConsumption: 55, 
    batteryStatus: 88,
    sensorHealth: 'Good',
    location: 'Langara 49th Station'
  },

  // Today (Saturday, Feb 8, 2025)
  { 
    date: new Date('2025-02-07T09:03:37'), 
    energyUsage: 200,
    lightStatus: 'ON',
    brightnessLevel: 80,  
    powerConsumption: 50, 
    batteryStatus: 90,
    sensorHealth: 'Good',
    location: 'Langara 49th Station'
  },
  { 
    date: new Date('2025-02-07T11:15:01'), 
    energyUsage: 350,
    lightStatus: 'OFF',
    brightnessLevel: 60,
    powerConsumption: 75,
    batteryStatus: 80,
    sensorHealth: 'Warning',
    location: 'Langara 49th Station'
  },
  { 
    date: new Date('2025-02-08T17:48:31'), 
    energyUsage: 225,
    lightStatus: 'ON',
    brightnessLevel: 70,
    powerConsumption: 60,
    batteryStatus: 70,
    sensorHealth: 'Good',
    location: 'Langara 49th Station'
  }
];
