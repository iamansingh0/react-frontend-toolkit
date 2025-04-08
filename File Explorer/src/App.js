import Folder from './components/Folder';
import explorer from './data/folderData';
import './styles.css';
import { useState } from "react"

export default function App() {
    const [explorerData, setExplorerData] = useState(explorer);

    return <div className="App">
        <Folder explorer={explorerData}/>
    </div>
}