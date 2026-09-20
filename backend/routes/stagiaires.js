const express = require('express');
const router = express.Router();
const { 
  getStagiaires, 
  getStagiaire, 
  createStagiaire, 
  updateStagiaire, 
  deleteStagiaire,
  getDashboardStats 
} = require('../controllers/stagiaireController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/', protect, getStagiaires);
router.get('/:id', protect, getStagiaire);
router.post('/', protect, createStagiaire);
router.put('/:id', protect, updateStagiaire);
router.delete('/:id', protect, adminOnly, deleteStagiaire);

module.exports = router;