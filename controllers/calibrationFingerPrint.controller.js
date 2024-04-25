const { v4: uuidv4 } = require('uuid');
const calibrationFingerPrint = require('../models/calibrationFingerPrint.model')

const createFingerprintFromRequest = async (reqBody) => {
    const receivedSignals= reqBody.received_signals

    const calibrationFingerPrintToCreate = new calibrationFingerPrint({
        id:uuidv4(),
        projectId : reqBody.projectId,
        calibrationPointId : reqBody.calibrationpointID,
        radioMap : {}
    })
    
    receivedSignals.forEach((signal) => {
        calibrationFingerPrintToCreate.radioMap.set(signal.bssid, signal.rss)
    })
    
    await calibrationFingerPrintToCreate.save()
}


module.exports = {
    createFingerprintFromRequest
}