import React, { useState, useRef, useEffect } from "react";
import type { VirtualFile } from "../utils/fileSystem";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface ToolbarProps {
  files: VirtualFile[];
  setFiles: React.Dispatch<React.SetStateAction<VirtualFile[]>>;
  setActiveFile: (file: VirtualFile) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  files,
  setFiles,
  setActiveFile,
}) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputMode, setInputMode] = useState<"file" | "folder" | "delete" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetFile: null as VirtualFile | null,
  });

  // Hide input on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setInputMode(null);
        setInputValue("");
      }
      if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    );
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !inputValue.trim()) return;
    const trimmedName = inputValue.trim();

    if (inputMode === "file") {
      if (files.some((f) => f.name === trimmedName)) return;
      const newFile: VirtualFile = { name: trimmedName, content: "// new file" };
      setFiles([...files, newFile]);
      setActiveFile(newFile);
    }

    if (inputMode === "folder") {
      if (files.some((f) => f.name === trimmedName)) return;
      const newFolder: VirtualFile = { name: trimmedName, content: "", children: [] as VirtualFile[] };
      setFiles([...files, newFolder]);
      setOpenFolders((prev) => [...prev, trimmedName]);
    }

    if (inputMode === "delete") {
      const remaining = files.filter((f) => f.name !== trimmedName);
      setFiles(remaining);
      setActiveFile(remaining[0] || { name: "", content: "" });
    }

    setInputMode(null);
    setInputValue("");
  };

  const refreshExplorer = () => setRefreshKey((prev) => prev + 1);

  // File Operations
  const renameFile = (file: VirtualFile) => {
    const newName = prompt("Enter new name", file.name);
    if (!newName) return;
    setFiles((prev) =>
      prev.map((f) => (f === file ? { ...f, name: newName } : f))
    );
  };

  const deleteFile = (file: VirtualFile) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  const copyFile = (file: VirtualFile) => {
    const copyName = `${file.name}_copy`;
    setFiles((prev) => [...prev, { ...file, name: copyName }]);
  };

  const handleContextMenu = (e: React.MouseEvent, file: VirtualFile) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetFile: file,
    });
  };

  const renderFiles = (items: VirtualFile[], level = 0) => {
    return items.map((file, index) => {
      const isFolder = file.children !== undefined;
      const isOpen = openFolders.includes(file.name);

      return (
        <div key={index} style={{ paddingLeft: level * 12 }}>
          {isFolder ? (
            <>
              <div
                onClick={() => toggleFolder(file.name)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
              >
                <i
                  className={`fas ${isOpen ? "fa-folder-open" : "fa-folder"} text-gray-400`}
                ></i>
                <span>{file.name}</span>
              </div>
              {isOpen && renderFiles(file.children!, level + 1)}
            </>
          ) : (
            <div
              onClick={() => setActiveFile(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-6 py-1 rounded"
            >
              <i className="fas fa-file-code text-gray-400"></i>
              <span>{file.name}</span>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="bg-transparent text-white h-full w-68 pt-2 overflow-y-auto text-sm border-2 rounded-2xl border-gray-500"
      key={refreshKey}
    >
      {/* Top icons bar */}
      <div className="flex gap-3 mb-2 px-3 pt-2 mx-auto my-auto">
        <i className="fas fa-file text-white cursor-pointer hover:text-white" title="New File" onClick={() => setInputMode("file")}></i>
        <i className="fas fa-trash text-white cursor-pointer hover:text-white" title="Delete File" onClick={() => setInputMode("delete")}></i>
        <i className="fas fa-folder-plus text-white cursor-pointer hover:text-white" title="New Folder" onClick={() => setInputMode("folder")}></i>
        <i className="fas fa-sync-alt text-white cursor-pointer hover:text-white" title="Refresh Explorer" onClick={refreshExplorer}></i>
      </div>

      {/* Inline input */}
      {inputMode && (
        <div className="px-3 pb-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={`Enter ${inputMode} name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSubmit}
            className="w-full px-2 py-1 text-white rounded text-sm"
            autoFocus
          />
        </div>
      )}

      {/* File/Folder list */}
      {renderFiles(files)}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "#252526",
            color: "white",
            border: "1px solid #333",
            borderRadius: "4px",
            padding: "4px 0",
            zIndex: 9999,
            minWidth: "150px",
          }}
        >
          <div className="px-3 py-1 hover:bg-[#094771] cursor-pointer" onClick={() => renameFile(contextMenu.targetFile!)}>
            Rename
          </div>
          <div className="px-3 py-1 hover:bg-[#094771] cursor-pointer" onClick={() => deleteFile(contextMenu.targetFile!)}>
            Delete
          </div>
          <div className="px-3 py-1 hover:bg-[#094771] cursor-pointer" onClick={() => copyFile(contextMenu.targetFile!)}>
            Copy
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
