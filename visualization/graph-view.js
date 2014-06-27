document.addEventListener('DOMContentLoaded', function() {
    var page = chrome.extension.getBackgroundPage();

    var pageNodes = [],
        pageLinks = [];

    function getNodes() {
        pageNodes = page.LinkGraph.getNodes();
    }

    function generateLinks() {
        var nodeMapping = {}
        for (var i = 0; i < pageNodes.length; i++) {
            nodeMapping[pageNodes[i].value.url] = i;
        }

        pageLinks = [];
        pageNodes.forEach(function (node) {
            for (childid in node.childids) {
                pageLinks.push({source: nodeMapping[node.value.url],
                           target: nodeMapping[childid]});
            }
        });
    }

    var width = window.innerWidth - document.getElementById("detailPane").offsetWidth,
        height = window.innerHeight - 50;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("defs")
        .selectAll("marker")
        .data([{id: "arrowhead", refX: 23},
               {id: "fararrowhead", refX: 0}])
        .enter()
        .append("marker")
        .attr("id", function(d) { return d.id })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", function(d) { return d.refX })
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    var linkElements = svg.append("g").attr("id", "linkg").selectAll(".link"),
        nodeElements = svg.append("g").attr("id", "nodeg").selectAll(".node");
        newPathElement = svg.append("path")
                            .attr("id", "newEdge")
                            .attr("class", "link")
                            .attr("marker-end", "url(#fararrowhead)")
                            .attr("visibility", "hidden");

    getNodes();
    generateLinks();
    var force = d3.layout.force()
        .size([width, height])
        .charge(-1200)
        .friction(.8)
        .linkDistance(80)
        .on("tick", function () {
            linkElements.attr("d", function(d) {
                return "M" + d.source.x + "," + d.source.y +
                       "L" + d.target.x + "," + d.target.y; });

            nodeElements.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
        })
        .on("end", function() {
            force.nodes().forEach(function (node) {
                node.fixed = true;
            });
        })
        .nodes(pageNodes)
        .links(pageLinks)
        .start();

    var shiftKeyEngaged = false;
    d3.select(window)
        .on('keydown', function() {
            if (d3.event.keyCode == 16) {
                // console.log("shift");
                shiftKeyEngaged = shiftKeyEngaged ||
                    nodeElements.call(d3.behavior.drag()
                        .on('dragstart', function(node) {
                            newPathElement
                                .attr("d", "M" + (node.x) + "," + (node.y))
                                .attr("visibility", "visible");
                        })
                        .on('drag', function(node) {
                            var mouseLoc = d3.mouse(this);
                            newPathElement
                                .attr("d", "M" + (node.x) + "," + (node.y) +
                                           "L" + mouseLoc[0] + "," + mouseLoc[1]);
                        })
                        .on('dragend', function(node) {
                            newPathElement.attr("visibility", "hidden");
                            var mouseLoc = d3.mouse(this);
                            nodeElements.each(function (desnode) {
                                if (Math.sqrt(Math.pow((desnode.x-mouseLoc[0]), 2)
                                        + (Math.pow((desnode.y-mouseLoc[1]), 2))) < 16) {
                                    page.LinkGraph.addLink(node.value.url, desnode.value.url);
                                    updateGraph();
                                }
                            })
                        }))
                      || true;
            }})
        .on('keyup', function() {
            if (d3.event.keyCode == 16) {
                shiftKeyEngaged = shiftKeyEngaged &&
                    nodeElements.call(force.drag()) &&
                    false;
            }})

    function makeOption(container, text, icon, onclick) {
        var optionDiv = container.append("div")
            .classed("nodeOption", true)
            .on("click", onclick);
        optionDiv.append("img")
            .classed("nodeOptionIcon", true)
            .attr("src", icon);
        optionDiv.append("p")
            .html(text);
    }

    function showDetails(node) {
        clearDetailPane();
        d3.select(this).classed("selected", true);
        var newDiv = d3.select("#detailPane").append("div");
        newDiv.append("p").html("<h2>" + node.value.title + "</h2>");
        newDiv.append("p").html(node.value.description);
        newDiv.append("p").html("(" + node.value.url + ")");
        newDiv.append("p").html("<br><hr>");
        
        makeOption(newDiv, "Remove", "../images/icon2.png", function() {
            page.LinkGraph.removeNode(node.value.url);
            updateGraph();
        });

        makeOption(newDiv, "Collapse", "../images/icon2.png", function() {
            page.LinkGraph.collapseNode(node.value.url);
            updateGraph();
        });

        makeOption(newDiv, "Edit", "../images/icon2.png", function() {
            alert("edit");
        });
    }

    function showTitlePane(node) {
        d3.select("#titlePane")
            .style("left", (node.x + 30) + "px")
            .style("top", (node.y + 20) + "px")
            .html(node.value.title)
            .style("visibility", "visible");
    }

    function hideTitlePane() {
        d3.select("#titlePane")
            .style("visibility", "hidden");
    }

    function prepareLinks() {
        var selection = svg.select("#linkg").selectAll(".link").data(pageLinks);

        selection
            .exit()
            .remove();
        selection
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("marker-end", "url(#arrowhead)");
        linkElements = svg.select("#linkg").selectAll(".link");
    };

    function prepareNodes() {
        var selection = svg.select("#nodeg").selectAll(".node").data(pageNodes, function(node) {
            return node.value.url;
        });

        selection.exit().remove();
        selection.enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 16)
            .call(force.drag())
            .each(function(node) {
                d3.select(this).classed(node.value.type, true);
            })
            .on("click", showDetails)
            .on("dblclick", function(node) {
                page.openTab(node.value.url);
            })
            .on("mouseover", showTitlePane)
            .on("mouseout", hideTitlePane);
        nodeElements = svg.select("#nodeg").selectAll(".node");
    };

    prepareLinks();
    prepareNodes();

    function updateGraph() {
        getNodes();
        generateLinks();
        force.nodes(pageNodes)
             .links(pageLinks)
             .start();
        prepareLinks();
        prepareNodes();
    }

    function updateGraphNodes() {
        getNodes();
        force.nodes(pageNodes).start();
        prepareNodes();
    }

    function clearDetailPane() {
        d3.select(".node.selected").classed("selected", false);
        d3.select("#detailPane").selectAll("div").remove();
    }

    function detailPaneSelected(selection) {
        var selectedDetailPane = false;
        var nodeSelection = selection.node();
        while(!selectedDetailPane && nodeSelection != null) {
            if (nodeSelection.id == "detailPane") {
                selectedDetailPane = true;
            } else {
                nodeSelection = nodeSelection.parentNode;
            }
        }
        return selectedDetailPane;
    }

    d3.select("body").on("click", function () {
        var selected = d3.select(d3.event.target);
        if (!(selected.classed("node") || detailPaneSelected(selected))) {
            clearDetailPane();
        }
    });
    d3.select("body").on("dblclick", function () {
        var selected = d3.select(d3.event.target);
        if (!(selected.classed("node") || detailPaneSelected(selected))) {
            var url = prompt("Enter a URL");
            if (url) {
                var title = prompt("Enter a title");
                var description = prompt("Enter a description");
                page.LinkGraph.addUnreadNode(url, title, description);
                updateGraphNodes();
            } else {
                alert("URL required");
            }
        }
    });

    document.getElementById("icon").onclick = function() {
        force.nodes().forEach(function (node) {
            node.fixed = false;
        });
            console.log(svg[0][0])
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