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
router.get('/detect-region', async (req, res) => { // Assuming it's in a router file
  try {
    res.setHeader('Cache-Control', 'no-store'); // Good practice

    const ip = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;
    const finalIp = (ip === '::1' || ip === '127.0.0.1') ? '177.54.157.16' : ip; // Use Brazil IP for testing

    const response = await axios.get(`http://ip-api.com/json/${finalIp}`);
    const geoData = response.data;

    if (geoData.status === 'success') {
      const countryName = geoData.country;

      // Find a region in your DB that matches the detected country name.
      // This assumes your region 'name' field is the full country name, e.g., "Brazil".
      // Use a case-insensitive regex for better matching.
      const matchedRegion = await Region.findOne({ name: new RegExp('^' + countryName + '$', 'i') });

      res.json({
        ip: finalIp,
        countryCode: geoData.countryCode,
        country: geoData.country,
        // NEW: Return the matched region code, or a fallback of 'bahrain'
        matchedRegionCode: matchedRegion ? matchedRegion.code : 'bahrain' 
      });

    } else {
      // If IP lookup fails, default to Bahrain
      res.status(404).json({ ip: finalIp, error: 'Could not determine location.', matchedRegionCode: 'bahrain' });
    }
  } catch (error) {
    console.error('Error in /detect-region:', error.message);
    res.status(500).json({ error: 'Server error during region detection.', matchedRegionCode: 'bahrain' });
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