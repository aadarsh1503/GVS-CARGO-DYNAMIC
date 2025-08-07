require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contentRoutes = require('./src/routes/contentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const db = require('./src/config/db'); // import DB connection

const app = express();

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(helmet());
app.use(express.json());

// --- API Routes ---
app.use('/api', contentRoutes);
app.use('/api/admin', adminRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// --- Connect to MySQL and Start Server ---
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected');
    conn.release(); // release the connection back to pool

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); 
  }
})();
