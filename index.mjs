import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch'; 

const app = express();

const PORT = process.env.PORT || 5500;
const AIRNOW_API_KEY = process.env.AIRNOW_API_KEY;
const DEFAULT_ZIP_CODE = '60606';

app.use(express.json());

async function getAirQualityData(zipCode) {
    if (!AIRNOW_API_KEY) {
        throw new Error('Server Misconfiguration: AIRNOW_API_KEY is missing.');
    }

    const apiUrl = `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${AIRNOW_API_KEY}`;
    
    console.log(`Attempting fetch for zip code: ${zipCode}`);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        const statusCode = typeof response.status === 'number' && response.status > 0 
                           ? response.status 
                           : 502; 

        const errorText = await response.text();
        
        console.error(`External API error: Status ${statusCode}, Body: ${errorText.substring(0, 100)}...`);
        
        throw new Error(`External API failed for ${zipCode}. Status: ${statusCode}`);
    }
    
    const data = await response.json();
    return data;
}

app.get('/', async (req, res) => {
    try {
       
        const airQualityData = await getAirQualityData(DEFAULT_ZIP_CODE);

        console.log(`[ROUTE /] Retrieved Data for ${DEFAULT_ZIP_CODE}:`, airQualityData);

        res.json(airQualityData); 

    } catch (error) {

        console.error('Error in root route:', error.message);
        const statusCode = parseInt(error.message.match(/Status: (\d+)/)?.[1] || 500, 10);
        res.status(statusCode).json({ error: error.message });
    }
});

app.get('/air-quality/:zipCode', async (req, res) => {
    const { zipCode } = req.params;
    
    if (!zipCode || zipCode.length !== 5 || isNaN(zipCode)) {
         return res.status(400).json({ error: 'Invalid 5-digit zip code format provided.' });
    }

    try {
       
        const airQualityData = await getAirQualityData(zipCode);
        
        console.log(`[ROUTE /air-quality/:zipCode] Retrieved Data for ${zipCode}:`, airQualityData);

        res.json(airQualityData);

    } catch (error) {
       
        console.error(`Error in /air-quality/${zipCode}:`, error.message);
    
        const statusCode = parseInt(error.message.match(/Status: (\d+)/)?.[1] || 500, 10);
        res.status(statusCode).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test root route (defaults to ${DEFAULT_ZIP_CODE}): http://localhost:${PORT}/`);
});
