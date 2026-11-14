"""The Flasky server"""
from flask import Flask, request
from datetime import datetime, timedelta
from collections import deque

app = Flask(__name__) # create the server (tell the server which file is the main part of the app)
# __name__: special names built into Python itself, 
# Here it means: the name of the current file
# Every python file automatically gets a variable __name__, and it depends on 
# how the file is used
# When run the file directly: python3 app.py -> __name__ = "__main__"
# When another file imports the file : import app -> __name__ = "app"
# __init__: the function that runs when you create an object from a class
# __main__: 

readings_by_light = {} # light_id -> all the past readings (each value is deque)
commands_by_light = {} # light_id -> latest commnad

@app.get("/") # a route: when someone sends a GET request to /, run the function below
# a request to / is waht the browser sends for the home page
def home():
    return "Hello from the streetlight server!" # response

@app.post("/api/readings")
# Stores request from light as JSON, prints it and respond to the light
def receive_light_data():
    data = request.get_json(silent=True) # JSON body -> Python dict (None if not valid JSON)

    # input checking: only what's needed to store the reading safely
    if not isinstance(data, dict):
        return {"error": "Invalid reading, body must be a JSON object"}, 400
    if not isinstance(data.get("light_id"), int):
        return {"error": "light_id is missing or not an integer"}, 400

    data["received_at"] = datetime.now().isoformat(timespec="seconds") # Assigning to a key the dict doesn't have yet creates it
    light_id = data["light_id"]
    if light_id not in readings_by_light:
        readings_by_light[light_id] = deque(maxlen=1000) # create an empty deque for new lights
    readings_by_light[light_id].append(data) # add the newest data
    print ("Got reading", data) # shows in the server terminal
    # command = commands_by_light[light_id] // would return KeyError 500 if light_id is not an existing key
    command = commands_by_light.get(light_id) # would return null if key not exist
    return {"status": "ok",
            "command": command
            } # dict -> JSON reply

@app.get("/api/readings/latest") # read the latest one by dashboard
def get_latest_reading(): 
    light_id = request.args.get("light_id", type=int) # None if missing or not a number
    if light_id is None:
        return {"error": "light_id is missing or not an integer"}, 400
    readings = readings_by_light.get(light_id) # get the deque for the ligth (all the history data)
    if readings is None:
        return {"error": f"no readings yet for light {light_id}"}, 404
    return readings[-1]

@app.get("/api/readings") # read all data in the past x minutes for light y
def get_past_readings(): 
    light_id = request.args.get("light_id", type=int) # None if missing or not a number
    if light_id is None:
        return {"error": "light_id is missing or not an integer"}, 400
    readings = readings_by_light.get(light_id)
    if readings is None:
        return {"error": f"no readings yet for light {light_id}"}, 404

    interval = request.args.get("minutes", 10, type=int) # 10 if missing OR not a number
    if interval <= 0:
        return {"error": "minutes must be a positive integer"}, 400
    cutoff = datetime.now() - timedelta(minutes=interval)

    # build a list storing readings fall in the interval
    kept = []
    for reading in readings:
         t = datetime.fromisoformat(reading.get("received_at"))
         if t >= cutoff:
              kept.append(reading)
    return kept

@app.post("/api/commands") # the dashboard sends a command
def receive_commands():
    data = request.get_json(silent=True) # None if body isn't valid JSON

    # input checking
    if not isinstance(data, dict):
        return {"error": "Invalid command, body must be a JSON object"}, 400
    if not isinstance(data.get("light_id"), int):
        return {"error": "light_id is missing or not an integer"}, 400
    if "light_mode" not in data:
        return {"error": "Missing light_mode"}, 400
    if data["light_mode"] not in (1, 2):
        return {"error": "Invalid light_mode"}, 400
    if "command_color" not in data:
        return {"error": "Missing command_color"}, 400
    color = data["command_color"]
    if not isinstance(color, dict):
        return {"error": "Invalid command_color. It must be a dict"}, 400
    for key in ("r", "g", "b"):
        if key not in color:
            return {"error": f"Invalid command_color. {key} not appear"}, 400
        v = color[key]
        if not isinstance(v, int): 
            return {"error": f"Invalid command_color. {key} must be an integer"}, 400
        if not (0 <= v <= 255):
            return {"error": f"Invalid command_color. {key} is {v}, out of range"}, 400
    
        
    light_id = data["light_id"]
    data["received_at"] = datetime.now().isoformat(timespec="seconds") # Assigning to a key the dict doesn't have yet creates it
    commands_by_light[light_id] = data
    print ("Got commands", data) # shows in the server terminal
    return {"status": "ok"} # dict -> JSON reply

@app.get("/api/commands") # light fetch the command
def fetch_command(): 
    light_id = request.args.get("light_id", type=int) # None if missing or not a number
    if light_id is None:
        return {"error": "light_id is missing or not an integer"}, 400
    command = commands_by_light.get(light_id) # get the latest command for this light
    if command is None:
        return {"error": f"no command yet for light {light_id}"}, 404
    return command

if __name__ == "__main__": # only run the cdoe below if this file was run directly
    # starts the server on port 8000
    # debug=True restarts it automatically when you save changes
    # app.run(host="0.0.0.0", port=8000, debug=True) # Anyone who can reach your laptop: your laptop and other devices on the same network (the real light, the Pi, other people)
    # app.run(host="127.0.0.1", port=8000, debug=True) # Only your own laptop (your browser, your fake light)
    app.run(host="0.0.0.0", port=8000, debug=True) # Only your own laptop (your browser, your fake light)
    
    