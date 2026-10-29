import { useState } from 'react';
import { addExpense } from '../services/expenseService';

function getNextDate(startDate, recurrence) {
  const next = new Date(startDate);
  if (recurrence === 'daily') next.setDate(next.getDate() + 1);
  if (recurrence === 'weekly') next.setDate(next.getDate() + 7);
  if (recurrence === 'monthly') next.setMonth(next.getMonth() + 1);
  return next;
}

export default function ExpenseForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Expense');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState('monthly');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    setError('');

    const now = new Date();

    try {
      await addExpense({
        title,
        amount: Number(amount),
        category,
        type,
        date: now.toISOString(),
        isRecurring,
        recurrence: isRecurring ? recurrence : 'none',
        nextDueDate: isRecurring ? getNextDate(now, recurrence) : null,
      });
      setTitle('');
      setAmount('');
      setCategory('');
      setIsRecurring(false);
      setRecurrence('monthly');
      onAdded();
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  return (
    <form className="expense-form-wrapper" onSubmit={handleSubmit}>
      <div className="expense-form">
        <input
          type="text"
          placeholder="Title (e.g. Lunch)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g. Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <button type="submit">Add</button>
      </div>

      <div className="recurring-row">
        <label className="recurring-checkbox">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Make this recurring
        </label>

        {isRecurring && (
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="recurrence-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </form>
  );
}