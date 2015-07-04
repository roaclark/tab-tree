This is a chrome extension to help track sites. Sites are represented as nodes in a graph. When you navigate to a related page or begin a search, you can add that new page as a child of your current page. Unread nodes are marked so that you can easily return to them without leaving the tab open.

Installation
------------

1. Clone the repository `git clone https://github.com/roaclark/tab-tree.git` **OR** Download the project as a zip and unpack it

2. Go to `chrome://extensions` in your browser.

3. Select the 'Developer mode' checkbox if it is not already selected.

4. Click on 'Load unpacked extensions...'

5. Select the directory that you cloned the source code into.

Usage
-----

###Context Menus

Context menus are used to conveniently add pages from a tab. The following context menus are available:

* "Add page to tree" (when page is not in tree) - Adds the page in the active tab to the tree. The title of the tab is used. No description is provided. The page is marked as unread. Unread nodes are gray by default.
* "TabTree / Remove Page From Tree" (when page is in tree) - Removes the page in the active tab from the tree.
* "TabTree / Update page / Change title" (when page is in tree) - Updates the value stored as the title for the page in the active tab.
* "TabTree / Update page / Change description" (when page is in tree) - Updates the value stored as the description for the page in the active tab.
* "TabTree / Change color..." (when page is in tree) - Changes color of the page node.
* "TabTree / Search from this page" (when page is in tree) - Prompts the user for a search query. Creates a new search page node in the tree to represent the search. Opens a Google search for the query in a new tab. Search nodes are blue by default.
* "Add this link as a child page" (when page is in tree and link is selected) - Adds the link destination to the tree as a new page node. The node is marked as unread with no title or description. Also adds an edge from the page in the active tab to the newly created page.

###Application

The application is used to visualize the tree. Each node represents one page as defined through context menus or the application itself. Edges represent links between pages.

The following user interactions are available:

* Shift + drag - Creates a new link between the source and destination nodes.
* Node + drag - Moves a node.
* Drag - Pans across the graph.
* Scroll - Zooms in and out in the graph
* Hover - Displays the node title.
* Click on node - Displays page info in the panel on the right side. Also includes editing options.
* Click on background - Clears information panel.
* Double click on node - Opens the page in a new tab.
* Double click on background - Adds a new organization node. Prompts the user for the title and description. Organization nodes have dashed outlines and are white by default.
* Delete - Removes any selected nodes from the graph.

The icon in the upper left corner triggers automatic layout adjustment.
