function getShortestPath(nodes, edges, startNodeName, endNodeName) {
    const nodesByName = objectKeyBy(nodes, "name");
    const edgesByNode1Name = objectGroupBy(edges, "node1");
    const edgesByNode2Name = objectGroupBy(edges, "node2");

    const startNode = nodesByName[startNodeName];
    const endNode = nodesByName[endNodeName];

    const cameFrom = {};
    const costFromStart = {};
    costFromStart[startNode.name] = 0;

    const totalCost = (node) => costFromStart[node.name];

    const openSet = new Heap((a, b) => totalCost(b) - totalCost(a));
    openSet.add(startNode);

    while (openSet.peek()) {
        let currentNode = openSet.pop();

        // Если этот нод целевой, то востанавливаем путь
        if (currentNode.name === endNode.name) {
            const result = [currentNode.name];

            while (currentNode.name in cameFrom) {
                currentNode = cameFrom[currentNode.name];
                result.push(currentNode.name);
            }

            return {
                path: result.reverse(),
                cost: costFromStart[endNode.name]
            };
        }

        const edges1 = edgesByNode1Name[currentNode.name] || [];
        const edges2 = edgesByNode2Name[currentNode.name] || [];
        const currentNodeEdges = [...edges1, ...edges2];

        for (const edge of currentNodeEdges) {
            const newCost = totalCost(currentNode) + edge.weight;
            const neighbor = nodesByName[currentNode.name === edge.node1 ? edge.node2 : edge.node1];

            // Проверяем если новый путь до соседа короче или соседа еще нет в открытом списке
            if (!(neighbor.name in costFromStart) || newCost < costFromStart[neighbor.name]) {
                costFromStart[neighbor.name] = newCost;
                cameFrom[neighbor.name] = currentNode;
                openSet.add(neighbor);
            }
        }
    }

    return {
        path: [],
        cost: Infinity
    };
}
