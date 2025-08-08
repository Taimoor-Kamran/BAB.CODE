import React, { useState } from "react";
import type { VirtualFile } from "../utils/fileSystem";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

interface FileExplorerProps {
  files: VirtualFile[];
  onSelect: (file: VirtualFile) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({  }) => {
  return (
    <div className="space-y-1">

    </div>
  );
};

interface FileItemProps {
  file: VirtualFile;
  onSelect: (file: VirtualFile) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = Array.isArray((file as any).children);

  if (isFolder) {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] rounded text-gray-200"
        >
          {isOpen ? <FaFolderOpen /> : <FaFolder />}
          <span>{file.name}</span>
        </div>
        {isOpen && (
          <div className="pl-6">
            {(file as any).children.map((child: VirtualFile) => (
              <FileItem key={child.name} file={child} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(file)}
      className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] rounded text-gray-200"
    >
      <FaFile />
      <span>{file.name}</span>
    </div>
  );
};

export default FileExplorer;
