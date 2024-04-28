const {getAccessPointsByID,addMultipleAccessPoints} = require('../controllers/accessPoint.controller')
const {createFingerprintFromRequest,getCalibrationFingerPrintByID,updateFingerprintByID} = require('../controllers/calibrationFingerPrint.controller')
const {createCalibrationPoint,getCalibrationPointsByID,updateCalibrationPointByID} = require('../controllers/calibrationPoint.controllers')
const {rssNotReceived} = require('../constants')

const createCalibrationFingerprint = async (req,res) => {
    try{
        const projectId = req.body.projectId;
        const received_signals = req.body.received_signals
        await createNonExistingAccessPoints(received_signals,projectId)
        await createFingerprintFromRequest(req.body)
        await createCalibrationPoint(req.body)
        await updateRadioMap(projectId)
        res.status(200).json({message:"Calibration fingerprint created successfully"})

    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const updateRadioMap = async (projectID) => {
    const databaseAccessPoints = await getAccessPointsByID(projectID)
    const databaseFingerPrints = await getCalibrationFingerPrintByID(projectID)
    const databaseCalibrationPoints = await getCalibrationPointsByID(projectID)

    // const accessPointBSSIDs = databaseAccessPoints.map((ap) => ap.bssid)
    for (const fingerprint of databaseFingerPrints) {
        const radioMap = new Map(fingerprint.radioMap);
        for (const accessPoint of databaseAccessPoints) {
            if (!radioMap.has(accessPoint.bssid)) {
                radioMap.set(accessPoint.bssid,rssNotReceived); // Set RSS value to -5000
            }
        }
        console.log(radioMap);
        await updateFingerprintByID(fingerprint._id,  { radioMap: Array.from(radioMap.entries()) });
    }

    for (const calibrationPoint of databaseCalibrationPoints) {
        for (const accessPoint of databaseAccessPoints) {
            if (!calibrationPoint.radioMap.has(accessPoint.bssid)) {
                calibrationPoint.radioMap.set(accessPoint.bssid,rssNotReceived);; // Set RSS value to -5000
            }
        }
        await updateCalibrationPointByID(calibrationPoint._id, { radioMap: calibrationPoint.radioMap });
    }



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