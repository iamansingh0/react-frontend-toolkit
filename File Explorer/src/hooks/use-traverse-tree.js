const useTraverseTree = () => {
    function insertNode(tree, folderId, item, isFolder) {
        if(tree.id === folderId && tree.isFolder) {
            tree.items.unshift({
                id: new Date().getTime(),
                name: item,
                isFolder,
                items: []
            })
            return tree;
        }

        // Depth First Search
        let latestNode = []
        latestNode = tree.items.map((ob) => {
            return insertNode(ob, folderId, item, isFolder);
        })

        return {...tree, items: latestNode};
    }

    function deleteNode(tree, nodeId) {
        if (tree.id === nodeId) {
            // Return null to signify this node should be removed
            return null;
        }

        if(tree.isFolder) {
            const filteredItems = tree.items
                .map((item) => deleteNode(item, nodeId))
                .filter(item => item != null)
            
            return { ...tree, items: filteredItems };
        }
        return tree;
    }

    function updateNode(tree, nodeId, newName) {
        if(tree.id === nodeId) {
            return { ...tree, name: newName };
        }

        if (tree.isFolder) {
            const updatedItems = tree.items.map(item => updateNode(item, nodeId, newName));
            return { ...tree, items: updatedItems };
        }
        return tree;
    }

    return { insertNode, deleteNode, updateNode };
}

export default useTraverseTree;