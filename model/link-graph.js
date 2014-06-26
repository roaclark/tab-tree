LinkGraphCons = function() {
    var graph = new Graph();

    LinkInfo = function(type, url, title, description) {
        return {
            type: type,
            url: url,
            title: title,
            description: description
        }
    }


    /* Adding nodes */

    this.addSearchNode = function(url, search, parent) {
        var info = new LinkInfo("search", url, "Search for " + search, "Search page for " + search);
        graph.addNode(url, info);
        if (parent) {
            graph.addEdge(parent, url);
        }
    }

    this.addUnreadNode = function(url, title, description, other, parent) {
        var info = new LinkInfo("unread", url, title || "Untitled", description || "No description available");
        graph.addNode(url, info);
        this.updateInfo(url, other || {})
        if (parent) {
            graph.addEdge(parent, url);
        }
    }

    this.addLink = function(from, to) {
        graph.addEdge(from, to);
    }


    /* Removing nodes */

    this.removeNode = function(url) {
        graph.removeNode(url);
    }

    this.collapseNode = function(url) {
        var node = graph.getNode(url);
        for (var parentid in node.parentids) {
            for (var childid in node.childids) {
                graph.addEdge(parentid, childid);
            }
        }
        graph.removeNode(url);
    }

    this.removeLink = function(from, to) {
        graph.removeEdge(from, to);
    }


    /* Updating nodes */

    this.markUnread = function(url) {
        graph.getNode(url).value.type = "unread";
    }

    this.markResource = function(url) {
        graph.getNode(url).value.type = "resource";
    }

    this.markSupport = function(url) {
        graph.getNode(url).value.type = "support";
    }

    this.setTitle = function(url, title) {
        if (title) {
            graph.getNode(url).value.title = title;
        }
    }

    this.setDescription = function(url, description) {
        if (description) {
            graph.getNode(url).value.description = description;
        }
    }

    this.updateInfo = function(url, items) {
        var node = graph.getNode(url);
        for (var item in items) {
            node.value[item] = items[item];
        }
    }


    /* Retrieving nodes */

    this.getUrls = function() {
        return graph.getNodeIds();
    }

    this.getNodes = function() {
        var nodes = [];
        var urls = graph.getNodeIds();
        for (var i = 0; i < urls.length; i++) {
            nodes.push(graph.getNode(urls[i]));
        }
        return nodes;
    }

    this.getNodesOfType = function(type) {
        var nodes = [];
        var urls = graph.getNodeIds();
        for (var i = 0; i < urls.length; i++) {
            node = graph.getNode(urls[i])
            if (node.value.type == type) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    this.getNode = function(url) {
        return graph.getNode(url);
    }

    this.getParentsOfNode = function(url) {
        var nodes = [];
        for (var url in graph.getNode(url).parentids) {
            nodes.push(graph.getNode(url));
        }
        return nodes;
    }

    this.getChildrenOfNode = function(url) {
        var nodes = [];
        for (var url in graph.getNode(url).childids) {
            nodes.push(graph.getNode(url));
        }
        return nodes;
    }
}

LinkGraph = new LinkGraphCons();