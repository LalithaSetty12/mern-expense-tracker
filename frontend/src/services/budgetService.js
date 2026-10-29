import api from './api';

export const getBudgets = (month, year) =>
  api.get(`/budget?month=${month}&year=${year}`);

export const setBudget = (data) => api.post('/budget', data);
export const getAlerts = (month, year) =>
  api.get(`/budget/alerts?month=${month}&year=${year}`);