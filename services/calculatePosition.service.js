const {getAccessPointsByID} = require('../controllers/accessPoint.controller')
const {getCalibrationPointsByID} = require('../controllers/calibrationPoint.controllers')
const {rssNotReceived} = require('../constants')
const KNN_Model = require('ml-knn')

const calculatePosition = async (req,res) => {
    try{
        const projectId = req.body.projectId;
        const received_signals = req.body.received_signals;

        const accessPointList =await getAccessPointsByID(projectId)
        const initiallyReceivedRSSValues = signalsToMap(received_signals);

        const receivedDatabaseRSSValues = new Map();
        let notReceivedCount = 0;

        accessPointList.forEach((accessPoint)=>{
            if (!initiallyReceivedRSSValues.has(accessPoint.bssid)){
                notReceivedCount++;
                receivedDatabaseRSSValues.set(
                    accessPoint.bssid,
                    rssNotReceived
                );
            }else {
                receivedDatabaseRSSValues.set(
                  accessPoint.bssid,
                  initiallyReceivedRSSValues.get(accessPoint.bssid)
                );
            }
        })
        if (notReceivedCount === accessPointList.length) {
            console.error('No access point in database matches the received signals');
            res.status(400).json({message: 'No access point in database matches the received signals'})
        }else{
            // const fingerPrint = await WKNN_algorithm(
            //     receivedDatabaseRSSValues,
            //     projectId
            // )
            const predictions = await ml_knn(receivedDatabaseRSSValues,projectId)
            const fingerPrint = {
                x : predictions[0][0],
                y : predictions[0][1],
                floor : predictions[0][2],
            }
            console.log(fingerPrint)           
            res.status(200).json({message:fingerPrint})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
}

const signalsToMap = (receivedSignals) => {
    const rssValueMap = new Map();
    receivedSignals.forEach((signal) => {
        rssValueMap.set(signal.bssid, signal.rss);
    });
    return rssValueMap;
}

const calculateEuclideanDistance = (radioMap,receivedRSSValues) => {
    let finalDistance = 0;
    let tempValueOne;
    let tempValueTwo;
    let tempDistance;
    if (radioMap.size !== receivedRSSValues.size){
        return Number.NEGATIVE_INFINITY;
    }

    try{
        radioMap.forEach((rss,bssid)=>{
            if (rss === rssNotReceived) {
                tempValueOne = 0.0;
            }else{
             tempValueOne = rss;
            }
      
            if (receivedRSSValues.get(bssid) === rssNotReceived) {
            tempValueTwo = 0.0;
            }else {
            tempValueTwo = receivedRSSValues.get(bssid);
        }
        
            tempDistance = tempValueOne - tempValueTwo;
            tempDistance *= tempDistance;
            finalDistance += tempDistance;
        })
    }catch(e){
        return Number.NEGATIVE_INFINITY
    }
    return finalDistance * finalDistance;

}

const getFloorByValue = (floorVotingMap) => {
    let floorWithHighestVote = Number.NEGATIVE_INFINITY;
    floorVotingMap.forEach((voteCount, floor) => {
        let tempVoteCount = -1;
  
        if (tempVoteCount === -1 || tempVoteCount < voteCount) {
          tempVoteCount = voteCount;
          floorWithHighestVote = floor;
        }
      });
  
      return floorWithHighestVote;
}

const calculateWeightedAverageKDistanceLocations = (locationDistances) => {
    try{
        const k = 5;
        let locationWeight = 0.0;
        let sumWeights = 0.0;
        let weightedSumX = 0.0;
        let weightedSumY = 0.0;

        let floor;
        let x = 0.0;
        let y = 0.0;

        const kMin = k < locationDistances.length ? k : locationDistances.length;
        const floorVoting = new Map();
        for (let i = 0; i < kMin; i++) {
            if (locationDistances[i].distance !== 0.0) {
              locationWeight = 1 / locationDistances[i].distance;
            } else {
              locationWeight = 100;
            }

            const locationDistanceCaliPointPos =
              locationDistances[i].calibrationPointPosition;

            x = locationDistanceCaliPointPos.x;
            y = locationDistanceCaliPointPos.y;

            if (floorVoting.has(locationDistanceCaliPointPos.floor)) {
              const oldValue = floorVoting.get(
                locationDistanceCaliPointPos.floor
              );
              floorVoting.set(locationDistanceCaliPointPos.floor, oldValue + 1);
            } else {
              floorVoting.set(locationDistanceCaliPointPos.floor, 1);
            }

            sumWeights += locationWeight;
            weightedSumX += locationWeight * x;
            weightedSumY += locationWeight * y;
          }

          weightedSumX /= sumWeights;
          weightedSumY /= sumWeights;
          floor = getFloorByValue(floorVoting);
          const positionToReturn = {
              x : weightedSumX,
              y : weightedSumY,
              floor : floor,
          }
          return positionToReturn

    }catch(err){
        console.error(err)
        return
    }
}

const WKNN_algorithm = async (receivedDatabaseRSSValues,projectId) => {
    const calibrationPointList = await getCalibrationPointsByID(projectId);
    const locationDistanceResults = []
    try{
        calibrationPointList.forEach((calibrationPoint) => {
            const radioMap = calibrationPoint.radioMap
            const currentDistance = calculateEuclideanDistance(radioMap,receivedDatabaseRSSValues)
            if (currentDistance === Number.NEGATIVE_INFINITY) {
                // CHECK THISSSSSSS
                return new Error('Negative Infinity Distance Error');;
            }
            const locationDistanceToAdd  = {
                calibrationPointId : calibrationPoint.id,
                calibrationPointName : calibrationPoint.name,
                calibrationPointPosition : calibrationPoint.position,
                distance : currentDistance
            }
            locationDistanceResults.unshift(locationDistanceToAdd);
        });
        const sortedLocationDistances = locationDistanceResults.sort(
            (d1, d2) => d1.distance - d2.distance
        );
        const calculatedPosition = calculateWeightedAverageKDistanceLocations(sortedLocationDistances);
        return calculatedPosition;
    }catch(err){
        throw err
    }
}

const ml_knn = async (receivedDatabaseRSSValues,projectId) =>  {
    try{
        const calibrationPointList = await getCalibrationPointsByID(projectId);
        const {signal_list,rssList,coordinateList} = await prepare_data(calibrationPointList,projectId,receivedDatabaseRSSValues)
        const KNN = new KNN_Model(rssList,coordinateList,{k:3});
        const predictions = KNN.predict(signal_list)
        return predictions
    }catch(err){
        console.error(err.message)
    }

}

const prepare_data = async (calibrationPoints,projectId,receivedSignals) => {
    const signal_list = [[]]
    const rssList = []
    const coordinateList = []
    const accessPointList = await getAccessPointsByID(projectId)
    calibrationPoints.forEach(cp => {
        const temp_rss = []
        const temp_coords = []
        const radioMap = cp.radioMap
        accessPointList.forEach(ap => {
            const rss = radioMap.get(ap.bssid)
            temp_rss.push(rss)
        })
        temp_coords.push(cp.position.x)
        temp_coords.push(cp.position.y)
        temp_coords.push(cp.position.floor)
        rssList.push(temp_rss)
        coordinateList.push(temp_coords)
    })
    accessPointList.forEach(ap => {
        signal_list[0].push(receivedSignals.get(ap.bssid))
    })
    return {signal_list,rssList,coordinateList}

}


module.exports = {
    calculatePosition
}
