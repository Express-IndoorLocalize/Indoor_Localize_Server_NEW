const calibrationPoint = require('../models/calibrationPoint.model')
const { v4: uuidv4 } = require('uuid');


const getCalibrationPointsByID = async (projectID) => {
    try{
        const calibrationPoints = await calibrationPoint.find({projectId:projectID}).exec();
        return calibrationPoints;
    }catch(err){
        console.error(err)
    }
}

const createCalibrationPoint = async (reqBody) => {
    const receivedSignals= reqBody.received_signals
    try{
        const cpToadd = new calibrationPoint({
            projectId : reqBody.projectId,
            name : `calibration_point${uuidv4()}`,
            position: {x:reqBody.position.x,
                       y:reqBody.position.y,
                       floor : reqBody.position.floor
                      },
            radioMap : {}
        })
        receivedSignals.forEach((signal) => {
            cpToadd.radioMap.set(signal.bssid, signal.rss)
        })
        await cpToadd.save()
        console.log("Saved Calibration Point");
    }catch(err){
        console.error(err)
    }
}

const addMaps = async() =>{
    console.log("ADDING")
    try{
        const c3 = new calibrationPoint({
            projectId:"3",
            name:"Calibration Point 7",
            position:{x:"13",y:"23",floor:"1"},
            radioMap:{}
})
        c3.radioMap.set('12:344:45336',5)
        c3.radioMap.set('12:344:456',3)
        c3.radioMap.set('12:344:4546',3)
        c3.radioMap.set('12:344:4526',102)
        c3.radioMap.set('12:344:4546',15)
        

        await c3.save()
        console.log("SUCEESSS")
    }catch(err){
        console.error("DD",err)
    }

}

module.exports = {
    getCalibrationPointsByID,
    addMaps,
    createCalibrationPoint
}