import { useState } from "react";
import type { VirtualFile } from "./utils/fileSystem";
import { defaultFiles } from "./utils/fileSystem";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/Editor";
import Toolbar from "./components/Toolbar";
import { demoTemplates } from "./templates";
import Terminal from "./components/Terminal";
import { useEffect } from "react";
import Logo from "./components/Logo";

function App() {
  const [files, setFiles] = useState<VirtualFile[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<VirtualFile>(defaultFiles[0]);
  // const [output, setOutput] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  const [showAiInput, setShowAiInput] = useState(false); // NEW

  useEffect(() => {
    const handleAiMessage = (e: any) => {
      const messages = e.detail;
      setTerminalMessages((prev) => [...prev, ...messages]);
    };

    window.addEventListener("ai-message", handleAiMessage);
    return () => {
      window.removeEventListener("ai-message", handleAiMessage);
    };
  }, []);

  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = terminalCommand.trim();

      if (cmd === "run") {
        const result =
          `▶ Simulated run of ${activeFile.name}\n` + activeFile.content;
        setTerminalMessages((prev) => [...prev, `> ${cmd}`, result]);
      } else if (cmd === "clear") {
        setTerminalMessages([]);
      } else {
        setTerminalMessages((prev) => [
          ...prev,
          `> ${cmd}`,
          `Unknown command: ${cmd}`,
        ]);
      }

      setTerminalCommand("");
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
    // setOutput("// Loaded template files");
    setTerminalMessages([]);
  };

  const toggleAiInput = () => {
    setShowAiInput((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#252526] p-4 flex flex-col justify-between">
          <div>
            <header className="w-full border-gray-200 shadow-sm">
              <h1 className="text-2xl font-bold text-blue-600 text-center"><Logo/></h1>
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
          </div>
        </div>

        {/* Main Area */}
        <div className="w-full h-screen flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditor file={activeFile} onChange={updateFileContent} />
          </div>

          {/* Terminal */}
          <Terminal
            output={terminalMessages.join("\n")}
            command={terminalCommand}
            onCommandChange={setTerminalCommand}
            onCommandSubmit={handleTerminalCommand}
            aiPrompt={aiPrompt}
            onAiPromptChange={setAiPrompt}
            showAiInput={showAiInput}
            onToggleAiInput={toggleAiInput}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
