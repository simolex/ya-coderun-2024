const CANVAS = document.querySelector('#canvas');
const ctx = CANVAS.getContext("2d");

function drawNodes(nodes) {
    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        // Добавление названия узла
        ctx.fillStyle = "white";
        ctx.fillText(node.name, node.x - 5, node.y + 5);
    }
}

function drawWidth(node1, node2, edge) {
    const midpoint = {x: (node1.x + node2.x) / 2, y:(node1.y + node2.y) / 2};

    const text = edge.weight.toString();
    const {width: textWidth} = ctx.measureText(text);
    const textHeight = 14;

    const padding = 3;
    const boxWidth = textWidth;
    const boxHeight = textHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(midpoint.x - padding, midpoint.y + padding, boxWidth + 2 * padding, -(boxHeight + padding));

    ctx.fillStyle = "blue";
    ctx.font = `${textHeight}px Arial`;
    ctx.fillText(text, midpoint.x, midpoint.y);
}

function visualizeGraph(nodes, edges) {
    const nodesByName = objectKeyBy(nodes, 'name');

    // Отрисовка edges и связанных с ними весов 
    for (let edge of edges) {
        const node1 = nodesByName[edge.node1];
        const node2 = nodesByName[edge.node2];

        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();

        drawWidth(node1, node2, edge);
    }

    drawNodes(nodes);
}

function drawShortestWay(nodes, path) {
    const nodesByName = objectKeyBy(nodes, 'name');

    for (let i = 1; i < path.length; i++) {
        const node1 = nodesByName[path[i - 1]];
        const node2 = nodesByName[path[i]];

        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    drawNodes(nodes);
}
