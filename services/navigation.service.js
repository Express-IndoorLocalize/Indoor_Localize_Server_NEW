const fs = require('fs');
const {getMapGraphById} = require('../controllers/mapGraph.controller')
const coordinates = JSON.parse(fs.readFileSync('nodes.json', 'utf8'));

const heuristic = (node, goal) => {
    return 0;
}

function getCoordinates(nodes) {
    return nodes.map(node => coordinates[node]);
}

function aStar(graph, start, goal) {
    let closedSet = new Set();
    let openSet = new Set([start]);
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    Object.keys(graph).forEach(node => {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    });

    gScore[start] = 0;
    fScore[start] = heuristic(start, goal);

    while (openSet.size > 0) {
        let current = null;
        let minFScore = Infinity;

        // Find the node in openSet with the lowest fScore
        for (let node of openSet) {
            if (fScore[node] < minFScore) {
                minFScore = fScore[node];
                current = node;
            }
        }

        if (current === goal) {
            // Reconstruct path and return
            let path = [current];
            while (current !== start) {
                current = cameFrom[current];
                path.unshift(current);
            }
            return path;
        }

        openSet.delete(current);
        closedSet.add(current);

        for (let [neighbor, weight] of graph[current]) {
            if (closedSet.has(neighbor)) continue;

            let tentativeGScore = gScore[current] + weight;

            if (!openSet.has(neighbor)) {
                openSet.add(neighbor);
            } else if (tentativeGScore >= gScore[neighbor]) {
                continue; // This is not a better path
            }

            // This path is the best until now, record it!
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeGScore;
            fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
        }
    }

    return null; // If there is no path
}

const getPath = async (req,res) => {
    try{
        const projectID = req.body.projectId
        const start = req.body.start_point
        const goal = req.body.goal
        const graph =  await getMapGraphById(projectID)
        const graph_to_send = graph.graph
        const path = aStar(graph_to_send,start,goal)
        const coordinates = getCoordinates(path)
        res.status(200).json({status:'success',data : {coordinates}})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = {getPath}