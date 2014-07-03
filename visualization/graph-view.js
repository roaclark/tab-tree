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
            if (!(selected.classed("node")) || selected.classed("link")) {
                clearDetailPaneAndSelection();
            }
        })
        .on("dblclick", function () {
            var selected = d3.select(d3.event.target);
            if (!(selected.classed("node")) || selected.classed("link")) {
                var title = prompt("Enter a title");
                if (title && !page.LinkGraph.getNode(title)) {
                    var description = prompt("Enter a description");
                    page.LinkGraph.addOrganizationNode(title, description);
                    updateGraphNodes();
                } else {
                    alert("Title must be unique and nonempty");
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
                                if (!(node == desnode)) {
                                    if (Math.sqrt(Math.pow((desnode.x-mouseLoc[0]), 2)
                                            + (Math.pow((desnode.y-mouseLoc[1]), 2))) < 16) {
                                        page.LinkGraph.addLink(node.value.url, desnode.value.url);
                                        updateGraph();
                                    }
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
            form.append("input").property("type", "text")
                                .property("name", "title")
                                .property("value", node.value.title);
            form.append("br");
            form.append("label").html("Description");
            form.append("br");
            form.append("textarea").property("name", "description")
                                   .property("value", node.value.description);
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#e00");
            form.append("label").html("Red");
            form.append("br");

            form.append("input")
               .property("type", "radio")
               .property("name", "color")
               .property("value", "#f70");
            form.append("label").html("Orange");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#fe2");
            form.append("label").html("Yellow");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#3d0");
            form.append("label").html("Green");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#3ae");
            form.append("label").html("Blue");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#a0d");
            form.append("label").html("Purple");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#fff");
            form.append("label").html("White");
            form.append("br");

            form.append("input")
                .property("type", "radio")
                .property("name", "color")
                .property("value", "#ccc");
            form.append("label").html("Gray");
            form.append("br");

            form.select("[value=\"" + node.value.color + "\"]").attr("checked", true);

            form.append("input").property("type", "submit")
                                .property("value", "Update");
            form.append("input").property("type", "reset");

            form.on("submit", function() {
                    page.LinkGraph.setTitle(node.value.url,
                            document.editForm.title.value || node.value.title);
                    page.LinkGraph.setDescription(node.value.url,
                            document.editForm.description.value || node.value.description);
                    page.LinkGraph.changeColor(node.value.url,
                            document.editForm.color.value || node.value.color);

                    clearDetailPaneAndSelection();
                    nodeElements.attr("fill", function (d) {return d.value.color})

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
            .attr("fill", function (d) {return d.value.color})
            .attr("stroke-dasharray", function (d) {
                if (d.value.organization) {
                    return "4 2";
                } else {
                    return "1 0";
                }
            })
            .call(force.drag())
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