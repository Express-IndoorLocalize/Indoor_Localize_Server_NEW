const door_to_loc_distance = 0.5

const graph2     = {
    'Seminar_Room_Door': [['L_Seminar_Room',door_to_loc_distance],['J1',4],['E-wis_Lab_Door',3],['CIT_Door',7],],
    'CIT_Door':[['L_CIT',door_to_loc_distance],['Studio_Door',10]],
}

function heuristic(node, goal) {
    // You can define your heuristic function here, for example, Manhattan distance or Euclidean distance
    // For simplicity, let's use a heuristic function that returns 0
    return 0;
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
const graph =  { 'A' : [['Final_Year_Lab',1], ['B',30], ['U',46]],
'B' : [['SE',1], ['Fabric_Lab',1], ['C',74], ['A',30]],
'C' : [['Washroom',1], ['Embedded_Enginnering_Lab',1], ['D',44], ['B',74]],
'D' : [['Research_lab',1], ['E',80], ['C',44]],
'E' : [['Old_Advanced_Lab',1], ['F',38], ['D',80]],
'F' : [['RA_Lab',1], ['G',78], ['E',38]],
'G' : [['A1',1], ['F',78], ['H',44]],
'H' : [['G',44], ['I',78], ['W',36]],
'I' : [['A2',1], ['H',78], ['J',50]],
'J' : [['Systems_Lab',1], ['ICE_Room',1], ['I',50], ['K',28]],
'K' : [['J',28], ['L',36], ['Staff_Washroom',1]],
'L' : [['K',36], ['M',52], ['Old_Codegen_Lab',1]],
'M' : [['L',52], ['N',36], ['A3',1], ['Seminar_Room',1], ['E_Wis_Lab',1]],
'N' : [['M',36], ['O',72], ['Codegen_Lab',1]],
'O' : [['N',72], ['P',18], ['Sysco_Lounge',1]],
'P' : [['O',18], ['Q',34], ['V',42], ['Insight_Hub',30]],
'Q' : [['P',34], ['R',62], ['Insight_Hub',30]],
'R' : [['Q',62], ['S',36], ['A4',1]],
'S' : [['R',36], ['T',36], ['HPC_Lab',1]],
'T' : [['S',36], ['U',70], ['IntelliSense_Lab',1]],
'U' : [['T',70], ['A',46], ['L1_Lab',1]],
'V' : [['P',42], ['W',28], ['CSE_Office',1]],
'W' : [['V',28], ['H',36], ['HoD_Office',1]],
'A1' : [['G',1], ['Staff_Rooms',44]],
'A2' : [['I',1], ['Staff_Rooms',78], ['Conference_Room',1], ['Lunch_Room',1]],
'A3' : [['M',1], ['Studio',1]],
'A4' : [['R',1], ['Embedded_Lab',1], ['Network_Lab',1]],
'Final_Year_Lab' : [['A',1]],
'SE' : [['B',1]],
'Fabric_Lab' : [['B',1]],
'Washroom' : [['C',1]],
'Embedded_Enginnering_Lab' : [['C',1]],
'Research_lab' : [['D',1]],
'Old_Advanced_Lab' : [['E',1]],
'RA_Lab' : [['F',1]],
'Staff_Rooms' : [['A1',44], ['A2',78]],
'Conference_Room' : [['A2',1]],
'Lunch_Room' : [['A2',1]],
'Systems_Lab' : [['J',1]],
'ICE_Room' : [['J',1], ['Server_Room',1]],
'Server_Room' : [['ICE_Room',1]],
'Staff_Washroom' : [['K',1]],
'Old_Codegen_Lab' : [['L',1]],
'Studio' : [['A3',1]],
'Embedded_Lab' : [['A4',1]],
'Network_Lab' : [['A4',1]],
'Seminar_Room' : [['M',1]],
'E_Wis_Lab' : [['M',1]],
'Codegen_Lab' : [['N',1]],
'Sysco_Lounge' : [['O',1]],
'Insight_Hub' : [['P',30], ['Q',30]],
'HPC_Lab' : [['S',1]],
'IntelliSense_Lab' : [['T',1]],
'L1_Lab' : [['U',1]],
'CSE_Office' : [['V',1]],
'HoD_Office' : [['W',1]],
}


// Example usage:
const startNode = 'Final_Year_Lab';
const goalNode = 'Server_Room';
const shortestPath = aStar(graph, startNode, goalNode);
console.log("Shortest Path:", shortestPath);
