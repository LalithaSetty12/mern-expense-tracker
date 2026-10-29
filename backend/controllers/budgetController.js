const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// Set or update a budget for a category+month
exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;
    const normalizedCategory = category.trim().toLowerCase();

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category: normalizedCategory, month, year },
      { limit, category: normalizedCategory },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all budgets for a given month/year, with current spend calculated
exports.getBudgets = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({ user: req.userId, month, year });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const results = await Promise.all(
      budgets.map(async (b) => {
        const spent = await Expense.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.userId),
              category: b.category,
              type: 'Expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const totalSpent = spent[0]?.total || 0;

        return {
          _id: b._id,
          category: b.category,
          limit: b.limit,
          spent: totalSpent,
          remaining: b.limit - totalSpent,
          exceeded: totalSpent > b.limit,
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Active alerts: budgets currently exceeded
exports.getAlerts = async (req, res) => {
  try {
    req.query.month = req.query.month || (new Date().getMonth() + 1);
    req.query.year = req.query.year || new Date().getFullYear();

    // Reuse getBudgets logic
    const fakeRes = {
      json: (data) => {
        const alerts = data.filter((b) => b.exceeded);
        res.json(alerts);
      },
      status: () => fakeRes,
    };

    await exports.getBudgets(req, fakeRes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};