// Theme Switching
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Initialize theme
(function () {
    if (localStorage.getItem('theme') === 'dark') {
        setTheme('dark');
        document.getElementById('theme-toggle').checked = true;
    } else {
        setTheme('light');
        document.getElementById('theme-toggle').checked = false;
    }

    document.getElementById('theme-toggle').addEventListener('change', function(e) {
        toggleTheme();
    });
})();

// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        updateDashboard(data);
        updateRawJson(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        updateRawJson({ error: 'Failed to fetch data', details: error.message });
    }
}

// Function to update the entire dashboard
function updateDashboard(data) {
    // Skip update if there's an error
    if (data.error) return;
    
    updateSystemOverview(data);
    updateResourceUsage(data);
    updateServiceStatus(data);
    updateConnectionStatus(data);
}

// Update System Overview section
function updateSystemOverview(data) {
    const overview = document.getElementById('systemOverview');
    overview.innerHTML = `
        <div class="mb-4">
            <div class="metric-value">${data.version}</div>
            <div class="metric-label">Current Version</div>
        </div>
        <div class="mb-4">
            <div class="metric-value">${data.latest_agent_version}</div>
            <div class="metric-label">Latest Agent Version</div>
        </div>
        <div class="mb-4">
            <div class="metric-value">${data.agent_count}</div>
            <div class="metric-label">Active Agents</div>
        </div>
        <div class="mb-4">
            <div class="metric-value">${data.client_count}</div>
            <div class="metric-label">Connected Clients</div>
        </div>
        <div class="mb-4">
            <div class="metric-value">${data.site_count}</div>
            <div class="metric-label">Total Sites</div>
        </div>
        <div class="mb-4">
            <div class="metric-value">${data.days_until_cert_expires}</div>
            <div class="metric-label">Days Until Certificate Expires</div>
        </div>
    `;
}

// Update Resource Usage section
function updateResourceUsage(data) {
    const diskCtx = document.getElementById('diskUsage').getContext('2d');
    const memCtx = document.getElementById('memoryUsage').getContext('2d');
    
    // Destroy existing charts if they exist
    if (window.diskChart) {
        window.diskChart.destroy();
    }
    if (window.memoryChart) {
        window.memoryChart.destroy();
    }

    // Create center text plugin
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            const { ctx, chartArea: { left, top, right, bottom }, width, height } = chart;
            const text = `${chart.data.datasets[0].data[0]}%`;
            
            ctx.save();
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = chart.data.datasets[0].backgroundColor[0];
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            
            ctx.fillText(text, centerX, centerY);
            ctx.restore();
        }
    };
    
    // Common chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.raw}%`;
                    }
                }
            }
        }
    };

    // Create disk usage chart
    window.diskChart = new Chart(diskCtx, {
        type: 'doughnut',
        plugins: [centerTextPlugin],
        data: {
            datasets: [{
                data: [data.disk_usage_percent, 100 - data.disk_usage_percent],
                backgroundColor: ['#007bff', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: chartOptions
    });

    // Create memory usage chart
    window.memoryChart = new Chart(memCtx, {
        type: 'doughnut',
        plugins: [centerTextPlugin],
        data: {
            datasets: [{
                data: [data.mem_usage_percent, 100 - data.mem_usage_percent],
                backgroundColor: ['#28a745', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: chartOptions
    });
}

// Update Service Status section
function updateServiceStatus(data) {
    const serviceStatus = document.getElementById('serviceStatus');
    const queueHealth = `
        <div class="service-item mb-3">
            <div class="d-flex flex-column">
                <div class="d-flex align-items-center mb-1">
                    <span class="status-indicator ${data.celery_queue_health === 'healthy' ? 'status-true' : 'status-false'}"></span>
                    <span>Queue Health</span>
                </div>
                <div class="small text-muted ms-4">Queue Length: ${data.celery_queue_len}</div>
            </div>
        </div>
    `;
    
    const services = Object.entries(data.services_running)
        .map(([service, status]) => `
            <div class="service-item">
                <span class="status-indicator ${status ? 'status-true' : 'status-false'}"></span>
                <span>${service.charAt(0).toUpperCase() + service.slice(1)}</span>
            </div>
        `).join('');
        
    serviceStatus.innerHTML = queueHealth + services;
}

// Update Connection Status section
function updateConnectionStatus(data) {
    const connectionStatus = document.getElementById('connectionStatus');
    const connections = [
        { name: 'Redis', status: data.redis_ping },
        { name: 'NATS Standard', status: data.nats_std_ping },
        { name: 'NATS WebSocket', status: data.nats_ws_ping },
        { name: 'Mesh', status: data.mesh_ping }
    ];

    connectionStatus.innerHTML = `
        <div class="connection-status">
            ${connections.map(conn => `
                <div class="connection-item">
                    <div class="status-indicator ${conn.status ? 'status-true' : 'status-false'} mb-2"></div>
                    <div class="fw-bold">${conn.name}</div>
                    <div class="text-muted small">${conn.status ? 'Connected' : 'Disconnected'}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Update Raw JSON section
function updateRawJson(data) {
    const rawJson = document.getElementById('rawJson');
    rawJson.textContent = JSON.stringify(data, null, 2);
}

// Toggle JSON view
function toggleJsonView() {
    const rawJson = document.getElementById('rawJson');
    rawJson.style.display = rawJson.style.display === 'none' ? 'block' : 'none';
}

// Initial data fetch
fetchData();

// Refresh data every 30 seconds
setInterval(fetchData, 30000); 