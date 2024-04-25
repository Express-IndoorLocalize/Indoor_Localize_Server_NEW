const mongoose = require('mongoose');

const calibrationFingerPrintSchema = mongoose.Schema({
    id: {
        type:String,
        required : true
    },
    projectId: {
        type: String,
        required: true
    },
    calibrationPointId: {
        type: String,
        required: true
    },
    radioMap: {
        type: Map,
        of: Number
        },
    },
    {
        timestamps: true
    }
)

const calibrationFingerPrint = mongoose.model("calibrationFingerPrint",calibrationFingerPrintSchema);
module.exports = calibrationFingerPrint