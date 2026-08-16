const DELHI_TARIFF = {
  slabs: [
    { upto: 200, rate: 3 },
    { upto: 400, rate: 4.5 },
    { upto: 800, rate: 6.5 },
    { upto: Infinity, rate: 8 },
  ],

  subsidy: {
    upto200: 1,
    upto400: 0.5,
    upto400Cap: 800,
  },
};

module.exports = DELHI_TARIFF;