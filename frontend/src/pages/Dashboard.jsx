import { getBudgets, setBudget, getAlerts } from '../services/budgetService';
import AlertBanner from '../components/AlertBanner';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses } from '../services/expenseService';
import BudgetCard from '../components/BudgetCard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const totalIncome = expenses
    .filter((e) => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpense;

  const loadData = async () => {
    setLoading(true);
    try {
      const [budgetRes, expenseRes, alertRes] = await Promise.all([
        getBudgets(month, year),
        getExpenses(),
        getAlerts(month, year),
      ]);
      setBudgets(budgetRes.data);
      setExpenses(expenseRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    try {
      await setBudget({ category, limit: Number(limit), month, year });
      setCategory('');
      setLimit('');
      loadData();
    } catch (err) {
      setError('Failed to save budget');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <AlertBanner alerts={alerts} />

      <div className={`balance-summary ${balance < 0 ? 'negative' : 'positive'}`}>
        <div className="balance-summary-item">
          <span className="balance-label">Total Income</span>
          <span className="balance-value income">₹{totalIncome}</span>
        </div>
        <div className="balance-summary-item">
          <span className="balance-label">Total Expenses</span>
          <span className="balance-value expense">₹{totalExpense}</span>
        </div>
        <div className="balance-summary-item">
          <span className="balance-label">Balance</span>
          <span className="balance-value">
            {balance >= 0 ? `₹${balance} left` : `₹${Math.abs(balance)} overspent`}
          </span>
        </div>
      </div>

      <h2>Budgets</h2>
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

      <h2 className="section-spacer">Expenses</h2>
      <ExpenseForm onAdded={loadData} />
      {!loading && <ExpenseList expenses={expenses} onChange={loadData} />}
    </div>
  );
}