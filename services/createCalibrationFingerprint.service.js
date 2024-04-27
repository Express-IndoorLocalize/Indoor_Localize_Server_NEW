const {getAccessPointsByID,addMultipleAccessPoints} = require('../controllers/accessPoint.controller')
const {createFingerprintFromRequest} = require('../controllers/calibrationFingerPrint.controller')
const {createCalibrationPoint} = require('../controllers/calibrationPoint.controllers')

const createCalibrationFingerprint = async (req,res) => {
    try{
        const projectId = req.body.projectId;
        const received_signals = req.body.received_signals
        await createNonExistingAccessPoints(received_signals,projectId)
        await createFingerprintFromRequest(req.body)
        await createCalibrationPoint(req.body)
        
        res.status(200).json({message:"Calibration fingerprint created successfully"})

    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const updateRadioMap = async (projectID) => {
    // TODO : IMPLEMENT THIS AND THE REST
}

const createNonExistingAccessPoints = async (accessPoints,projectId) => {
    const accessPointsInDatabase = await getAccessPointsByID(projectId)
    const accessPointsInDatabaseBSSIDs = accessPointsInDatabase.map(
        (ap) => ap.bssid
    );
    const newAccessPoints  = accessPoints.filter((ap) => !accessPointsInDatabaseBSSIDs.includes(ap.bssid));
    await addMultipleAccessPoints(newAccessPoints,projectId)
}

module.exports = {
    createCalibrationFingerprint
}