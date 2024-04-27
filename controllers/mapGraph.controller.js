const mapGraph = require('../models/mapGraph.model')

const addGraph = async (req,res) => {
    try{
        console.log(req);
        const graph_add = req.body.graph
        const projectId = req.body.projectId
        const newGraph = await mapGraph({
            projectId: projectId,
            graph : graph_add
        })
        const savedGraph = await newGraph.save();
        res.status(200).json({message:`Graph saved successfully for project id ${projectId}`})

    }catch(err){
        console.error(err)
        res.status(500).json({message:err.message})
    }
}


const getMapGraphById = async (projectID) => {
    try{
        const savedGraph = await mapGraph.findOne({projectId:projectID}).exec();
        return savedGraph;
    }catch(err){
        console.error(err)
    }
}


module.exports = {
    getMapGraphById,
    addGraph
}


