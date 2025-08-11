require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contentRoutes = require('./src/routes/contentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const db = require('./src/config/db');
const geoip = require('geoip-lite');
const app = express();

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gvs-cargo-dynamic.vercel.app'
  ],
  credentials: true 
}));
app.use(helmet());
app.use(express.json());

// --- API Routes ---
app.use('/api', contentRoutes);
app.use('/api/admin', adminRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get('/api/detect-region', (req, res) => {

  const ip = req.ip;

 
  const testIp = ip === '::1' || ip === '127.0.0.1' ? '202.83.21.11' : ip; 

  const geo = geoip.lookup(testIp);

  if (geo) {
   
      res.json({
          ip: testIp,
          countryCode: geo.country, // e.g., 'IN', 'BH', 'AE'
          region: geo.region,       // e.g., 'MH' for Maharashtra
          city: geo.city,
      });
  } else {

      res.status(404).json({
          ip: testIp,
          error: 'Could not determine location for this IP address.',
      });
  }
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected');
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); 
  }
})();
