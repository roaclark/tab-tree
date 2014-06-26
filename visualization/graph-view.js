var page = chrome.extension.getBackgroundPage();

var pageNodes = page.LinkGraph.getNodes();
var nodeMapping = {}
for (var i = 0; i < pageNodes.length; i++) {
    nodeMapping[pageNodes[i].value.url] = i;
}

var pageLinks = [];
pageNodes.map(function (node) {
    for (childid in node.childids) {
        pageLinks.push({source: nodeMapping[node.value.url],
                   target: nodeMapping[childid]});
    }
});

var width = window.innerWidth - 50,
    height = window.innerHeight - 50;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .friction(.8)
    .linkDistance(40)
    .on("tick", function () {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    })
    .on("end", function() {
        force.nodes().map(function (node) {
            node.fixed = true;
        });
    })
    .nodes(pageNodes)
    .links(pageLinks)
    .start();

link = link.data(pageLinks)
    .enter()
    .append("line")
    .attr("class", "link");

node = node.data(pageNodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 12)
    .call(force.drag())
    .each(function(node) {
        d3.select(this).classed(node.value.type, true);
    });;

document.getElementById("icon").onclick = function() {
    force.nodes().map(function (node) {
        node.fixed = false;
    });
    force.start();
};

window.onresize = function(event) {
    for (a in event) {
        width = window.innerWidth - 50,
        height = window.innerHeight - 50;
        svg.attr("width", width)
            .attr("height", height);
        force.size([width, height]);
    }
}