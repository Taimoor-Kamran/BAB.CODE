import { useState, useEffect } from "react";
import type { VirtualFile } from "./utils/fileSystem";
import { defaultFiles } from "./utils/fileSystem";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/Editor";
import Toolbar from "./components/Toolbar";
import { demoTemplates } from "./templates";
import Terminal from "./components/Terminal";
import Logo from "./components/Logo";

function App() {
  const [files, setFiles] = useState<VirtualFile[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<VirtualFile>(defaultFiles[0]);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [showAiTerminal, setShowAiTerminal] = useState(false);
  const [showOutputTerminal, setShowOutputTerminal] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedShell, setSelectedShell] = useState("cmd");

  useEffect(() => {
    const handleAiMessage = (e: any) => {
      const messages = e.detail;
      setAiMessages((prev) => [...prev, ...messages]);
    };
    window.addEventListener("ai-message", handleAiMessage);
    return () => window.removeEventListener("ai-message", handleAiMessage);
  }, []);

  const handleTerminalCommand = (cmd: string, shellType: string) => {
  window.electronAPI.sendCommand({ shell: shellType, command: cmd });
};


  const handleAiCommand = (cmd: string) => {
    if (cmd.trim()) {
      setAiMessages((prev) => [
        ...prev,
        `> ${cmd}`,
        `🤖 AI Response to: ${cmd}`,
      ]);
    }
  };

  const updateFileContent = (content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.name === activeFile.name ? { ...f, content } : f))
    );
    setActiveFile((prev) => ({ ...prev, content }));
  };

  const runCode = () => {
    const result = `▶ Running ${activeFile.name}\n${activeFile.content}`;
    setTerminalMessages((prev) => [...prev, result]);
  };

  const loadTemplates = () => {
    setFiles(demoTemplates);
    setActiveFile(demoTemplates[0]);
    setTerminalMessages([]);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white relative">
      {/* Top bar for mobile */}
      <div className="lg:hidden flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-gray-700">
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="text-white"
        >
          📂
        </button>
        <Logo />
        <button onClick={() => setShowAiTerminal(true)} className="text-white">
          💬
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 lg:w-1/5 bg-[#252526] p-4 flex flex-col justify-between fixed lg:static inset-y-0 left-0 z-40 lg:z-auto">
            <div>
              <header className="w-full border-gray-200 shadow-sm mb-4">
                <h1 className="text-2xl font-bold text-blue-600 text-center">
                  <Logo />
                </h1>
              </header>
              <Toolbar
                files={files}
                setFiles={setFiles}
                setActiveFile={setActiveFile}
              />
              <FileExplorer files={files} onSelect={setActiveFile} />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={runCode}
                className="bg-green-600 text-black px-3 py-2 rounded hover:bg-green-700 text-sm"
              >
                ▶ Run
              </button>
              <button
                onClick={loadTemplates}
                className="bg-purple-600 text-black px-3 py-2 rounded hover:bg-purple-700 text-sm"
              >
                📂 Load Templates
              </button>
              {!showOutputTerminal && (
                <button
                  onClick={() => setShowOutputTerminal(true)}
                  className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm"
                >
                  📟 Show Output Terminal
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col relative lg:ml-0 ml-64">
          {/* Editor */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <CodeEditor file={activeFile} onChange={updateFileContent} />
          </div>

          {/* Output Terminal */}
          {showOutputTerminal && (
            <div className="flex border-t border-gray-700 h-48 sm:h-56 lg:h-64">
              <div className="w-full">
                <div className="flex justify-between items-center px-2 bg-[#2d2d2d] text-sm border-b border-gray-600">
                  <span>Output Terminal</span>
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedShell}
                      onChange={(e) => setSelectedShell(e.target.value)}
                      className="bg-black text-white text-xs border border-gray-500 px-1 rounded"
                    >
                      <option value="cmd">Command Prompt</option>
                      <option value="powershell">PowerShell</option>
                      <option value="bash">Git Bash</option>
                      <option value="ubuntu">Ubuntu</option>
                    </select>
                    <button
                      className="text-white"
                      onClick={() => setShowAiTerminal(true)}
                    >
                      💬 Ask AI
                    </button>
                    <button
                      className="text-white"
                      onClick={() => setShowOutputTerminal(false)}
                    >
                      ✖
                    </button>
                  </div>
                </div>

                <Terminal
                  output={terminalMessages}
                  onCommandSubmit={(cmd) =>
                    handleTerminalCommand(cmd, selectedShell)
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Terminal Overlay */}
      {showAiTerminal && (
        <div className="absolute top-0 right-0 h-full w-full lg:w-96 bg-black border-l border-gray-700 flex flex-col z-50">
          <div className="flex justify-between items-center px-2 py-1 text-sm border-b border-gray-600 text-white">
            <span>AI Terminal</span>
            <button
              className="text-white p-0 m-0 border-none bg-transparent"
              onClick={() => setShowAiTerminal(false)}
            >
              ✖
            </button>
          </div>
          <Terminal
            output={aiMessages}
            onCommandSubmit={handleAiCommand}
            isAiTerminal
          />
        </div>
      )}
    </div>
  );
}

export default App;
