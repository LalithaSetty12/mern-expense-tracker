const Expense = require('../models/Expense');

// Create a new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category: category.trim().toLowerCase(),
      type: type || 'Expense',
      date: date || Date.now(),
      note,
      user: req.userId,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.category) {
      updateData.category = updateData.category.trim().toLowerCase();
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};