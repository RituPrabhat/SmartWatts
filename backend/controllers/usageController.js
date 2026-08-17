const mongoose = require("mongoose");
const UsageLog = require("../models/UsageLog");
const Appliance = require("../models/Appliance");
const User = require("../models/User");
const {
  calculateWeeklyUnits,
  calculateMonthlyUnits,
  calculateBill,
} = require("../services/calculationService");

async function logUsage(req, res) {
  const [appliances, user] = await Promise.all([
    Appliance.find({ userId: req.user.id }),
    User.findById(req.user.id),
  ]);

  if (appliances.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No appliances to log",
    });
  }

  // Compute the household's blended rate per unit the same way the dashboard
  // does — total monthly units run through the slab tariff once — so a
  // single appliance's small weekly total isn't mistakenly priced as if it
  // were the entire household's monthly consumption.
  const totalMonthlyUnits = appliances.reduce(
    (sum, app) =>
      sum + calculateMonthlyUnits(app.watts, app.hoursPerDay, app.daysPerWeek),
    0
  );
  const householdBill = calculateBill(totalMonthlyUnits, Boolean(user?.hasSubsidy));
  const ratePerUnit =
    totalMonthlyUnits > 0 ? householdBill.totalBill / totalMonthlyUnits : 0;

  const weekStartDate = getWeekStart(new Date());
  const logs = [];

  for (const app of appliances) {
    const unitsConsumed = calculateWeeklyUnits(
      app.watts,
      app.hoursPerDay,
      app.daysPerWeek
    );

    const cost = unitsConsumed * ratePerUnit;

    const log = await UsageLog.findOneAndUpdate(
      {
        userId: req.user.id,
        appliance: app._id,
        weekStartDate,
      },
      {
        userId: req.user.id,
        appliance: app._id,
        weekStartDate,
        unitsConsumed: Number(unitsConsumed.toFixed(2)),
        cost: Number(cost.toFixed(2)),
      },
      {
        upsert: true,
        new: true,
      }
    );

    logs.push(log);
  }

  res.status(201).json({
    success: true,
    data: logs,
    count: logs.length,
  });
}

async function getUsage(req, res) {
  const { from, to } = req.query;

  const filter = {
    userId: req.user.id,
  };

  if (from) {
    filter.weekStartDate = {
      $gte: new Date(from),
    };
  }

  if (to) {
    filter.weekStartDate = {
      ...filter.weekStartDate,
      $lte: new Date(to),
    };
  }

  const logs = await UsageLog.find(filter)
    .populate("appliance", "name watts")
    .sort({ weekStartDate: -1 });

  res.json({
    success: true,
    data: logs,
  });
}

async function getWeeklyTrend(req, res) {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const sevenWeeksAgo = new Date();
  sevenWeeksAgo.setDate(sevenWeeksAgo.getDate() - 49);

  const logs = await UsageLog.aggregate([
    {
      $match: {
        userId,
        weekStartDate: {
          $gte: sevenWeeksAgo,
        },
      },
    },
    {
      $group: {
        _id: "$weekStartDate",
        totalUnits: {
          $sum: "$unitsConsumed",
        },
        totalCost: {
          $sum: "$cost",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $limit: 7,
    },
  ]);

  if (logs.length === 0) {
    return res.json({
      success: true,
      data: [],
      synthetic: false,
    });
  }

  const trend = logs.map((log) => {
    const d = new Date(log._id);

    return {
      label: d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      date: d.toISOString().split("T")[0],
      usage: Number(log.totalUnits.toFixed(2)),
      target: Number((log.totalUnits * 0.9).toFixed(2)),
    };
  });

  res.json({
    success: true,
    data: trend,
    synthetic: false,
  });
}

function getWeekStart(date) {
  const d = new Date(date);

  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  d.setDate(diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

module.exports = {
  logUsage,
  getUsage,
  getWeeklyTrend,
};