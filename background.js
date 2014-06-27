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
                title: 'Research Tree',
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
                        'Mark page as...',
                        root),
                    function() {
                        chrome.contextMenus.create(createPageMenuItem(
                            'Resource',
                            markPage,
                            function(info, tab) {
                                LinkGraph.markResource(info.pageUrl);
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Support',
                            markPage,
                            function(info, tab) {
                                LinkGraph.markSupport(info.pageUrl);
                            }));
                        chrome.contextMenus.create(createPageMenuItem(
                            'Unread',
                            markPage,
                            function(info, tab) {
                                LinkGraph.markUnread(info.pageUrl);
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
                    LinkGraph.addUnreadNode(info.linkUrl, null, null, null, info.pageUrl);
                }
            }});
    } else {
        chrome.contextMenus.create(createPageMenuItem(
            'Add page to tree',
            root,
            function(info, tab) {
                LinkGraph.addUnreadNode(info.pageUrl, tab.title);
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