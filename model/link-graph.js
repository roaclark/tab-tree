function LinkGraphCons() {
    var graph = new Graph();

    function LinkInfo(url, title, description, color) {
        return {
            url: url,
            title: title,
            description: description,
            color: color
        }
    };


    /* Adding nodes */

    this.addNode = function addNode(url, title, description, other, parent) {
        var info = new LinkInfo(url, title || "Untitled", description || "No description available", "#ccc");
        graph.addNode(url, info);
        this.updateInfo(url, other || {})
        if (parent) {
            graph.addEdge(parent, url);
        }
        this.syncLocal();
    };

    this.addSearchNode = function addSearchNode(url, search, parent) {
        var info = new LinkInfo(url, "Search for " + search, "Search page for " + search, "#3ae");
        graph.addNode(url, info);
        if (parent) {
            graph.addEdge(parent, url);
        }
        this.syncLocal();
    };

    this.addLink = function addLink(from, to) {
        graph.addEdge(from, to);
        this.syncLocal();
    };


    /* Removing nodes */

    this.removeNode = function removeNode(url) {
        graph.removeNode(url);
        this.syncLocal();
    };

    this.collapseNode = function collapseNode(url) {
        var node = graph.getNode(url);
        for (var parentid in node.parentids) {
            for (var childid in node.childids) {
                if (parentid != childid) {
                    graph.addEdge(parentid, childid);
                }
            }
        }
        graph.removeNode(url);
        this.syncLocal();
    };

    this.removeLink = function removeLink(from, to) {
        graph.removeEdge(from, to);
        this.syncLocal();
    };


    /* Updating nodes */

    this.changeColor = function changeColor(url, color) {
        graph.getNode(url).value.color = color;
        this.syncLocal();
    };

    this.setTitle = function setTitle(url, title) {
        if (title) {
            graph.getNode(url).value.title = title;
        }
        this.syncLocal();
    };

    this.setDescription = function setDescription(url, description) {
        if (description) {
            graph.getNode(url).value.description = description;
        }
        this.syncLocal();
    };

    this.updateInfo = function updateInfo(url, items) {
        var node = graph.getNode(url);
        for (var item in items) {
            node.value[item] = items[item];
        }
        this.syncLocal();
    };


    /* Retrieving nodes */

    this.getUrls = function getUrls() {
        return graph.getNodeIds();
    };

    this.getNodes = function getNodes() {
        var nodes = [];
        var urls = graph.getNodeIds();
        for (var i = 0; i < urls.length; i++) {
            nodes.push(graph.getNode(urls[i]));
        }
        return nodes;
    };

    this.getNode = function getNode(url) {
        return graph.getNode(url);
    };

    this.getParentsOfNode = function getParentsOfNode(url) {
        var nodes = [];
        for (var url in graph.getNode(url).parentids) {
            nodes.push(graph.getNode(url));
        }
        return nodes;
    };

    this.getChildrenOfNode = function getChildrenOfNode(url) {
        var nodes = [];
        for (var url in graph.getNode(url).childids) {
            nodes.push(graph.getNode(url));
        }
        return nodes;
    };


    /* Autosave functionality */

    this.syncLocal = function syncLocal() {
        chrome.storage.local.set({"autosave": graph.getNodeSet()});
    };

    this.loadLocal = function loadLocal() {
        chrome.storage.local.get("autosave", function (obj) {
            if (obj) {
                graph = new Graph(obj.autosave);
            }
        });
    };

    this.loadLocal();
};

LinkGraph = new LinkGraphCons();