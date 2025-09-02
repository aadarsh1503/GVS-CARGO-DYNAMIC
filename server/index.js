// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const geoip = require('geoip-lite'); // No longer needed for this route
const axios = require('axios'); // <-- ADD THIS

const db = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

const contentRoutes = require('./src/routes/contentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const excelRoutes = require('./src/routes/excelRoutes');   

// const dotenv = require('dotenv'); // This is redundant, require('dotenv').config() is enough
const app = express();
// dotenv.config(); // This is also redundant

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gvs-cargo-dynamic.vercel.app',
    'https://gvscargo.com',
    'https://cargo-new-ui.vercel.app',
    'https://cargo-backend-black.vercel.app',
    'https://gvs-bahrain-pa25.vercel.app',
    'https://duplicate-cargo-qd4w.vercel.app'
  ],
  credentials: true 
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- API Routes ---
app.use('/api', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/excels', excelRoutes);

// -----------------

// --- NEW AND IMPROVED /api/detect-region ROUTE ---
app.get('/api/detect-region', async (req, res) => {
  try {
    // Get the client's IP. For local development ('::1' or '127.0.0.1'), use a public IP for testing.
    // Express's `req.ip` might be unreliable behind proxies. `req.headers['x-forwarded-for']` is often better.
    const ip = req.headers['x-forwarded-for']?.split(',').shift() 
               || req.socket.remoteAddress 
               || '202.83.21.11'; // Fallback for localhost
    
    // Handle localhost explicitly
    const finalIp = (ip === '::1' || ip === '127.0.0.1') ? '202.83.21.11' : ip;

    // Make a request to the third-party API
    const response = await axios.get(`http://ip-api.com/json/${finalIp}`);

    const geoData = response.data;

    // Check if the API call was successful
    if (geoData.status === 'success') {
      res.json({
        ip: finalIp,
        countryCode: geoData.countryCode,
        country: geoData.country,
        region: geoData.regionName,
        city: geoData.city,
        lat: geoData.lat,
        lon: geoData.lon,
        timezone: geoData.timezone,
        isp: geoData.isp
      });
    } else {
      // The API returned a 'fail' status (e.g., for a private IP)
      res.status(404).json({ ip: finalIp, error: 'Could not determine location from the API.' });
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching geolocation data.' });
  }
});
// --- END OF NEW ROUTE ---


app.get('/', (req, res) => {
    res.send('GVS Cargo Merged API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1); 
  }
})();