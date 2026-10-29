import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="app-navbar">
      <div className="navbar-brand">Expense Tracker</div>
      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/budgets"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Budgets
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Expenses
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{user.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}