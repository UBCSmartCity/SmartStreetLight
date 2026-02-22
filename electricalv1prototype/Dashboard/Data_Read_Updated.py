import socket
import tkinter as tk
from tkinter import ttk, Canvas, scrolledtext
from datetime import datetime

class DeviceDataPanel:
    def __init__(self, root):
        self.root = root
        self.root.title("Device Data Dashboard")
        self.root.geometry("900x950") # Slightly increased size for the new panel

        # Create main frame
        self.main_frame = ttk.Frame(root, padding="20")
        self.main_frame.pack(fill=tk.BOTH, expand=True)

        # --- Top control (ip and fetch) ---
        control_frame = ttk.Frame(self.main_frame)
        control_frame.grid(row=0, column=0, columnspan=2, sticky=tk.EW, pady=(0, 10))
        
        ttk.Label(control_frame, text="Device IP:").pack(side=tk.LEFT)
        self.ip_entry = ttk.Entry(control_frame, width=15)
        self.ip_entry.pack(side=tk.LEFT, padx=5)
        self.ip_entry.insert(0, "192.168.51.1") 

        ttk.Button(control_frame, text="Fetch Data", command=self.fetch_data).pack(side=tk.LEFT, padx=5)
        
        # Connection status
        self.connection_canvas = Canvas(control_frame, width=20, height=20, highlightthickness=0)
        self.connection_canvas.pack(side=tk.LEFT, padx=5)
        self.connection_status = self.connection_canvas.create_oval(2, 2, 18, 18, fill="red")

        # --- LIGHT CONTROL PANEL ---
        light_frame = ttk.LabelFrame(self.main_frame, text="Light Control", padding="15")
        light_frame.grid(row=1, column=0, columnspan=2, sticky=tk.EW, pady=(0, 10))

        # Light State Toggle
        self.light_state_var = tk.IntVar(value=1)
        ttk.Checkbutton(light_frame, text="Light Master Switch", variable=self.light_state_var).grid(row=0, column=0, columnspan=2, sticky=tk.W)

        # Sliders
        ttk.Label(light_frame, text="Red:").grid(row=1, column=0, sticky=tk.W)
        self.red_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=200)
        self.red_scale.set(180)
        self.red_scale.grid(row=1, column=1, padx=5)

        ttk.Label(light_frame, text="Green:").grid(row=2, column=0, sticky=tk.W)
        self.green_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=200)
        self.green_scale.set(0)
        self.green_scale.grid(row=2, column=1, padx=5)

        ttk.Label(light_frame, text="Blue:").grid(row=3, column=0, sticky=tk.W)
        self.blue_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=200)
        self.blue_scale.set(180)
        self.blue_scale.grid(row=3, column=1, padx=5)

        ttk.Button(light_frame, text="Update Lights", command=self.send_light_command).grid(row=4, column=0, columnspan=2, pady=10)

        # --- BUS CONTROL PANEL (NEW) ---
        bus_frame = ttk.LabelFrame(self.main_frame, text="Bus Timings", padding="15")
        bus_frame.grid(row=2, column=0, columnspan=2, sticky=tk.EW, pady=(0, 10))

        ttk.Label(bus_frame, text="Route:").grid(row=0, column=0, sticky=tk.W)
        self.route_entry = ttk.Entry(bus_frame, width=10)
        self.route_entry.insert(0, "R4")
        self.route_entry.grid(row=0, column=1, padx=5, sticky=tk.W)

        ttk.Label(bus_frame, text="Time:").grid(row=0, column=2, sticky=tk.W)
        self.time_entry = ttk.Entry(bus_frame, width=10)
        self.time_entry.insert(0, "11:30")
        self.time_entry.grid(row=0, column=3, padx=5, sticky=tk.W)

        ttk.Button(bus_frame, text="Update Bus", command=self.send_bus_command).grid(row=0, column=4, padx=10)

        # --- Manual Command Frame ---
        send_frame = ttk.Frame(self.main_frame)
        send_frame.grid(row=3, column=0, columnspan=2, sticky=tk.EW, pady=(0, 20))

        ttk.Label(send_frame, text="Manual Command:").pack(side=tk.LEFT)
        self.cmd_entry = ttk.Entry(send_frame, width=25)
        self.cmd_entry.pack(side=tk.LEFT, padx=5)
        ttk.Button(send_frame, text="Send", command=self.send_manual_command).pack(side=tk.LEFT, padx=5)

        # --- Data Displays ---
        self.last_updated_label = ttk.Label(self.main_frame, text="Last updated: Never")
        self.last_updated_label.grid(row=4, column=0, columnspan=2, pady=(0, 5), sticky=tk.W)

        self.data_frame = ttk.LabelFrame(self.main_frame, text="Parsed Device Data", padding="15")
        self.data_frame.grid(row=5, column=0, sticky=tk.NSEW, padx=(0,5))

        self.raw_frame = ttk.LabelFrame(self.main_frame, text="Raw Response", padding="15")
        self.raw_frame.grid(row=5, column=1, sticky=tk.NSEW, padx=(5,0))
        
        self.raw_text = scrolledtext.ScrolledText(self.raw_frame, height=15, width=40, font=('Courier', 9))
        self.raw_text.pack(fill=tk.BOTH, expand=True)
        self.raw_text.config(state=tk.DISABLED)

        # Configure weights
        self.main_frame.columnconfigure(0, weight=1)
        self.main_frame.columnconfigure(1, weight=1)
        self.main_frame.rowconfigure(5, weight=1)

        self.data_labels = {}
        self.create_data_display()

        # Start refreshing loop
        self.refresh_interval = 3000 
        self.auto_refresh()

    def create_data_display(self):
        self.fields = [
            "Location", "Battery Voltage", "Battery Current", "Battery Power",
            "Solar Voltage", "Solar Power", "SOC", "BMS Status",
            "LED State", "RGB Values"
        ]
        for i, field in enumerate(self.fields):
            ttk.Label(self.data_frame, text=f"{field}:", font=('Arial', 10, 'bold')).grid(row=i, column=0, sticky=tk.E, padx=5, pady=2)
            self.data_labels[field] = ttk.Label(self.data_frame, text="N/A")
            self.data_labels[field].grid(row=i, column=1, sticky=tk.W, padx=5, pady=2)

    def send_light_command(self):
        """Constructs the formatted command string and sends it"""
        l = self.light_state_var.get()
        r = self.red_scale.get()
        g = self.green_scale.get()
        b = self.blue_scale.get()
        
        # Format: CMD:L=1,R=255,G=0,B=180
        command_str = f"CMD:L={l},R={r},G={g},B={b}"
        print(f"Sending Light Command: {command_str}")
        self.send_to_socket(command_str)

    def send_bus_command(self):
        """Constructs the formatted bus command string and sends it"""
        route = self.route_entry.get().strip()
        time = self.time_entry.get().strip()
        
        # Format: BUS:R4,11:30
        command_str = f"BUS:{route},{time}"
        print(f"Sending Bus Command: {command_str}")
        self.send_to_socket(command_str)

    def send_manual_command(self):
        cmd = self.cmd_entry.get().strip()
        if cmd:
            self.send_to_socket(cmd)

    def send_to_socket(self, cmd_string):
        ip = self.ip_entry.get().strip()
        if not ip: return
        try:
            with socket.create_connection((ip, 80), timeout=2) as sock:
                sock.sendall(cmd_string.encode())
        except Exception as e:
            print(f"Send Error: {e}")
            self.update_raw_display(f"Send Error: {e}")

    def fetch_data(self):
        ip = self.ip_entry.get().strip()
        if not ip: return
        
        try:
            with socket.create_connection((ip, 80), timeout=2) as sock:
                sock.sendall(b"GET / HTTP/1.1\r\nHost: " + ip.encode() + b"\r\n\r\n")
                response = sock.recv(4096).decode(errors='ignore').strip()
                
                if response:
                    self.update_raw_display(response)
                    self.parse_device_data(response)
                    self.last_updated_label.config(text=f"Last updated: {datetime.now().strftime('%H:%M:%S')}")
                    self.set_connection_status(True)
        except Exception as e:
            self.set_connection_status(False)
            self.last_updated_label.config(text=f"Error: {str(e)}")

    def parse_device_data(self, data_string):
        if "\r\n\r\n" in data_string: _, body = data_string.split('\r\n\r\n', 1)
        else: body = data_string
        
        lines = body.splitlines()
        device_data = {}
        for line in lines:
            line = line.strip()
            if ':' in line and not line.startswith("---"):
                key, value = line.split(':', 1)
                device_data[key.strip()] = value.strip()
        
        for field in self.fields:
            if field in device_data:
                self.data_labels[field].config(text=device_data[field])

    def update_raw_display(self, text):
        self.raw_text.config(state=tk.NORMAL)
        self.raw_text.delete(1.0, tk.END)
        self.raw_text.insert(tk.END, text)
        self.raw_text.config(state=tk.DISABLED)

    def auto_refresh(self):
        self.fetch_data()
        self.root.after(self.refresh_interval, self.auto_refresh)

    def set_connection_status(self, connected):
        color = "green" if connected else "red"
        self.connection_canvas.itemconfig(self.connection_status, fill=color)

if __name__ == "__main__":
    root = tk.Tk()
    app = DeviceDataPanel(root)
    root.mainloop()
