const openSidebar = document.getElementById("hamburg");
const closeSidebar = document.getElementById("closeSidebarButton");
const linksContainer = document.getElementById("linksContainer");
const popout = document.getElementById("popout");


openSidebar.onclick = function(){
    openSidebar.style.display = "none";
    linksContainer.style.display = "block";
    popout.style.display = "flex";
}

closeSidebar.onclick = function(){
    openSidebar.style.display = "flex";
    linksContainer.style.display = "none";
    popout.style.display = "none";
}

// Chart setup
const cpuChartCtx = document.getElementById('cpuChart').getContext('2d');
const memoryChartCtx = document.getElementById('memoryChart').getContext('2d');
const networkChartCtx = document.getElementById('networkChart').getContext('2d');

const createChart = (ctx, label, color) => {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label,
                data: [],
                borderColor: color,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, ticks: { color: '#f8fafc' } },
                x: { ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { labels: { color: '#f8fafc' } } }
        }
    });
};

const cpuChart = createChart(cpuChartCtx, 'CPU %', '#38bdf8');
const memoryChart = createChart(memoryChartCtx, 'Memory %', '#fbbf24');

const networkChart = new Chart(networkChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Upload MB/s', data: [], borderColor: '#22c55e', tension: 0.3 },
            { label: 'Download MB/s', data: [], borderColor: '#ef4444', tension: 0.3 }
        ]
    },
    options: {
        scales: {
            y: { beginAtZero: true, ticks: { color: '#f8fafc' } },
            x: { ticks: { color: '#94a3b8' } }
        },
        plugins: { legend: { labels: { color: '#f8fafc' } } }
    }
});

// Update function
async function updateStats() {
    const response = await fetch('/stats');
    const data = await response.json();

    // Text stats
    document.getElementById('cpu').innerText = data.cpu;
    document.getElementById('memory').innerText = data.memory;
    document.getElementById('disk').innerText = data.disk;
    document.getElementById('sent').innerText = data.network_sent;
    document.getElementById('recv').innerText = data.network_received;
    document.getElementById('time').innerText = data.time;

    const timestamp = new Date().toLocaleTimeString();

    // CPU
    updateChart(cpuChart, timestamp, data.cpu);
    // Memory
    updateChart(memoryChart, timestamp, data.memory);
    // Network
    updateChart(networkChart, timestamp, [data.network_sent_speed, data.network_recv_speed]);
}

function updateChart(chart, label, value) {
    chart.data.labels.push(label);

    if (Array.isArray(value)) {
        chart.data.datasets.forEach((dataset, i) => dataset.data.push(value[i]));
    } else {
        chart.data.datasets[0].data.push(value);
    }

    // Keep last 20 points
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(d => d.data.shift());
    }

    chart.update();
}

updateStats();
setInterval(updateStats, 2000);
