const nodes = [
    { name: "A", x: 70, y: 100 },
    { name: "B", x: 200, y: 150 },
    { name: "C", x: 150, y: 200 },
    { name: "X", x: 300, y: 300 },
    { name: "Y", x: 200, y: 400 },
    { name: "D", x: 50, y: 250 },
    { name: "E", x: 120, y: 30 },
    { name: "F", x: 270, y: 150 },
    { name: "G", x: 300, y: 50 },
    { name: "H", x: 570, y: 150 },
    { name: "I", x: 500, y: 200 },
    { name: "J", x: 600, y: 500 },
    { name: "K", x: 550, y: 550 },
    { name: "L", x: 450, y: 620 },
    { name: "M", x: 150, y: 550 }
];

const edges = [
    { node1: "A", node2: "B", weight: 6 },
    { node1: "B", node2: "C", weight: 3 },
    { node1: "B", node2: "Y", weight: 4 },
    { node1: "B", node2: "X", weight: 1 },
    { node1: "B", node2: "E", weight: 7 },
    { node1: "X", node2: "Y", weight: 2 },
    { node1: "Y", node2: "D", weight: 7 },
    { node1: "D", node2: "E", weight: 6 },
    { node1: "Y", node2: "E", weight: 1 },
    { node1: "Y", node2: "M", weight: 5 },
    { node1: "E", node2: "F", weight: 2 },
    { node1: "Y", node2: "L", weight: 9 },
    { node1: "F", node2: "G", weight: 4 },
    { node1: "G", node2: "H", weight: 1 },
    { node1: "H", node2: "I", weight: 4 },
    { node1: "I", node2: "J", weight: 5 },
    { node1: "J", node2: "K", weight: 5 },
    { node1: "K", node2: "L", weight: 7 },
    { node1: "L", node2: "M", weight: 10 },
    { node1: "M", node2: "D", weight: 4 },
    { node1: "E", node2: "M", weight: 7 },
    { node1: "F", node2: "L", weight: 2 },
    { node1: "G", node2: "K", weight: 3 },
    { node1: "H", node2: "J", weight: 1 },
    { node1: "I", node2: "D", weight: 4 }
];

visualizeGraph(nodes, edges);

const {path: shortestPath, cost} = getShortestPath(nodes, edges, 'A', 'J');

drawShortestWay(nodes, shortestPath);
