import React, { useState } from "react";

interface ChatPanelProps {
  onCodeGenerated: (code: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleGenerateCode = async () => {
    setLoading(true);
    setResponse("Generating code...");

    try {
      // Simulated AI response — replace with real API later
      const fakeAIResponse = `def reverse_string(s):\n    return s[::-1]`;
      setTimeout(() => {
        setResponse(fakeAIResponse);
        onCodeGenerated(fakeAIResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setResponse("Failed to generate code.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t h-full flex flex-col">
      <textarea
        className="border rounded p-2 mb-2 w-full"
        placeholder="Ask AI to generate code..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerateCode}
        className="bg-blue-600 text-white rounded px-4 py-2"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Code"}
      </button>
      <pre className="mt-4 bg-gray-900 text-green-300 p-2 rounded overflow-auto">
        {response || "// AI output will show here..."}
      </pre>
    </div>
  );
};

export default ChatPanel;
