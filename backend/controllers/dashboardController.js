const Appliance = require('../models/Appliance');
const User = require('../models/User');
const { buildDashboardData } = require('../services/calculationService');

async function getDashboard(req, res) {
  const [appliances, user] = await Promise.all([
    Appliance.find({ userId: req.user.id }),
    User.findById(req.user.id),
  ]);
  const dashboard = buildDashboardData(appliances, Boolean(user?.hasSubsidy));

  res.json({ success: true, data: dashboard });
}

module.exports = { getDashboard };
