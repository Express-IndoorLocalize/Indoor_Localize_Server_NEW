const express = require('express')
const router = express.Router()
const {addGraph} = require('../controllers/mapGraph.controller')
const {getPath} = require('../services/navigation.service')

router.post('/add_graph',addGraph);
router.post('/get_path',getPath)

module.exports = router;