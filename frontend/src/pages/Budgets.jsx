import { useEffect, useState } from 'react';
import { getBudgets, setBudget, getAlerts } from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import AlertBanner from '../components/AlertBanner';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const [budgetRes, alertRes] = await Promise.all([
        getBudgets(month, year),
        getAlerts(month, year),
      ]);
      setBudgets(budgetRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    try {
      await setBudget({ category, limit: Number(limit), month, year });
      setCategory('');
      setLimit('');
      loadBudgets();
    } catch (err) {
      setError('Failed to save budget');
    }
  };

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="budgets-page">
      <div className="page-header">
        <h1>Budgets</h1>
        <span className="budget-month-label">
          {now.toLocaleString('default', { month: 'long' })} {year}
        </span>
      </div>

      <AlertBanner alerts={alerts} />

      {budgets.length > 0 && (
        <div className="budget-overview">
          <span>Total budgeted: ₹{totalLimit}</span>
          <span>Total spent: ₹{totalSpent}</span>
          <span>
            {totalLimit - totalSpent >= 0
              ? `₹${totalLimit - totalSpent} remaining overall`
              : `₹${Math.abs(totalLimit - totalSpent)} over overall`}
          </span>
        </div>
      )}

      <form className="add-budget-form" onSubmit={handleAddBudget}>
        <input
          type="text"
          placeholder="Category (e.g. Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monthly limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <button type="submit">Set Budget</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : budgets.length === 0 ? (
        <p>No budgets set for this month yet.</p>
      ) : (
        <div className="budget-grid">
          {budgets.map((b) => (
            <BudgetCard key={b._id} {...b} />
          ))}
        </div>
      )}
    </div>
  );
}