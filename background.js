chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: "visualization/graph-viewer.html"});
});

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

createLinkMenuItem = function(title, parent, onclick) {
	var menuItem = {
		title: title,
		contexts: ['link']
	}
	if (parent) {
		menuItem.parentId = parent;
	}
	if (onclick) {
		menuItem.onclick = onclick;
	}
	return menuItem;
}

var root = chrome.contextMenus.create({
	title: 'Research Tree', contexts: ['page']},
	function() {
		chrome.contextMenus.create(createPageMenuItem(
			'Add page to tree',
			root,
			function (evt, tab) {
				alert('adding')
			}));
		chrome.contextMenus.create(createPageMenuItem(
			'Remove page from tree',
			root,
			function (evt, tab) {
				alert('removing')
			}));
		chrome.contextMenus.create(createPageMenuItem(
			'Link to another page',
			root,
			function (evt, tab) {
				alert('linking')
			}));
		var updatePage = chrome.contextMenus.create(createPageMenuItem(
			'Update page',
			root),
			function() {
				chrome.contextMenus.create(createPageMenuItem(
					'Change title',
					updatePage,
					function (evt, tab) {
						alert('title')
					}));
				chrome.contextMenus.create(createPageMenuItem(
					'Change description',
					updatePage,
					function (evt, tab) {
						alert('description')
					}));
			});
		var markPage = chrome.contextMenus.create(createPageMenuItem(
			'Mark page as...',
			root),
			function() {
				chrome.contextMenus.create(createPageMenuItem(
					'Resource',
					markPage,
					function (evt, tab) {
						alert('resource')
					}));
				chrome.contextMenus.create(createPageMenuItem(
					'Support',
					markPage,
					function (evt, tab) {
						alert('support')
					}));
				chrome.contextMenus.create(createPageMenuItem(
					'Unread',
					markPage,
					function (evt, tab) {
						alert('unread')
					}));
			});
		chrome.contextMenus.create({type: 'separator', parentId: root});
		chrome.contextMenus.create(createPageMenuItem(
			'Search from this page',
			root,
			function (evt, tab) {
				alert('searching')
			}));
});

chrome.contextMenus.create(createLinkMenuItem(
	'Add this link as child page',
	undefined,
	function (evt, tab) {
		alert('child page')
	}));