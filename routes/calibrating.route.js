const express = require('express')
const router = express.Router()
const {createCalibrationFingerprint} = require('../services/createCalibrationFingerprint.service')

router.post('/create_fingerprint',createCalibrationFingerprint);

module.exports = router;