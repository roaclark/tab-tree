graph = new Graph();

// function getNodeIds()
// function getNode(id)
// function addNode(id, value)
// function addEdge(sourceid, sinkid)
// function removeNode(id)
// function removeEdge(sourceid, sinkid)

document.write("No nodes: ");
document.write(graph.getNodeIds());
document.write("<br>");
graph.addNode(1, "node1");
graph.addNode(2, "node2");
document.write("Two nodes: ");
document.write(graph.getNodeIds());
document.write("<br>");
document.write("<br>");


document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("Node1 children: ");
for (var id in graph.getNode(1).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node1 parents: ");
for (var id in graph.getNode(1).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


document.write("Node2 value: ");
document.write(graph.getNode(2).value);
document.write("<br>");
document.write("Node2 children: ");
for (var id in graph.getNode(2).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 parents: ");
for (var id in graph.getNode(2).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


graph.addEdge(1, 2);
document.write("Adding edge from 1 to 2");
document.write("<br>");
document.write("<br>");


document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("Node1 children: ");
for (var id in graph.getNode(1).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node1 parents: ");
for (var id in graph.getNode(1).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 value: ");
document.write(graph.getNode(2).value);
document.write("<br>");
document.write("Node2 children: ");
for (var id in graph.getNode(2).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 parents: ");
for (var id in graph.getNode(2).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


graph.addNode(3, "node3");
document.write("Adding node 3");
document.write("<br>");
graph.addEdge(2, 3);
document.write("Adding edge from 2 to 3");
document.write("<br>");
graph.addEdge(3, 1);
document.write("Adding edge from 3 to 1");
document.write("<br>");
graph.addEdge(1, 3);
document.write("Adding edge from 1 to 3");
document.write("<br>");
document.write("<br>");


document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("Node1 children: ");
for (var id in graph.getNode(1).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node1 parents: ");
for (var id in graph.getNode(1).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 value: ");
document.write(graph.getNode(2).value);
document.write("<br>");
document.write("Node2 children: ");
for (var id in graph.getNode(2).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 parents: ");
for (var id in graph.getNode(2).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node3 value: ");
document.write(graph.getNode(3).value);
document.write("<br>");
document.write("Node3 children: ");
for (var id in graph.getNode(3).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node3 parents: ");
for (var id in graph.getNode(3).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


graph.removeEdge(1, 3);
document.write("Removing edge from 1 to 3");
document.write("<br>");
document.write("<br>");


document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("Node1 children: ");
for (var id in graph.getNode(1).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node1 parents: ");
for (var id in graph.getNode(1).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 value: ");
document.write(graph.getNode(2).value);
document.write("<br>");
document.write("Node2 children: ");
for (var id in graph.getNode(2).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 parents: ");
for (var id in graph.getNode(2).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node3 value: ");
document.write(graph.getNode(3).value);
document.write("<br>");
document.write("Node3 children: ");
for (var id in graph.getNode(3).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node3 parents: ");
for (var id in graph.getNode(3).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


graph.removeNode(3);
document.write("Removing node 3");
document.write("<br>");
document.write("<br>");


document.write("Nodes: ");
document.write(graph.getNodeIds());
document.write("<br>");
document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("Node1 children: ");
for (var id in graph.getNode(1).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node1 parents: ");
for (var id in graph.getNode(1).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 value: ");
document.write(graph.getNode(2).value);
document.write("<br>");
document.write("Node2 children: ");
for (var id in graph.getNode(2).childids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("Node2 parents: ");
for (var id in graph.getNode(2).parentids) {
    document.write(id);
    document.write(" ");
}
document.write("<br>");
document.write("<br>");


graph.getNode(1).value = 3;
document.write("Updateing node 1 value to 3");
document.write("<br>");
document.write("Node1 value: ");
document.write(graph.getNode(1).value);
document.write("<br>");
document.write("<br>");