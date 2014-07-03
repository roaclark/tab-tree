openTab = function(url) {
    chrome.tabs.create({
        url: url
    });
}

createPageMenuItem = function(title, parent, onclick) {
    var menuItem = {
        title: title,
        contexts: ['page']
    }
    if (parent) {
        menuItem.parentId = parent;
    }
    if (onclick) {
        menuItem.onclick = onclick;
    }
    return menuItem;
}

createContextMenus = function (currentTabInGraph) {
    chrome.contextMenus.removeAll();
    
    if (currentTabInGraph) {
        var root = chrome.contextMenus.create({
                title: 'TabTree',
                contexts: ['page']
            },
            function() {
                chrome.contextMenus.create(createPageMenuItem(
                    'Remove page from tree',
                    root,
                    function(info, tab) {
                        LinkGraph.removeNode(info.pageUrl);
                        createContextMenus(false);
                    }));
                var updatePage = chrome.contextMenus.create(createPageMenuItem(
                        'Update page',
                        root),
                    function() {
                        chrome.contextMenus.create(createPageMenuItem(
                            'Change title',
                            updatePage,
                            function(info, tab) {
                                LinkGraph.setTitle(info.pageUrl, prompt("Enter a title"));
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Change description',
                            updatePage,
                            function(info, tab) {
                                LinkGraph.setDescription(info.pageUrl, prompt("Enter a description"));
                            }));
                    });
                var markPage = chrome.contextMenus.create(createPageMenuItem(
                        'Change color...',
                        root),
                    function() {
                        chrome.contextMenus.create(createPageMenuItem(
                            'Red',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#e00");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Orange',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#f70");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Yellow',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#fe2");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Green',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#3d0");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Blue',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#3ae");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Purple',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#a0d");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'White',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#fff");
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Gray',
                            markPage,
                            function(info, tab) {
                                LinkGraph.changeColor(info.pageUrl, "#ccc");
                            }));
                    });
                chrome.contextMenus.create({
                    type: 'separator',
                    parentId: root
                });
                chrome.contextMenus.create(createPageMenuItem(
                    'Search from this page',
                    root,
                    function(info, tab) {
                        var query = prompt("Enter a query");
                        if (query) {
                            var url = "https://www.google.com/#q=" + encodeURI(query);
                            LinkGraph.addSearchNode(url, query, info.pageUrl);
                            openTab(url);
                        }
                    }));
            });

        chrome.contextMenus.create({
            title: 'Add this link as child page',
            contexts: ['link'],
            onclick: function(info, tab) {
                if (LinkGraph.getNode(info.linkUrl)) {
                    LinkGraph.addLink(info.pageUrl, info.linkUrl);
                } else {
                    LinkGraph.addNode(info.linkUrl, null, null, null, null, info.pageUrl);
                }
            }});
    } else {
        chrome.contextMenus.create(createPageMenuItem(
            'Add page to tree',
            root,
            function(info, tab) {
                LinkGraph.addNode(info.pageUrl, tab.title);
                createContextMenus(true);
            }));
    }
}

var activeTabId = -1;

chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url) {
            createContextMenus(LinkGraph.getNode(tab.url));
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabId == activeTabId && changeInfo.url) {
        createContextMenus(LinkGraph.getNode(changeInfo.url));
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    openTab("visualization/graph-viewer.html");
});