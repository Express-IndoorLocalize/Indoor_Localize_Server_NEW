const { v4: uuidv4 } = require('uuid');
const calibrationFingerPrint = require('../models/calibrationFingerPrint.model')

const getCalibrationFingerPrintByID = async (projectID) => {
    try{
        const calibrationFingerPrints = await calibrationFingerPrint.find({projectId:projectID}).exec();
        return calibrationFingerPrints;
    }catch(err){
        console.error(err)
    }
}


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

const updateFingerprintByID = async (fingerPrintID,updatedFields) => {
    try {
        const fingerprint = await calibrationFingerPrint.findByIdAndUpdate(fingerPrintID, updatedFields, { new: true });
        return fingerprint;
    } catch (error) {
        console.error("Error updating fingerprint:", error);
        throw error;
    }
}

module.exports = {
    createFingerprintFromRequest,
    getCalibrationFingerPrintByID,
    updateFingerprintByID
}