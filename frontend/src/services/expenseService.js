import api from './api';

export const getExpenses = () => api.get('/expense');
export const addExpense = (data) => api.post('/expense', data);
export const deleteExpense = (id) => api.delete(`/expense/${id}`);