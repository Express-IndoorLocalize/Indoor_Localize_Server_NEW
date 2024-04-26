require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const positioningRoutes = require('./routes/positioning.route.js')
const calibratingRoutes = require('./routes/calibrating.route.js')


const app = express()

app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@indoorlocalizebackend.86xrlpa.mongodb.net/?retryWrites=true&w=majority&appName=IndoorLocalizeBackend`;



app.use("/api/positioning",positioningRoutes)
app.use("/api/calibrating",calibratingRoutes)
app.get('/',(req,res) =>  {
    res.send('Hello World');
})

mongoose.connect(uri)
.then(() => {
    console.log('Connected to the Database');
})
.catch(() => {
    console.log('Connection Failed')
})

app.listen(3000, ()=> {
    console.log('Server is Running in PORT 3000')
});
