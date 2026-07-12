const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Force a reliable DNS resolver for Atlas SRV lookups (Node's c-ares resolver
// can fail with querySrv ECONNREFUSED when the system DNS is IPv6-only).
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const applianceRoutes = require('./routes/applianceRoutes');
const usageRoutes = require('./routes/usageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://smart-watts-psi.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/appliances', authMiddleware, applianceRoutes);
app.use('/api/usage', authMiddleware, usageRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'SmartWatts API', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SmartWatts API running on port ${PORT}`);
  });
});
