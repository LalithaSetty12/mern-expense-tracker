import { deleteExpense } from '../services/expenseService';

export default function ExpenseList({ expenses, onChange }) {
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      onChange();
    } catch (err) {
      console.error('Failed to delete expense');
    }
  };

  if (expenses.length === 0) {
    return <p>No expenses yet. Add one above.</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((exp) => (
        <div key={exp._id} className="expense-row">
          <div className="expense-info">
            <span className="expense-title">
              {exp.title}
              {exp.isRecurring && (
                <span className="recurring-badge">↻ {exp.recurrence}</span>
              )}
            </span>
            <span className="expense-category">{exp.category}</span>
          </div>
          <span className={`expense-amount ${exp.type === 'Income' ? 'income' : 'expense'}`}>
            {exp.type === 'Income' ? '+' : '-'}₹{exp.amount}
          </span>
          <button className="delete-btn" onClick={() => handleDelete(exp._id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}