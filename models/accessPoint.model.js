const mongoose = require('mongoose');

const AccessPointSchema = mongoose.Schema(
    {
        projectId: {
            type: String,
            required: [true, "Please enter ProjectID"]
        },
        ssid: {
            type: String,
            required: [true, "Please enter SSID of the Access point"]
        },
        bssid: {
            type: String,
            required: [true, "Please enter the BSSID of the Access point"]
        }
    },
    {
        timestamps: true
    }
)

const AccessPoint  = mongoose.model("AccessPoint",AccessPointSchema);
module.exports = AccessPoint;