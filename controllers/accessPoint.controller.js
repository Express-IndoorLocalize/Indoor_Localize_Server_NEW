const accessPoint = require('../models/accessPoint.model')

const getAccessPointsByID = async (projectID) => {
    try{
        const accessPoints = await accessPoint.find({projectId:projectID}).exec();
        return accessPoints;
    }catch(err){
        console.error(err)
    }
}

const addMultipleAccessPoints = async(accessPointArray,projectID) => {
    const accessPointsToAdd = accessPointArray.map(element => ({
        ...element,
        projectId : projectID
    }))
    await accessPoint.insertMany(accessPointsToAdd)
}

module.exports = {
    getAccessPointsByID,
    addMultipleAccessPoints
}