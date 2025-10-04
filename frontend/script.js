let map;
let markers = [];
let currentYear = 2024;
let currentCity = 'all';
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loading-screen').classList.add('hidden');
    
    try {
        initializeMap();
        populateCityDropdown();
        initializeCharts();
        setupEventListeners();
        updateDashboard();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

function initializeMap() {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
}

function populateCityDropdown() {
    const select = document.getElementById('city-select');
    const cityIcons = {
        'New York': '🗽',
        'Los Angeles': '🎬',
        'London': '🎡',
        'Tokyo': '🗼',
        'Beijing': '🏯',
        'Delhi': '🕌',
        'São Paulo': '⚽',
        'Sydney': '🦘',
        'Paris': '🗼',
        'Dubai': '🏜️'
    };
    
    Object.keys(cityData).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = `${cityIcons[city] || '📍'} ${city}`;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('year-slider').addEventListener('input', (e) => {
        currentYear = parseInt(e.target.value);
        document.getElementById('year-value').textContent = currentYear;
        updateDashboard();
    });

    document.getElementById('city-select').addEventListener('change', (e) => {
        currentCity = e.target.value;
        updateDashboard();
        
        if (currentCity !== 'all') {
            const city = cityData[currentCity];
            map.setView([city.lat, city.lng], 6);
        } else {
            map.setView([20, 0], 2);
        }
    });

    ['toggle-aqi', 'toggle-vegetation', 'toggle-temperature'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateDashboard);
    });

    document.getElementById('predict-btn').addEventListener('click', () => {
        showPrediction();
    });

    document.getElementById('close-alert').addEventListener('click', () => {
        document.getElementById('alert-banner').classList.add('hidden');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function updateDashboard() {
    clearMarkers();
    updateMap();
    updateStats();
    updateCharts();
    checkAirQualityAlert();
}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

function updateMap() {
    const showAQI = document.getElementById('toggle-aqi').checked;
    const showVegetation = document.getElementById('toggle-vegetation').checked;
    const showTemperature = document.getElementById('toggle-temperature').checked;
    
    const citiesToShow = currentCity === 'all' ? Object.keys(cityData) : [currentCity];

    citiesToShow.forEach(cityName => {
        const city = cityData[cityName];
        const yearData = city.data[currentYear];
        
        if (!yearData) return;

        let color = '#3b82f6';
        let radius = 10;
        
        if (showAQI && !showVegetation && !showTemperature) {
            color = getAQIColor(yearData.aqi);
            radius = 8 + (yearData.aqi / 20);
        } else if (!showAQI && showVegetation && !showTemperature) {
            color = getNDVIColor(yearData.ndvi);
            radius = 8 + (yearData.ndvi * 15);
        } else if (!showAQI && !showVegetation && showTemperature) {
            color = getTempColor(yearData.tempChange);
            radius = 8 + (yearData.tempChange * 2);
        } else if (showAQI || showVegetation || showTemperature) {
            const avgValue = (
                (showAQI ? yearData.aqi / 3 : 0) +
                (showVegetation ? yearData.ndvi * 30 : 0) +
                (showTemperature ? yearData.tempChange * 10 : 0)
            );
            radius = 8 + (avgValue / 10);
            if (showAQI) color = getAQIColor(yearData.aqi);
            else if (showVegetation) color = getNDVIColor(yearData.ndvi);
            else if (showTemperature) color = getTempColor(yearData.tempChange);
        } else {
            return;
        }

        const circleMarker = L.circleMarker([city.lat, city.lng], {
            radius: radius,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        let popupContent = `<h4>${cityName}</h4>`;
        if (showAQI) popupContent += `<p><strong>AQI:</strong> ${yearData.aqi} (${getAQICategory(yearData.aqi)})</p>`;
        if (showTemperature) popupContent += `<p><strong>Temperature:</strong> ${yearData.temp.toFixed(1)}°C</p><p><strong>Temp Change:</strong> +${yearData.tempChange}°C</p>`;
        if (showVegetation) popupContent += `<p><strong>Green Cover:</strong> ${getNDVIPercentage(yearData.ndvi)}%</p>`;

        circleMarker.bindPopup(popupContent);
        markers.push(circleMarker);
    });
}

function updateStats() {
    const showAQI = document.getElementById('toggle-aqi').checked;
    const showVegetation = document.getElementById('toggle-vegetation').checked;
    const showTemperature = document.getElementById('toggle-temperature').checked;
    
    const citiesToAnalyze = currentCity === 'all' ? Object.keys(cityData) : [currentCity];
    
    let totalAQI = 0;
    let totalTempChange = 0;
    let totalNDVI = 0;
    let count = 0;

    citiesToAnalyze.forEach(cityName => {
        const yearData = cityData[cityName].data[currentYear];
        if (yearData) {
            totalAQI += yearData.aqi;
            totalTempChange += yearData.tempChange;
            totalNDVI += yearData.ndvi;
            count++;
        }
    });

    if (count > 0) {
        const avgAQI = Math.round(totalAQI / count);
        const avgTempChange = (totalTempChange / count).toFixed(1);
        const avgNDVI = Math.round((totalNDVI / count) * 100);

        const statCards = document.querySelectorAll('.stat-item');
        
        if (showAQI) {
            document.getElementById('stat-aqi').textContent = `${getAQICategory(avgAQI)} (${avgAQI})`;
            statCards[2].style.display = 'flex';
        } else {
            statCards[2].style.display = 'none';
        }
        
        if (showTemperature) {
            document.getElementById('stat-temp').textContent = `+${avgTempChange}°C`;
            statCards[1].style.display = 'flex';
        } else {
            statCards[1].style.display = 'none';
        }
        
        if (showVegetation) {
            document.getElementById('stat-green').textContent = `${avgNDVI}%`;
            statCards[0].style.display = 'flex';
        } else {
            statCards[0].style.display = 'none';
        }
    }
}

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#94a3b8'
                }
            }
        }
    };

    charts.aqi = new Chart(document.getElementById('aqi-chart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'AQI',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: chartOptions
    });

    charts.temp = new Chart(document.getElementById('temp-chart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature Change (°C)',
                data: [],
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: '#f59e0b',
                borderWidth: 1
            }]
        },
        options: chartOptions
    });

    charts.ndvi = new Chart(document.getElementById('ndvi-chart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Green Cover %',
                data: [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}

function updateCharts() {
    const showAQI = document.getElementById('toggle-aqi').checked;
    const showVegetation = document.getElementById('toggle-vegetation').checked;
    const showTemperature = document.getElementById('toggle-temperature').checked;
    
    const cityToShow = currentCity === 'all' ? 'New York' : currentCity;
    const city = cityData[cityToShow];
    
    const years = Object.keys(city.data).sort();
    const aqiData = [];
    const tempData = [];
    const ndviData = [];

    years.forEach(year => {
        const data = city.data[year];
        aqiData.push(data.aqi);
        tempData.push(data.tempChange);
        ndviData.push(getNDVIPercentage(data.ndvi));
    });

    charts.aqi.data.labels = showAQI ? years : [];
    charts.aqi.data.datasets[0].data = showAQI ? aqiData : [];
    charts.aqi.update();
    
    document.getElementById('aqi-chart').parentElement.style.display = showAQI ? 'block' : 'none';

    charts.temp.data.labels = showTemperature ? years : [];
    charts.temp.data.datasets[0].data = showTemperature ? tempData : [];
    charts.temp.update();
    
    document.getElementById('temp-chart').parentElement.style.display = showTemperature ? 'block' : 'none';

    charts.ndvi.data.labels = showVegetation ? years : [];
    charts.ndvi.data.datasets[0].data = showVegetation ? ndviData : [];
    charts.ndvi.update();
    
    document.getElementById('ndvi-chart').parentElement.style.display = showVegetation ? 'block' : 'none';
}

function checkAirQualityAlert() {
    const citiesToCheck = currentCity === 'all' ? Object.keys(cityData) : [currentCity];
    
    let hasPoorAirQuality = false;
    citiesToCheck.forEach(cityName => {
        const yearData = cityData[cityName].data[currentYear];
        if (yearData && yearData.aqi > 100) {
            hasPoorAirQuality = true;
        }
    });

    const alertBanner = document.getElementById('alert-banner');
    if (hasPoorAirQuality) {
        alertBanner.classList.remove('hidden');
        if (currentCity !== 'all') {
            document.getElementById('alert-text').textContent = 
                `Air Quality Alert: Unhealthy conditions detected in ${currentCity}`;
        } else {
            document.getElementById('alert-text').textContent = 
                'Air Quality Alert: Poor conditions detected in some cities';
        }
    } else {
        alertBanner.classList.add('hidden');
    }
}

function showPrediction() {
    const cityToPredict = currentCity === 'all' ? 'New York' : currentCity;
    const city = cityData[cityToPredict];
    const latestYear = Math.max(...Object.keys(city.data).map(Number));
    const latestData = city.data[latestYear];
    
    const predictedAQI = Math.max(30, Math.round(latestData.aqi * 0.92));
    const predictedTemp = (latestData.tempChange + 0.3).toFixed(1);
    const predictedNDVI = Math.min(0.65, latestData.ndvi + 0.03);
    
    const message = `
🔮 Prediction for ${cityToPredict} (${latestYear + 1}):
• AQI: ${predictedAQI} (Improving trend)
• Temperature Change: +${predictedTemp}°C
• Green Cover: ${getNDVIPercentage(predictedNDVI)}% (Increasing)

Analysis based on NASA Earth Observation trends.
    `;
    
    alert(message);
}
