const mongoose = require('mongoose');

const MapGraphSchema = mongoose.Schema(
    {
        projectId: {
            type: String,
            required: [true, "Please enter ProjectID"]
        },
        graph: {
            type: Object,
            required: [true, "Graph is required"]
        },
    },
    {
        timestamps: true
    }
)

const MapGraph  = mongoose.model("MapGraph", MapGraphSchema);
module.exports = MapGraph;