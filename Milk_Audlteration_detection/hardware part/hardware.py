import tkinter as tk
from tkinter import ttk, messagebox
import serial
import threading
import time
import paho.mqtt.client as mqtt


class SerialMQTTApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Serial to MQTT Publisher")
        self.root.geometry("700x500")

        # Variables
        self.port_var = tk.StringVar(value="COM3")
        self.baud_var = tk.StringVar(value="9600")
        self.topic_var = tk.StringVar(value="milksupplydata")
        self.status_var = tk.StringVar(value="Stopped")

        self.serial_port = None
        self.mqtt_client = None
        self.running = False
        self.thread = None
        self.last_sent_data = None

        self.build_ui()
        self.setup_mqtt()

    def build_ui(self):
        top_frame = tk.Frame(self.root)
        top_frame.pack(padx=10, pady=10, fill="x")

        tk.Label(top_frame, text="Serial Port:").grid(row=0, column=0, padx=5, pady=5, sticky="w")
        tk.Entry(top_frame, textvariable=self.port_var, width=15).grid(row=0, column=1, padx=5, pady=5)

        tk.Label(top_frame, text="Baud Rate:").grid(row=0, column=2, padx=5, pady=5, sticky="w")
        tk.Entry(top_frame, textvariable=self.baud_var, width=15).grid(row=0, column=3, padx=5, pady=5)

        tk.Label(top_frame, text="MQTT Topic:").grid(row=1, column=0, padx=5, pady=5, sticky="w")
        tk.Entry(top_frame, textvariable=self.topic_var, width=35).grid(row=1, column=1, columnspan=3, padx=5, pady=5, sticky="we")

        button_frame = tk.Frame(self.root)
        button_frame.pack(padx=10, pady=5, fill="x")

        self.start_btn = tk.Button(button_frame, text="Start", width=12, command=self.start_reading)
        self.start_btn.pack(side="left", padx=5)

        self.stop_btn = tk.Button(button_frame, text="Stop", width=12, command=self.stop_reading, state="disabled")
        self.stop_btn.pack(side="left", padx=5)

        self.clear_btn = tk.Button(button_frame, text="Clear Log", width=12, command=self.clear_log)
        self.clear_btn.pack(side="left", padx=5)

        tk.Label(button_frame, text="Status:").pack(side="left", padx=(20, 5))
        tk.Label(button_frame, textvariable=self.status_var, fg="blue").pack(side="left")

        log_frame = tk.Frame(self.root)
        log_frame.pack(padx=10, pady=10, fill="both", expand=True)

        self.log_text = tk.Text(log_frame, wrap="word", font=("Consolas", 10))
        self.log_text.pack(side="left", fill="both", expand=True)

        scrollbar = ttk.Scrollbar(log_frame, orient="vertical", command=self.log_text.yview)
        scrollbar.pack(side="right", fill="y")
        self.log_text.configure(yscrollcommand=scrollbar.set)

    def setup_mqtt(self):
        try:
            self.mqtt_client = mqtt.Client()
            self.mqtt_client.connect("broker.hivemq.com", 1883, 60)
            self.mqtt_client.loop_start()
            self.write_log("Connected to MQTT broker: broker.hivemq.com")
        except Exception as e:
            self.write_log(f"MQTT connection error: {e}")
            messagebox.showerror("MQTT Error", f"Could not connect to MQTT broker.\n{e}")

    def connect_serial(self):
        try:
            self.serial_port = serial.Serial(
                self.port_var.get().strip(),
                int(self.baud_var.get().strip()),
                timeout=1
            )
            self.write_log(f"Connected to serial port: {self.port_var.get().strip()}")
            return True
        except Exception as e:
            self.write_log(f"Serial connection error: {e}")
            messagebox.showerror("Serial Error", f"Could not open serial port.\n{e}")
            return False

    def start_reading(self):
        if self.running:
            return

        if self.serial_port is None or not self.serial_port.is_open:
            ok = self.connect_serial()
            if not ok:
                return

        self.running = True
        self.status_var.set("Running")
        self.start_btn.config(state="disabled")
        self.stop_btn.config(state="normal")

        self.thread = threading.Thread(target=self.read_and_publish_loop, daemon=True)
        self.thread.start()
        self.write_log("Started reading serial data and publishing to MQTT")

    def stop_reading(self):
        self.running = False
        self.status_var.set("Stopped")
        self.start_btn.config(state="normal")
        self.stop_btn.config(state="disabled")
        self.write_log("Stopped reading and publishing")

    def read_and_publish_loop(self):
        while self.running:
            try:
                if self.serial_port and self.serial_port.is_open:
                    line = self.serial_port.readline().decode(errors="ignore").strip()

                    if line:
                        self.write_log(f"Received: {line}")

                        # publish only when current data differs from previous data
                        if line != self.last_sent_data:
                            topic = self.topic_var.get().strip()
                            self.mqtt_client.publish(topic, line)
                            self.last_sent_data = line
                            self.write_log(f"Published to MQTT [{topic}]: {line}")
                        else:
                            self.write_log(f"Skipped duplicate data: {line}")

                time.sleep(1)

            except Exception as e:
                self.write_log(f"Error: {e}")
                time.sleep(1)

    def write_log(self, msg):
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.insert("1.0", f"[{timestamp}] {msg}\n")
        self.log_text.update_idletasks()

    def clear_log(self):
        self.log_text.delete("1.0", tk.END)

    def on_close(self):
        self.running = False

        try:
            if self.mqtt_client:
                self.mqtt_client.loop_stop()
                self.mqtt_client.disconnect()
        except:
            pass

        try:
            if self.serial_port and self.serial_port.is_open:
                self.serial_port.close()
        except:
            pass

        self.root.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    app = SerialMQTTApp(root)
    root.protocol("WM_DELETE_WINDOW", app.on_close)
    root.mainloop()