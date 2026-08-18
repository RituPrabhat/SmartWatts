const express = require('express');
const router = express.Router();
const { logUsage, getWeeklyTrend } = require('../controllers/usageController');

router.post('/', logUsage);
router.get('/weekly-trend', getWeeklyTrend);

module.exports = router;
