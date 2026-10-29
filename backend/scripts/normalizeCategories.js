// One-time migration: lowercase + trim all existing category values
// Run with: node scripts/normalizeCategories.js

try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed; assume env vars are already set another way
}

const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Check your .env file and the variable name it uses.');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const expenses = await Expense.find({});
  let expenseCount = 0;
  for (const exp of expenses) {
    const normalized = exp.category.trim().toLowerCase();
    if (normalized !== exp.category) {
      exp.category = normalized;
      await exp.save();
      expenseCount++;
    }
  }
  console.log(`Normalized ${expenseCount} expense categories`);

  const budgets = await Budget.find({});
  let budgetCount = 0;
  for (const b of budgets) {
    const normalized = b.category.trim().toLowerCase();
    if (normalized !== b.category) {
      b.category = normalized;
      await b.save();
      budgetCount++;
    }
  }
  console.log(`Normalized ${budgetCount} budget categories`);

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});