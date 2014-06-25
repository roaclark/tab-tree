var page = chrome.extension.getBackgroundPage();

window.onload = function() {
    document.getElementById("icon").onclick = function() {
        if (page.LinkGraph.getNode("url")) {
            page.openTab('https://www.google.com/#q=search');
        } else {
            page.openTab('https://www.google.com/');
        }
    };

    var nodes = page.LinkGraph.getNodes();
    for (var i = 0; i < nodes.length; i++) {
        console.log(i);
        document.body.appendChild(document.createTextNode(nodes[i].value.type));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createTextNode(nodes[i].value.url));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createTextNode(nodes[i].value.title));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createTextNode(nodes[i].value.description));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createTextNode(Object.keys(nodes[i].parentids)));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createTextNode(Object.keys(nodes[i].childids)));
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createElement("br"));
    }
};