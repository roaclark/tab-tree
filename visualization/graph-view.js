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
        pageNodes.map(function (node) {
            for (childid in node.childids) {
                pageLinks.push({source: nodeMapping[node.value.url],
                           target: nodeMapping[childid]});
            }
        });
    }

    function updateGraph() {
        getNodes();
        generateLinks();
    }

    updateGraph();

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
        
        makeOption(newDiv, "Remove", "../images/icon2.png", function() {
            // Removing
            page.LinkGraph.removeNode(node.value.url);
            updateGraph();
            prepareNodes();
            prepareLinks();
            force.nodes(pageNodes)
                 .links(pageLinks)
                 .start();
        });

        makeOption(newDiv, "Collapse", "../images/icon2.png", function() {
            alert("collapse");
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
        var selection = svg.selectAll(".link").data(pageLinks);

        selection
            .exit()
            .remove();
        selection
            .enter()
            .append("line")
            .attr("class", "link");
        linkElements = svg.selectAll(".link");
    };

    function prepareNodes() {
        var selection = svg.selectAll(".node").data(pageNodes, function(node) {
            return node.value.url;
        });

        selection.exit().remove();
        selection.enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 16)
            .call(force.drag)
            .each(function(node) {
                d3.select(this).classed(node.value.type, true);
            })
            .on("click", showDetails)
            .on("dblclick", function(node) {
                page.openTab(node.value.url);
            })
            .on("mouseover", showTitlePane)
            .on("mouseout", hideTitlePane);
        nodeElements = svg.selectAll(".node");
    };

    prepareLinks();
    prepareNodes();

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
            var url = "url" + new Date().getTime() || prompt("Enter a URL");
            if (url) {
                var title = "title" || prompt("Enter a title");
                var description = "description" || prompt("Enter a description");
                page.LinkGraph.addUnreadNode(url, title, description);
                updateGraph();
                prepareNodes();
                force.nodes(pageNodes).start();
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