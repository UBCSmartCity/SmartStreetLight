import time, random, requests

# url = "http://127.0.0.1:8000"
url = "http://raspberrypi.local:8000"

# initial random state
light_mode = 0
red = random.randint(0, 255)
green = random.randint(0, 255)
blue = random.randint(0, 255)
current_color = {"r": red, "g": green, "b": blue}
light_id = 1
while True:
    battery_voltage = random.randint(36, 42)
    battery_level_pct = random.randint(20, 100)
    battery_current = random.randint(15, 24)
    generator_voltage = random.randint(43, 50)
    generator_current = random.randint(25, 34)
    # pretend there is a motion sensor
    motion_detected = random.randint(0,1) # 0: no motion; 1: motion

    my_dict = {
        "light_id": light_id,
        "battery_voltage_x10": battery_voltage,
        "battery_level_pct": battery_level_pct,
        "battery_current_x10": battery_current,
        "generator_voltage_x10": generator_voltage,
        "generator_current_x10": generator_current,
        "temperature_c": 25,
        "charging": False,
        "light_mode": light_mode,
        "current_color": current_color,
    }

    response = requests.post(f"{url}/api/readings", json=my_dict) # json= converts dict → JSON + sets the header
    cmd = response.json()["command"]
    if cmd is not None:
        light_mode = cmd["light_mode"] # cmd itself is written in dict
        if light_mode == 1: # manual: current_clour takes the command_colour
            current_color = cmd["command_color"]
        elif light_mode == 2: # motion: pretend a motion sensor, pick radomly between motion (white, 255/255/255) and no motion (off, 0/0/0)
            if motion_detected == 1:
                current_color = {"r": 255, "g": 255, "b": 255}
            else:
                current_color = {"r": 0, "g": 0, "b": 0}

        # for bus info
        for bus in cmd["buses"]:
            print(bus["name"], bus["time"])
    
    print(f"status code: {response.status_code}")
    print("reply:", response.json())

    time.sleep(3) # pause 3 seconds
