import { useEffect, useState } from 'react';
import { getExpenses } from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const totalIncome = expenses
    .filter((e) => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredExpenses = expenses
    .filter((e) => (filterType === 'all' ? true : e.type === filterType))
    .filter((e) =>
      search.trim() === ''
        ? true
        : e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.category.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
      </div>

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

      <ExpenseForm onAdded={loadExpenses} />

      <div className="expense-filters">
        <input
          type="text"
          placeholder="Search by title or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="expense-search"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="expense-type-filter"
        >
          <option value="all">All</option>
          <option value="Expense">Expenses only</option>
          <option value="Income">Income only</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExpenseList expenses={filteredExpenses} onChange={loadExpenses} />
      )}
    </div>
  );
}