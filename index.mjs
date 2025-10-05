import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch'; 

const app = express();

const PORT = process.env.PORT || 5500;
const AIRNOW_API_KEY = process.env.AIRNOW_API_KEY;
const DEFAULT_ZIP_CODE = '60606';

app.use(express.json());

// NOTE: We use hardcoded coordinates for the Weather.gov API based on the DEFAULT_ZIP_CODE.
const DEFAULT_COORDINATES = {
    // Coordinates for Chicago (60606)
    lat: '41.8781',
    lon: '-87.6298',
};

// Weather.gov requires a mandatory User-Agent header
const WEATHER_HEADERS = {
    // IMPORTANT: Replace contact@example.com with your actual email address
    'User-Agent': '(Urban-Sky-App, contact@example.com)'
};

/**
 * Throws a clean error object for API failures, logging the details.
 */
async function handleApiError(response, apiName, identifier) {
    const statusCode = typeof response.status === 'number' && response.status > 0 
        ? response.status 
        : 502; // Default to Bad Gateway
    
    const errorText = await response.text();
    
    console.error(`[ERROR] ${apiName} API error: Status ${statusCode}, Identifier: ${identifier}`);
    console.error(`  Response Body Preview: ${errorText.substring(0, 100)}...`);
    
    // Throw error with status embedded for route handler to catch
    throw new Error(`${apiName} API failed for ${identifier}. Status: ${statusCode}`);
}


// --- API Fetching Functions ---

/**
 * Fetches real-time Air Quality Index (AQI) data using a zip code.
 * @param {string} zipCode - The 5-digit zip code.
 * @returns {Promise<Object>} Parsed AirNow JSON data.
 */
async function getAirQualityData(zipCode) {
    if (!AIRNOW_API_KEY) {
        throw new Error('Server Misconfiguration: AIRNOW_API_KEY is missing.');
    }

    // AirNow uses query parameters for the API key and zip code
    const apiUrl = `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${AIRNOW_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        await handleApiError(response, 'AirNow', zipCode);
    }
    
    return await response.json();
}

/**
 * Fetches the weather forecast using the Weather.gov API (two-step process).
 * @param {string} lat - Latitude.
 * @param {string} lon - Longitude.
 * @returns {Promise<Object>} Parsed Weather.gov forecast JSON data.
 */
async function getWeatherForecast(lat, lon) {
    const coords = `${lat},${lon}`;
    
    // 1. Get Grid Points from Lat/Lon
    const pointsUrl = `https://api.weather.gov/points/${coords}`;
    let response = await fetch(pointsUrl, { headers: WEATHER_HEADERS });

    if (!response.ok) {
        await handleApiError(response, 'Weather.gov Points', coords);
    }
    const gridData = await response.json();
    
    const forecastUrl = gridData.properties.forecast;
    
    if (!forecastUrl) {
         throw new Error(`Weather.gov Points API did not provide a forecast URL for ${coords}`);
    }

    // 2. Get Forecast using the URL provided in Step 1
    response = await fetch(forecastUrl, { headers: WEATHER_HEADERS });

    if (!response.ok) {
        await handleApiError(response, 'Weather.gov Forecast', forecastUrl);
    }
    
    return await response.json();
}


// --- Route Handlers ---

// Utility function to centralize the concurrent fetching and response logic
async function fetchAndRespond(zipCode, lat, lon, res) {
    try {
        // Use Promise.all to run both API calls concurrently
        const [airQualityData, weatherForecastData] = await Promise.all([
            getAirQualityData(zipCode),
            getWeatherForecast(lat, lon)
        ]);

        // Consolidate the results into a single object
        const combinedData = {
            query: {
                zipCode: zipCode,
                latitude: lat,
                longitude: lon
            },
            airQuality: airQualityData,
            weatherForecast: weatherForecastData
        };

        // Console Log the final combined JSON data to the terminal
        console.log(`[SUCCESS] Retrieved Combined Data for ${zipCode} (${lat}, ${lon}):`);
        // Log a snippet of the consolidated object for brevity
        console.log(JSON.stringify(combinedData, null, 2).substring(0, 700) + '...');
        console.log('---');

        // Send the consolidated data back to the client
        res.json(combinedData); 

    } catch (error) {
        // Log the internal error message
        console.error('Catch Block Error:', error.message);
        
        // Extract status code from the error message or default to 500
        const statusCodeMatch = error.message.match(/Status: (\d+)/);
        const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1], 10) : 500;
        
        res.status(statusCode).json({ error: error.message });
    }
}


// 1. Root Route Handler (Defaults to a Zip Code and its Coordinates)
app.get('/', (req, res) => {
    const { lat, lon } = DEFAULT_COORDINATES;
    console.log(`\n--- Incoming Request: / (Defaulting to ${DEFAULT_ZIP_CODE}) ---`);
    fetchAndRespond(DEFAULT_ZIP_CODE, lat, lon, res);
});


// 2. Parameterized API Endpoint (Accepts Zip Code, uses default coordinates)
app.get('/air-quality/:zipCode', (req, res) => {
    const { zipCode } = req.params;
    const { lat, lon } = DEFAULT_COORDINATES; // In a real app, you'd geocode this zip code
    
    if (!zipCode || zipCode.length !== 5 || isNaN(zipCode)) {
         return res.status(400).json({ error: 'Invalid 5-digit zip code format provided.' });
    }
    
    console.log(`\n--- Incoming Request: /air-quality/${zipCode} ---`);
    fetchAndRespond(zipCode, lat, lon, res);
});


// Start the server
app.listen(PORT, () => {
    console.log('-----------------------------------------------------------');
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test root route (defaults to ${DEFAULT_ZIP_CODE}): http://localhost:${PORT}/`);
    console.log('-----------------------------------------------------------');
});
