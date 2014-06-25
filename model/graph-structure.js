Graph = function() {
    var nodeSet = {};

    Node = function(id, value) {
        return {
            value: value,
            parentids: {},
            childids: {}
        };
    }

    this.getNodeIds = function() {
        return Object.keys(nodeSet);
    }

    this.getNode = function(id) {
        return nodeSet[id];
    }

    this.addNode = function(id, value) {
        nodeSet[id] = new Node(id, value);
    }

    this.addEdge = function(sourceid, sinkid) {
        this.getNode(sourceid).childids[sinkid] = true;
        this.getNode(sinkid).parentids[sourceid] = true;
    }

    this.removeNode = function(id) {
        var node = nodeSet[id];
        for (var parentid in node.parentids) {
            delete nodeSet[parentid].childids[id];
        }
        for (var childid in node.childids) {
            delete nodeSet[childid].parentids[id];
        }
        delete nodeSet[id];
    }

    this.removeEdge = function(sourceid, sinkid) {
        delete this.getNode(sourceid).childids[sinkid];
        delete this.getNode(sinkid).parentids[sourceid];
    }
}