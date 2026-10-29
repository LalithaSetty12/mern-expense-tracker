const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { setBudget, getBudgets, getAlerts } = require('../controllers/budgetController');

router.post('/', auth, setBudget);
router.get('/', auth, getBudgets);
router.get('/alerts', auth, getAlerts);

module.exports = router;