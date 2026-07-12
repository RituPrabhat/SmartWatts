const DELHI_TARIFF = {
  slabs: [
    { upto: 200, rate: 3 },
    { upto: 400, rate: 4.5 },
    { upto: 800, rate: 6.5 },
    { upto: Infinity, rate: 7 },
  ],

  subsidy: {
    upto200: 1,
    upto400: 0.5,
  },
};

module.exports = DELHI_TARIFF;