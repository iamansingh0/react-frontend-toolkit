import React, { useState } from "react";

const Folder = ({ explorer, handleInsertNode, handleDeleteNode, handleUpdateNode }) => {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
    mode: "add",
  });

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
      mode: "add"
    });
  };
  
  const handleRename = (e) => {
    e.stopPropagation();
    setShowInput({
      visible: true,
      isFolder: explorer.isFolder,
      mode: "rename"
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${explorer.isFolder ? "folder" : "file"} "${explorer.name}"?`)) {
      handleDeleteNode(explorer.id);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      if (showInput.mode === "add") {
        handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
      } else if (showInput.mode === "rename") {
        handleUpdateNode(explorer.id, e.target.value);
      }
      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.isFolder) {
    return (
      <div style={{ marginTop: 5 }}>
        <div
          className="folder"
          onClick={() => {
            setExpand(!expand);
          }}
        >
          <span>📁 {explorer.name}</span>
          {!showInput.visible || showInput.mode !== "rename" ? (
            <div>
              <button onClick={(e) => handleNewFolder(e, true)}>📂</button>
              <button onClick={(e) => handleNewFolder(e, false)}>📝</button>
              <button onClick={handleRename}>✏️</button>
              <button onClick={handleDelete}>🗑️</button>
            </div>
          ) : null}
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput.visible && showInput.mode === "add" && (
            <div className="inputContainer">
              <span>{showInput.isFolder ? "📁" : "📃"}</span>
              <input 
                type="text"
                autoFocus
                onBlur={() => setShowInput({...showInput, visible: false})}
                className="inputContainer__input"
                onKeyDown={onInputKeyDown}
              />
            </div>
          )}

          {showInput.visible && showInput.mode === "rename" && (
            <div className="inputContainer">
              <span>{explorer.isFolder ? "📁" : "📃"}</span>
              <input 
                type="text"
                autoFocus
                defaultValue={explorer.name}
                onBlur={() => setShowInput({...showInput, visible: false})}
                className="inputContainer__input"
                onKeyDown={onInputKeyDown}
              />
            </div>
          )}

          {explorer.items.map((item) => {
            return (
              <Folder 
                explorer={item} 
                handleInsertNode={handleInsertNode}
                handleDeleteNode={handleDeleteNode}
                handleUpdateNode={handleUpdateNode}
                key={item.id} 
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="file-container">
        {showInput.visible && showInput.mode === "rename" ? (
          <div className="inputContainer">
            <span>📃</span>
            <input 
              type="text"
              autoFocus
              defaultValue={explorer.name}
              onBlur={() => setShowInput({...showInput, visible: false})}
              className="inputContainer__input"
              onKeyDown={onInputKeyDown}
            />
          </div>
        ) : (
          <div className="file-info">
            <span className="file">📃 {explorer.name}</span>
            <div className="file-actions">
              <button onClick={handleRename}>✏️</button>
              <button onClick={handleDelete}>🗑️</button>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Folder;