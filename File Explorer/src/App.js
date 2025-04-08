import Folder from './components/Folder';
import explorer from './data/folderData';
import useTraverseTree from './hooks/use-traverse-tree';
import './styles.css';
import { useState } from "react"

export default function App() {
    const [explorerData, setExplorerData] = useState(explorer);

    const { insertNode, deleteNode, updateNode } = useTraverseTree();

    const handleInsertNode = (folderId, item, isFolder) => {
        const finalTree = insertNode(explorerData, folderId, item, isFolder);
        setExplorerData(finalTree);
    }

    const handleDeleteNode = (nodeId) => {
        const finalTree = deleteNode(explorerData, nodeId);
        setExplorerData(finalTree);
    }

    const handleUpdateNode = (nodeId, newName) => {
        const finalTree = updateNode(explorerData, nodeId, newName);
        setExplorerData(finalTree);
    }

    return <div className="App">
        <Folder 
            explorer={explorerData} 
            handleInsertNode={handleInsertNode} 
            handleDeleteNode={handleDeleteNode}
            handleUpdateNode={handleUpdateNode}
        />
    </div>
}