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
        .attr("height", height)
        .on("click", function () {
            var selected = d3.select(d3.event.target);
            if (!(selected.classed("node")) || selected.classed("edge")) {
                clearDetailPaneAndSelection();
            }
        })
        .on("dblclick", function () {
            var selected = d3.select(d3.event.target);
            if (!(selected.classed("node")) || selected.classed("edge")) {
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
        clearDetailPaneAndSelection();
        d3.select(this).classed("selected", true);
        var detailDiv = d3.select("#detailPane").append("div");
        detailDiv.append("p").append("h2").html(node.value.title);
        detailDiv.append("p").html(node.value.description);
        detailDiv.append("p").html("(" + node.value.url + ")");
        detailDiv.append("br");
        detailDiv.append("hr");
        
        makeOption(detailDiv, "Remove", "../images/icon2.png", function() {
            clearDetailPane()
            page.LinkGraph.removeNode(node.value.url);
            updateGraph();
        });

        makeOption(detailDiv, "Collapse", "../images/icon2.png", function() {
            clearDetailPane()
            page.LinkGraph.collapseNode(node.value.url);
            updateGraph();
        });

        makeOption(detailDiv, "Edit", "../images/icon2.png", function() {
            clearDetailPane()
            var form = d3.select("#detailPane").append("form")
                .property("name", "editForm");

            form.append("label").html("Title");
            form.append("br");
            form.append("input").property("type", "text").property("name", "title");
            form.append("br");
            form.append("label").html("Description");
            form.append("br");
            form.append("textarea").property("name", "description");
            form.append("br");
            form.append("input").property("type", "radio")
                                .property("name", "type")
                                .property("value", "resource");
            form.append("label").html("Resource");
            form.append("br");
            form.append("input").property("type", "radio")
                                .property("name", "type")
                                .property("value", "support");
            form.append("label").html("Support");
            form.append("br");
            form.append("input").property("type", "radio")
                                .property("name", "type")
                                .property("value", "search");
            form.append("label").html("Search");
            form.append("br");
            form.append("input").property("type", "radio")
                                .property("name", "type")
                                .property("value", "unread");
            form.append("label").html("Unread");
            form.append("br");
            form.append("input").property("type", "submit").property("value", "Update");
            form.append("input").property("type", "reset");

            form.on("submit", function() {
                    node.value.title = document.editForm.title.value || node.value.title;
                    node.value.description = document.editForm.description.value || node.value.description;
                    node.value.type = document.editForm.type.value || node.value.type;

                    nodeElements.each(updateNodeClass);
                    clearDetailPaneAndSelection();
                    // This line is necessary for chrome compatibility.
                    // Without this line, the form is still sent despite returning false.
                    event.returnValue=false;
                    return false;
                })
        });
    }

    function clearDetailPaneAndSelection() {
        clearDetailPane();
        d3.select(".node.selected").classed("selected", false);
    }

    function clearDetailPane() {
        d3.select("#detailPane").selectAll("*").remove();
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

    function updateNodeClass(node) {
        for (type in {"unread": true,
                      "support": true,
                      "resource": true,
                      "search": true}) {
            d3.select(this).classed(type, false);
        }
        d3.select(this).classed(node.value.type, true);
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
            .each(updateNodeClass)
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

    document.getElementById("icon").onclick = function() {
        force.nodes().forEach(function (node) {
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