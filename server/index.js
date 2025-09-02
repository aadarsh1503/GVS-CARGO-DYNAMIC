require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const geoip = require('geoip-lite');


const db = require('./src/config/db');


const errorHandler = require('./src/middleware/errorHandler');


const contentRoutes = require('./src/routes/contentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const excelRoutes = require('./src/routes/excelRoutes');   
const dotenv = require('dotenv');
const app = express();
app.set('trust proxy', true);
dotenv.config();

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

// app.set('trust proxy', true); set karne ke baad, is code mein koi badlav ki zaroorat nahi hai.
// Yeh ab deployment par sahi kaam karega.

app.get('/api/detect-region', (req, res) => {
  // Deployment par: req.ip ab aapka Singapore wala IP hoga.
  // Local machine par: req.ip ab भी '::1' hoga.
  const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '202.83.21.11' : req.ip; 
  
  const geo = geoip.lookup(ip);
  if (geo) {
      // Jab aap VPN se request karenge, to yahan Singapore ki details aayengi.
      res.json({ ip, countryCode: geo.country, region: geo.region, city: geo.city });
  } else {
      res.status(404).json({ ip, error: 'Could not determine location.' });
  }
});


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