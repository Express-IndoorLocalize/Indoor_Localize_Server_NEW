const express = require('express')
const router = express.Router()
const {calculatePosition} = require('../services/calculatePosition.service')

const {addMaps} = require('../controllers/calibrationPoint.controllers')

router.post('/calculate_position',calculatePosition);
router.get('/',addMaps);

module.exports = router;