document.addEventListener('DOMContentLoaded', function() {
    var page = chrome.extension.getBackgroundPage();

    var graph = function() {
        var pageNodes = page.LinkGraph.getNodes().splice(0);
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

        return [pageNodes, pageLinks];
    }();

    var pageNodes = graph[0],
        pageLinks = graph[1];

    var width = window.innerWidth - document.getElementById("detailPane").offsetWidth,
        height = window.innerHeight - 50;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    var linkElements = svg.selectAll(".link"),
        nodeElements = svg.selectAll(".node");

    var force = d3.layout.force()
        .size([width, height])
        .charge(-1200)
        .friction(.8)
        .linkDistance(80)
        .on("tick", function () {
            linkElements.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

            nodeElements.attr("cx", function(d) { return d.x; })
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

    function clearDetailPane() {
        d3.select(".node.selected").classed("selected", false);
        d3.select("#detailPane").selectAll("div").remove();
    }

    function prepareLinks() {
        linkElements = linkElements.data(pageLinks)
            .enter()
            .append("line")
            .attr("class", "link");
        linkElements = svg.selectAll(".link");
    };

    function prepareNodes() {
        nodeElements.data(pageNodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 16)
            .call(force.drag)
            .each(function(node) {
                d3.select(this).classed(node.value.type, true);
            })
            .on("click", function(node) {
                clearDetailPane();
                d3.select(this).classed("selected", true);
                var newDiv = d3.select("#detailPane").append("div");
                newDiv.append("p").html("<h2>" + node.value.title + "</h2>");
                newDiv.append("p").html(node.value.description);
                newDiv.append("p").html("(" + node.value.url + ")");
            })
            .on("dblclick", function(node) {
                page.openTab(node.value.url);
            })
            .on("mouseover", function(node) {
                d3.select("#titlePane")
                    .style("left", (node.x + 30) + "px")
                    .style("top", (node.y + 20) + "px")
                    .html(node.value.title)
                    .style("visibility", "visible");
            })
            .on("mouseout", function(node) {
                d3.select("#titlePane").style("visibility", "hidden");
            });
        nodeElements = svg.selectAll(".node");
    };

    prepareLinks();
    prepareNodes();

    d3.select("body").on("click", function () {
        if (!d3.select(d3.event.target).classed("node")) {
            clearDetailPane();
        }
    });
    d3.select("body").on("dblclick", function () {
        if (!d3.select(d3.event.target).classed("node")) {
            var url = "url" || prompt("Enter a URL");
            if (url) {
                var title = "title" || prompt("Enter a title");
                var description = "description" || prompt("Enter a description");
                page.LinkGraph.addUnreadNode(url, title, description);
                pageNodes.push(page.LinkGraph.getNode(url));
                prepareNodes();
                force.start();
            } else {
                alert("URL required");
            }
        }
    });

    document.getElementById("icon").onclick = function() {
        force.nodes().map(function (node) {
            node.fixed = false;
        });
        force.start();
    };

    window.onresize = function(event) {
        for (a in event) {
            width = window.innerWidth - document.getElementById("detailPane").offsetWidth,
            height = window.innerHeight - 50;
            svg.attr("width", width)
               .attr("height", height);
            force.size([width, height]);
        }
    }
}, false);