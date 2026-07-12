/**
 * SmartWatts Calculation Service
 *
 * Core business logic for electricity consumption calculations.
 */

const tariff = require("./tariffService");

const WEEKS_PER_MONTH = 4;

/**
 * Calculate monthly units consumed by a single appliance
 */
function calculateMonthlyUnits(watts, hoursPerDay, daysPerWeek) {
  return (watts * hoursPerDay * daysPerWeek * WEEKS_PER_MONTH) / 1000;
}

/**
 * Calculate weekly units consumed by a single appliance
 */
function calculateWeeklyUnits(watts, hoursPerDay, daysPerWeek) {
  return (watts * hoursPerDay * daysPerWeek) / 1000;
}

/**
 * Calculate household electricity bill using slab rates
 */
function calculateBill(units, subsidyEligible = true) {
  let remaining = units;
  let energyCharge = 0;
  let previous = 0;

  for (const slab of tariff.slabs) {
    if (remaining <= 0) break;

    const slabUnits = Math.min(remaining, slab.upto - previous);

    energyCharge += slabUnits * slab.rate;

    remaining -= slabUnits;
    previous = slab.upto;
  }

  let subsidy = 0;

  if (subsidyEligible) {
    if (units <= 200) {
      subsidy = energyCharge * tariff.subsidy.upto200;
    } else if (units <= 400) {
      subsidy = energyCharge * tariff.subsidy.upto400;
    }
  }

  return {
    units: Number(units.toFixed(2)),
    energyCharge: Number(energyCharge.toFixed(2)),
    subsidy: Number(subsidy.toFixed(2)),
    totalBill: Number((energyCharge - subsidy).toFixed(2)),
  };
}

/**
 * Calculate estimated savings by reducing the highest-consuming appliance
 * by 1 hour/day.
 */
function calculateSavings(topAppliance, totalUnits) {
  if (!topAppliance) {
    return {
      units: 0,
      amount: 0,
      tip: "",
    };
  }

  const savedUnits = calculateMonthlyUnits(
    topAppliance.watts,
    1,
    topAppliance.daysPerWeek
  );

  const currentBill = calculateBill(totalUnits).totalBill;

  const reducedBill = calculateBill(
    Math.max(0, totalUnits - savedUnits)
  ).totalBill;

  const savedAmount = currentBill - reducedBill;

  return {
    units: Number(savedUnits.toFixed(2)),
    amount: Number(savedAmount.toFixed(2)),
    tip: `Reduce ${topAppliance.name} usage by 1 hour/day to save approximately ₹${Math.round(savedAmount)}/month`,
  };
}

/**
 * Build complete dashboard data
 */
function buildDashboardData(appliances) {
  const breakdown = appliances.map((app) => {
    const monthlyUnits = calculateMonthlyUnits(
      app.watts,
      app.hoursPerDay,
      app.daysPerWeek
    );

    return {
      _id: app._id,
      name: app.name,
      watts: app.watts,
      hoursPerDay: app.hoursPerDay,
      daysPerWeek: app.daysPerWeek,
      status: app.status,
      monthlyUnits: Number(monthlyUnits.toFixed(2)),
    };
  });

  const totalUnits = breakdown.reduce(
    (sum, item) => sum + item.monthlyUnits,
    0
  );

  const bill = calculateBill(totalUnits);

  breakdown.forEach((item) => {
    item.percentage =
      totalUnits > 0
        ? Math.round((item.monthlyUnits / totalUnits) * 100)
        : 0;
  });

  const sorted = [...breakdown].sort(
    (a, b) => b.monthlyUnits - a.monthlyUnits
  );

  const topAppliance = sorted[0] || null;

  const topApplianceRaw = appliances.find(
    (a) =>
      topAppliance &&
      a._id.toString() === topAppliance._id.toString()
  );

  const savings = calculateSavings(topApplianceRaw, totalUnits);

  return {
    totalUnits: Number(totalUnits.toFixed(2)),

    totalBill: bill.totalBill,

    billDetails: bill,

    activeDevices: appliances.filter(
      (a) => a.status === "active"
    ).length,

    totalDevices: appliances.length,

    topAppliance: topAppliance
      ? {
          name: topAppliance.name,
          monthlyUnits: topAppliance.monthlyUnits,
          percentage: topAppliance.percentage,
        }
      : null,

    savings,

    breakdown,
  };
}

module.exports = {
  calculateMonthlyUnits,
  calculateWeeklyUnits,
  calculateBill,
  calculateSavings,
  buildDashboardData,
};