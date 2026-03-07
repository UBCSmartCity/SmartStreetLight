import socket
import tkinter as tk
from tkinter import ttk, Canvas, scrolledtext
from datetime import datetime

class DeviceDataPanel:
    def __init__(self, root):
        self.root = root
        self.root.title("Device Data Dashboard")
        self.root.geometry("1000x800") # Expanded for the horizontal layout

        # Create main frame
        self.main_frame = ttk.Frame(root, padding="15")
        self.main_frame.pack(fill=tk.BOTH, expand=True)

        # --- 1. HEADER (Menu, Title, On/Off) ---
        header_frame = ttk.Frame(self.main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.menu_btn = ttk.Button(header_frame, text="Menu", command=self.dummy_action)
        self.menu_btn.pack(side=tk.LEFT)
        
        title_label = ttk.Label(header_frame, text="Streetlight Prototype - Dashboard", font=("Arial", 16, "bold"))
        title_label.pack(side=tk.LEFT, expand=True)
        
        self.power_var = tk.IntVar(value=1)
        # Using a standard Checkbutton for the on/off switch as a placeholder
        self.power_switch = ttk.Checkbutton(header_frame, text="System On/Off", variable=self.power_var, command=self.dummy_action)
        self.power_switch.pack(side=tk.RIGHT)

        # --- 2. NETWORK & STATUS CONTROLS ---
        network_frame = ttk.Frame(self.main_frame)
        network_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(network_frame, text="Device IP:").pack(side=tk.LEFT)
        self.ip_entry = ttk.Entry(network_frame, width=15)
        self.ip_entry.pack(side=tk.LEFT, padx=5)
        self.ip_entry.insert(0, "192.168.51.1") 

        ttk.Button(network_frame, text="Fetch Data", command=self.fetch_data).pack(side=tk.LEFT, padx=5)
        
        self.connection_canvas = Canvas(network_frame, width=20, height=20, highlightthickness=0)
        self.connection_canvas.pack(side=tk.LEFT, padx=5)
        self.connection_status = self.connection_canvas.create_oval(2, 2, 18, 18, fill="red")
        
        self.last_updated_label = ttk.Label(network_frame, text="Last updated: Never")
        self.last_updated_label.pack(side=tk.RIGHT)

        # --- 3. PARSED DEVICE DATA (Horizontal Blocks) ---
        self.data_container = ttk.LabelFrame(self.main_frame, text="Parsed Device Data", padding="10")
        self.data_container.pack(fill=tk.X, pady=(0, 15))
        
        self.data_labels = {}
        self.create_data_display()

        # --- 4. CONTROLS (Light and Bus Side-by-Side) ---
        controls_container = ttk.Frame(self.main_frame)
        controls_container.pack(fill=tk.X, pady=(0, 15))
        controls_container.columnconfigure(0, weight=3) # Give light controls a bit more width
        controls_container.columnconfigure(1, weight=2)

        # Light Control (Condensed)
        light_frame = ttk.LabelFrame(controls_container, text="Light Control", padding="10")
        light_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 5))
        
        self.light_state_var = tk.IntVar(value=1)
        ttk.Checkbutton(light_frame, text="Master Switch", variable=self.light_state_var).grid(row=0, column=0, columnspan=2, sticky=tk.W, pady=(0,10))
        
        # Sliders side-by-side
        ttk.Label(light_frame, text="R:").grid(row=1, column=0, sticky=tk.E)
        self.red_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=80)
        self.red_scale.set(180)
        self.red_scale.grid(row=1, column=1, sticky=tk.W, padx=(0, 10))

        ttk.Label(light_frame, text="G:").grid(row=1, column=2, sticky=tk.E)
        self.green_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=80)
        self.green_scale.set(0)
        self.green_scale.grid(row=1, column=3, sticky=tk.W, padx=(0, 10))

        ttk.Label(light_frame, text="B:").grid(row=1, column=4, sticky=tk.E)
        self.blue_scale = tk.Scale(light_frame, from_=0, to=255, orient=tk.HORIZONTAL, length=80)
        self.blue_scale.set(180)
        self.blue_scale.grid(row=1, column=5, sticky=tk.W)

        ttk.Button(light_frame, text="Update Lights", command=self.send_light_command).grid(row=0, column=4, columnspan=2, sticky=tk.E)

        # Bus Timings (Condensed)
        bus_frame = ttk.LabelFrame(controls_container, text="Bus Timings", padding="10")
        bus_frame.grid(row=0, column=1, sticky="nsew", padx=(5, 0))

        ttk.Label(bus_frame, text="Route:").grid(row=0, column=0, sticky=tk.E, pady=5)
        self.route_entry = ttk.Entry(bus_frame, width=8)
        self.route_entry.insert(0, "R4")
        self.route_entry.grid(row=0, column=1, padx=5, sticky=tk.W)

        ttk.Label(bus_frame, text="Time:").grid(row=1, column=0, sticky=tk.E, pady=5)
        self.time_entry = ttk.Entry(bus_frame, width=8)
        self.time_entry.insert(0, "11:30")
        self.time_entry.grid(row=1, column=1, padx=5, sticky=tk.W)

        ttk.Button(bus_frame, text="Update Bus", command=self.send_bus_command).grid(row=0, column=2, rowspan=2, padx=15)

        # --- 5. GRAPHS PLACEHOLDER ---
        graphs_frame = ttk.LabelFrame(self.main_frame, text="Data Visualization", padding="10")
        graphs_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 15))
        
        ttk.Label(graphs_frame, text="[ Graph Area Empty ]", foreground="gray", font=('Arial', 14)).pack(expand=True)

        # --- 6. MANUAL COMMAND & RAW DATA (Compact) ---
        bottom_frame = ttk.Frame(self.main_frame)
        bottom_frame.pack(fill=tk.X)
        
        cmd_frame = ttk.Frame(bottom_frame)
        cmd_frame.pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Label(cmd_frame, text="Manual Command:").pack(side=tk.LEFT)
        self.cmd_entry = ttk.Entry(cmd_frame, width=20)
        self.cmd_entry.pack(side=tk.LEFT, padx=5)
        ttk.Button(cmd_frame, text="Send", command=self.send_manual_command).pack(side=tk.LEFT)

        # Reduced size of raw text to save space for the graphs
        self.raw_text = scrolledtext.ScrolledText(bottom_frame, height=3, width=40, font=('Courier', 8))
        self.raw_text.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=(20,0))
        self.raw_text.config(state=tk.DISABLED)

        # Start refreshing loop
        self.refresh_interval = 3000 
        self.auto_refresh()

    def dummy_action(self):
        """Placeholder function for Menu and On/Off toggles"""
        print("UI Button Clicked (Functionality pending)")

    def create_data_display(self):
        self.fields = [
            "Location", "Battery Voltage", "Battery Current", "Battery Power",
            "Solar Voltage", "Solar Power", "SOC", "BMS Status",
            "LED State", "RGB Values"
        ]
        
        # Maps the 10 fields into a 2x5 horizontal grid
        for i, field in enumerate(self.fields):
            row, col = divmod(i, 5)
            self.data_container.columnconfigure(col, weight=1)
            
            block = ttk.Frame(self.data_container, relief="groove", borderwidth=1)
            block.grid(row=row, column=col, sticky="nsew", padx=3, pady=3)
            
            ttk.Label(block, text=field, font=('Arial', 9), foreground="#555555").pack(pady=(4,0))
            lbl = ttk.Label(block, text="N/A", font=('Arial', 10, 'bold'))
            lbl.pack(pady=(0,4))
            
            self.data_labels[field] = lbl

    def send_light_command(self):
        l = self.light_state_var.get()
        r = self.red_scale.get()
        g = self.green_scale.get()
        b = self.blue_scale.get()
        command_str = f"CMD:L={l},R={r},G={g},B={b}"
        print(f"Sending Light Command: {command_str}")
        self.send_to_socket(command_str)

    def send_bus_command(self):
        route = self.route_entry.get().strip()
        time = self.time_entry.get().strip()
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