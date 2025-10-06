from flask import Flask, jsonify, render_template
import psutil
from datetime import datetime

app = Flask(__name__)

prev_net = psutil.net_io_counters()
prev_time = datetime.now()

def get_system_stats():
    global prev_net, prev_time
    now = datetime.now()
    current_net = psutil.net_io_counters()
    delta_time = (now - prev_time).total_seconds()

    # Bytes per second → megabytes per second
    sent_speed = (current_net.bytes_sent - prev_net.bytes_sent) / delta_time / (1024 ** 2)
    recv_speed = (current_net.bytes_recv - prev_net.bytes_recv) / delta_time / (1024 ** 2)

    cpu_usage = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory()
    disk_usage = psutil.disk_usage('/')

    prev_net, prev_time = current_net, now

    return {
        'cpu': cpu_usage,
        'memory': memory.percent,
        'disk': disk_usage.percent,
        'network_sent': current_net.bytes_sent,
        'network_received': current_net.bytes_recv,
        'network_sent_speed': round(sent_speed, 2),
        'network_recv_speed': round(recv_speed, 2),
        'time': now.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/apps')
def apps():
    return render_template('apps.html')

@app.route('/stats')
def stats():
    return jsonify(get_system_stats())

if __name__ == '__main__':
    app.run(debug=True)
