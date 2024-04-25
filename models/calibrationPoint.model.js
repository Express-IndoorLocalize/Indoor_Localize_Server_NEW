const mongoose = require('mongoose');

const calibrationPointSchema = mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    radioMap: {
        type: Map,
        of: Number
    },
    position: {
        type: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            },
            floor: {
                type: Number,
                required: true
            }
        },
        required: true
    }
})

const calibrationPoint = mongoose.model("calibrationPoint",calibrationPointSchema);
module.exports = calibrationPoint