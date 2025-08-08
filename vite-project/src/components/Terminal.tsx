import React, { useState } from "react";

interface TerminalProps {
  output: string;
  command: string;
  onCommandChange: (value: string) => void;
  onCommandSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  aiPrompt: string;
  onAiPromptChange: (value: string) => void;
  showAiInput: boolean;
  onToggleAiInput: () => void;
}

const Terminal: React.FC<TerminalProps> = ({
  output,
  command,
  onCommandChange,
  onCommandSubmit,
  aiPrompt,
  onAiPromptChange,
  showAiInput,
  onToggleAiInput,
}) => {
  const [showShellDropdown, setShowShellDropdown] = useState(false);

  const shells = ["CMD", "PowerShell", "Ubuntu", "Git Bash"];

  return (
    <div className="bg-black text-white text-sm p-2 border-t border-gray-700">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <button
            onClick={onToggleAiInput}
            className="px-2 py-1 text-black bg-blue-600 rounded text-xs hover:bg-blue-700"
          >
            🤖 Ask AI
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowShellDropdown(!showShellDropdown)}
            className="px-2 py-1 bg-gray-700 text-black rounded text-xs hover:bg-gray-600"
          >
            +
          </button>

          {showShellDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-[#1e1e1e] border border-gray-600 rounded shadow-lg z-10">
              {shells.map((shell) => (
                <div
                  key={shell}
                  className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    console.log(`Switched to ${shell}`);
                    setShowShellDropdown(false);
                  }}
                >
                  {shell}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAiInput && (
        <div className="mb-2">
          <input
            value={aiPrompt}
            onChange={(e) => onAiPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && aiPrompt.trim()) {
                const prompt = aiPrompt.trim();

                // Simulate an AI response (you can replace this with a real API call)
                const simulatedResponse = `🤖 AI Response: This is a response to "${prompt}"`;

                // Push both prompt and response to terminal
                onCommandSubmit({
                  key: "Enter",
                  preventDefault: () => {},
                } as unknown as React.KeyboardEvent<HTMLInputElement>);

                onAiPromptChange(""); // Clear input

                // If terminal messages are managed in App, update from there:
                // Suggest: Add a new prop like onAiSubmit(prompt: string) → then call it here

                // OR if you already pass a function to handle output, use that here:
                if (typeof window !== "undefined" && window.dispatchEvent) {
                  window.dispatchEvent(
                    new CustomEvent("ai-message", {
                      detail: [`> ${prompt}`, simulatedResponse],
                    })
                  );
                }
              }
            }}
            placeholder="Ask Anything?"
            className="w-full px-2 py-1 bg-[#1e1e1e] border border-gray-600 text-white rounded"
          />
        </div>
      )}
      {/* Terminal Output */}
      <div className="h-40 overflow-y-auto whitespace-pre-wrap font-mono bg-[#1e1e1e] p-2 rounded border border-gray-700 mb-2">
        {output}
      </div>

      {/* Terminal Input */}
      <input
        type="text"
        value={command}
        onChange={(e) => onCommandChange(e.target.value)}
        onKeyDown={onCommandSubmit}
        placeholder="Type a command..."
        className="w-full px-2 py-1 bg-[#1e1e1e] border border-gray-600 text-white rounded"
      />
    </div>
  );
};

export default Terminal;
