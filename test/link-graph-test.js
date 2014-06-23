// /* Adding nodes */
// addSearchNode(url, search, parent)
// addUnreadNode(url, title, description, other, parent)
// addLink(from, to)

// /* Removing nodes */
// removeNode(url)
// collapseNode(url)
// removeLink(from, to)

// /* Updating nodes */
// markUnread(url)
// markResource(url)
// markSupport(url)
// setTitle(url, title)
// setDescription(url, description)
// updateInfo(url, items)

// /* Retrieving nodes */
// getUrls()
// getNodes()
// getNodesOfType(type)
// getNode(url)
// getParentsOfNode(url)
// getChildrenOfNode(url)

w = function(str) {
	document.write(str);
};

wb = function(n) {
	for (var i = n || 1; i > 0; i--) {
		w("<br>")
	}
};

writeNodes = function(nodes) {
	for(var i = 0; i < nodes.length; i++) {
		writeNode(nodes[i]);
	}
};

writeNode = function(node) {
	w("--------------- Node ---------------");
	wb();
	w(node.value.url);
	wb();
	w("Parents:");
	for (var id in node.parentids) {
		wb();
		w("&nbsp;&nbsp;&nbsp;&nbsp;");
		w(id);
	}
	wb();
	w("Children:");
	for (var id in node.childids) {
		wb();
		w("&nbsp;&nbsp;&nbsp;&nbsp;");
		w(id);
	}
	wb();
	w("Value:")
	for (var prop in node.value) {
		wb();
		w("&nbsp;&nbsp;&nbsp;&nbsp;");
		w(prop + ": " + node.value[prop]);
	}
	wb();
};

writeList = function(list) {
	for (var i = 0; i < list.length; i++) {
		wb();
		w("&nbsp;&nbsp;&nbsp;&nbsp;");
		w(list[i]);
	}
};

w("Empty urls: ");
w(LinkGraph.getUrls());
wb();
w("Empty nodes: ");
w(LinkGraph.getNodes());
wb(2);

w("Constructing graph");
wb();

LinkGraph.addSearchNode("search-1-no-parent", "no parent");
LinkGraph.addUnreadNode("search-result-1-1", "result 1", "this is a result", {}, "search-1-no-parent");
LinkGraph.markResource("search-result-1-1");
LinkGraph.addUnreadNode("search-result-1-2", undefined, "this is also a result", {}, "search-1-no-parent");
LinkGraph.markSupport("search-result-1-2");
LinkGraph.addUnreadNode("search-result-1-3", "more", "extras", {number: 1, call: "whee"}, "search-1-no-parent");

LinkGraph.addSearchNode("search-2-with-parent", "yes parent", "search-result-1-1");
LinkGraph.addUnreadNode("search-result-2-1", "Yay for titles", undefined, {number: 1}, "search-2-with-parent");
LinkGraph.markResource("search-result-2-1");
LinkGraph.addUnreadNode("search-result-2-2", "Only title", undefined, {}, "search-2-with-parent");
LinkGraph.markResource("search-result-2-2");
LinkGraph.markUnread("search-result-2-2");
LinkGraph.addUnreadNode("search-result-2-3", undefined, undefined, {}, "search-2-with-parent");
LinkGraph.addLink("search-result-2-1", "search-result-1-3");

LinkGraph.addUnreadNode("search-result-no-parent");

w("Graph constructed");
wb(2);

w("Urls:");
writeList(LinkGraph.getUrls());
wb(2);
writeNodes(LinkGraph.getNodes());
wb(2);

w("Search Nodes:");
wb();
writeNodes(LinkGraph.getNodesOfType("search"));
wb();
w("Resource Nodes:");
wb();
writeNodes(LinkGraph.getNodesOfType("resource"));
wb();
w("Support Nodes:");
wb();
writeNodes(LinkGraph.getNodesOfType("support"));
wb();
w("Unread Nodes:");
wb();
writeNodes(LinkGraph.getNodesOfType("unread"));
wb(2);

w("Children of search-1-no-parent");
wb();
writeNodes(LinkGraph.getChildrenOfNode("search-1-no-parent"));
wb();
w("Parents of search-result-1-3");
wb();
writeNodes(LinkGraph.getParentsOfNode("search-result-1-3"));
wb(2);

w("Updating nodes");
wb();
LinkGraph.setTitle("search-result-2-3", "New title");
LinkGraph.setDescription("search-result-2-3", "New description");
LinkGraph.updateInfo("search-result-2-2", {
	title: "Titles and more",
	number: 5,
	other: "Yes please"
});
w("Nodes updated");
wb(2);

writeNode(LinkGraph.getNode("search-result-2-2"))
writeNode(LinkGraph.getNode("search-result-2-3"))
wb(2)

w("Collapsing node")
wb();
LinkGraph.collapseNode("search-2-with-parent");
w("Node collapsed")
wb(2);

w("Urls:");
writeList(LinkGraph.getUrls());
wb(2);
writeNodes(LinkGraph.getNodes());
wb(2);

w("Removing node")
wb();
LinkGraph.removeNode("search-result-1-3");
w("Node removed")
wb(2);

w("Urls:");
writeList(LinkGraph.getUrls());
wb(2);
writeNodes(LinkGraph.getNodes());
wb(2);

w("Removing link")
wb();
LinkGraph.removeLink("search-result-1-1", "search-result-2-2");
w("Link removed")
wb(2);

w("Urls:");
writeList(LinkGraph.getUrls());
wb(2);
writeNodes(LinkGraph.getNodes());
wb(2);
