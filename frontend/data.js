const cityData = {
    "New York": {
        lat: 40.7128,
        lng: -74.0060,
        data: {
            2020: { aqi: 68, temp: 12.8, ndvi: 0.42, tempChange: 1.1 },
            2021: { aqi: 71, temp: 13.1, ndvi: 0.41, tempChange: 1.3 },
            2022: { aqi: 65, temp: 13.5, ndvi: 0.43, tempChange: 1.5 },
            2023: { aqi: 62, temp: 13.8, ndvi: 0.44, tempChange: 1.7 },
            2024: { aqi: 59, temp: 14.2, ndvi: 0.45, tempChange: 1.9 }
        }
    },
    "Los Angeles": {
        lat: 34.0522,
        lng: -118.2437,
        data: {
            2020: { aqi: 89, temp: 18.5, ndvi: 0.35, tempChange: 1.4 },
            2021: { aqi: 92, temp: 19.0, ndvi: 0.33, tempChange: 1.7 },
            2022: { aqi: 85, temp: 19.3, ndvi: 0.34, tempChange: 1.9 },
            2023: { aqi: 78, temp: 19.8, ndvi: 0.36, tempChange: 2.2 },
            2024: { aqi: 72, temp: 20.1, ndvi: 0.37, tempChange: 2.4 }
        }
    },
    "London": {
        lat: 51.5074,
        lng: -0.1278,
        data: {
            2020: { aqi: 55, temp: 11.2, ndvi: 0.48, tempChange: 1.0 },
            2021: { aqi: 58, temp: 11.5, ndvi: 0.47, tempChange: 1.2 },
            2022: { aqi: 52, temp: 11.9, ndvi: 0.49, tempChange: 1.4 },
            2023: { aqi: 49, temp: 12.3, ndvi: 0.51, tempChange: 1.6 },
            2024: { aqi: 45, temp: 12.6, ndvi: 0.52, tempChange: 1.8 }
        }
    },
    "Tokyo": {
        lat: 35.6762,
        lng: 139.6503,
        data: {
            2020: { aqi: 48, temp: 16.2, ndvi: 0.38, tempChange: 0.9 },
            2021: { aqi: 51, temp: 16.5, ndvi: 0.37, tempChange: 1.1 },
            2022: { aqi: 46, temp: 16.8, ndvi: 0.39, tempChange: 1.3 },
            2023: { aqi: 43, temp: 17.2, ndvi: 0.41, tempChange: 1.5 },
            2024: { aqi: 40, temp: 17.5, ndvi: 0.42, tempChange: 1.7 }
        }
    },
    "Beijing": {
        lat: 39.9042,
        lng: 116.4074,
        data: {
            2020: { aqi: 152, temp: 12.8, ndvi: 0.31, tempChange: 1.3 },
            2021: { aqi: 148, temp: 13.2, ndvi: 0.30, tempChange: 1.6 },
            2022: { aqi: 135, temp: 13.6, ndvi: 0.32, tempChange: 1.8 },
            2023: { aqi: 128, temp: 14.0, ndvi: 0.34, tempChange: 2.0 },
            2024: { aqi: 118, temp: 14.5, ndvi: 0.36, tempChange: 2.3 }
        }
    },
    "Delhi": {
        lat: 28.7041,
        lng: 77.1025,
        data: {
            2020: { aqi: 178, temp: 25.3, ndvi: 0.28, tempChange: 1.5 },
            2021: { aqi: 182, temp: 25.8, ndvi: 0.27, tempChange: 1.8 },
            2022: { aqi: 165, temp: 26.2, ndvi: 0.29, tempChange: 2.1 },
            2023: { aqi: 158, temp: 26.7, ndvi: 0.30, tempChange: 2.4 },
            2024: { aqi: 145, temp: 27.1, ndvi: 0.32, tempChange: 2.7 }
        }
    },
    "São Paulo": {
        lat: -23.5505,
        lng: -46.6333,
        data: {
            2020: { aqi: 76, temp: 20.8, ndvi: 0.44, tempChange: 1.1 },
            2021: { aqi: 79, temp: 21.1, ndvi: 0.43, tempChange: 1.3 },
            2022: { aqi: 72, temp: 21.5, ndvi: 0.45, tempChange: 1.5 },
            2023: { aqi: 68, temp: 21.9, ndvi: 0.47, tempChange: 1.8 },
            2024: { aqi: 63, temp: 22.3, ndvi: 0.49, tempChange: 2.0 }
        }
    },
    "Sydney": {
        lat: -33.8688,
        lng: 151.2093,
        data: {
            2020: { aqi: 42, temp: 18.5, ndvi: 0.52, tempChange: 1.0 },
            2021: { aqi: 45, temp: 18.9, ndvi: 0.51, tempChange: 1.2 },
            2022: { aqi: 39, temp: 19.2, ndvi: 0.53, tempChange: 1.4 },
            2023: { aqi: 36, temp: 19.6, ndvi: 0.55, tempChange: 1.6 },
            2024: { aqi: 32, temp: 20.0, ndvi: 0.57, tempChange: 1.8 }
        }
    },
    "Paris": {
        lat: 48.8566,
        lng: 2.3522,
        data: {
            2020: { aqi: 62, temp: 12.5, ndvi: 0.46, tempChange: 1.0 },
            2021: { aqi: 65, temp: 12.8, ndvi: 0.45, tempChange: 1.2 },
            2022: { aqi: 58, temp: 13.2, ndvi: 0.47, tempChange: 1.4 },
            2023: { aqi: 54, temp: 13.6, ndvi: 0.49, tempChange: 1.6 },
            2024: { aqi: 50, temp: 14.0, ndvi: 0.51, tempChange: 1.9 }
        }
    },
    "Dubai": {
        lat: 25.2048,
        lng: 55.2708,
        data: {
            2020: { aqi: 95, temp: 27.8, ndvi: 0.15, tempChange: 1.8 },
            2021: { aqi: 98, temp: 28.3, ndvi: 0.14, tempChange: 2.1 },
            2022: { aqi: 88, temp: 28.8, ndvi: 0.16, tempChange: 2.4 },
            2023: { aqi: 82, temp: 29.3, ndvi: 0.18, tempChange: 2.7 },
            2024: { aqi: 75, temp: 29.8, ndvi: 0.20, tempChange: 3.0 }
        }
    }
};

function getAQIColor(aqi) {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#fbbf24';
    if (aqi <= 150) return '#f59e0b';
    if (aqi <= 200) return '#ef4444';
    return '#991b1b';
}

function getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
}

function getNDVIPercentage(ndvi) {
    return Math.round(ndvi * 100);
}

function getNDVIColor(ndvi) {
    if (ndvi >= 0.5) return '#10b981';
    if (ndvi >= 0.4) return '#34d399';
    if (ndvi >= 0.3) return '#fbbf24';
    if (ndvi >= 0.2) return '#f59e0b';
    return '#ef4444';
}

function getTempColor(tempChange) {
    if (tempChange >= 2.5) return '#991b1b';
    if (tempChange >= 2.0) return '#ef4444';
    if (tempChange >= 1.5) return '#f59e0b';
    if (tempChange >= 1.0) return '#fbbf24';
    return '#10b981';
}
