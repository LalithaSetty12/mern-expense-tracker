export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-banner">
      <div className="alert-banner-icon">!</div>
      <div className="alert-banner-content">
        <strong>
          {alerts.length === 1
            ? '1 budget is over its limit'
            : `${alerts.length} budgets are over their limits`}
        </strong>
        <div className="alert-banner-list">
          {alerts.map((a) => (
            <span key={a._id} className="alert-chip">
              {a.category} — over by ₹{Math.abs(a.remaining)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}