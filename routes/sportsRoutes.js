const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');

router.post('/', sportsController.createSport);
router.get('/', sportsController.getAllSports);
router.put('/:id', sportsController.updateSportPrice);
router.delete('/:id', sportsController.deleteSport);

module.exports = router;
