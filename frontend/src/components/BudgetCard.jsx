export default function BudgetCard({ category, limit, spent, remaining, exceeded }) {
  const percent = Math.min((spent / limit) * 100, 100);

  return (
    <div className={`budget-card ${exceeded ? 'exceeded' : ''}`}>
      <div className="budget-card-header">
        <span className="budget-category">{category}</span>
        {exceeded && <span className="budget-warning">Over budget</span>}
      </div>
      <div className="budget-bar-track">
        <div
          className="budget-bar-fill"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="budget-numbers">
        <span>₹{spent} spent</span>
        <span>₹{limit} limit</span>
      </div>
      <div className="budget-remaining">
        {remaining >= 0
          ? `₹${remaining} remaining`
          : `₹${Math.abs(remaining)} over`}
      </div>
    </div>
  );
}