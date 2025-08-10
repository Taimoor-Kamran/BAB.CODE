import { useState, useRef, useEffect } from "react";

interface TerminalProps {
  output: string[];
  onCommandSubmit: (cmd: string) => void;
  isAiTerminal?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ output, onCommandSubmit, isAiTerminal }) => {
  const [currentLine, setCurrentLine] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cmd = currentLine.trim();
      if (cmd) onCommandSubmit(cmd);
      setCurrentLine("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex flex-col h-40 sm:h-48 lg:h-64 border-t border-gray-700 bg-black text-white font-mono">
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 text-sm">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div className="flex mt-1">
          <span className={isAiTerminal ? "text-purple-400" : "text-green-400"}>
            {isAiTerminal ? "🤖" : "$"}
          </span>
          <textarea
            value={currentLine}
            onChange={(e) => setCurrentLine(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-black resize-none outline-none pl-1"
            rows={1}
            placeholder={isAiTerminal ? "Ask AI..." : "Type a command..."}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
