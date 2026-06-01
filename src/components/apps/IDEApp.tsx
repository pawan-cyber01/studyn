"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, Terminal, Sparkles, FileCode2, Save, PanelLeft, Maximize2, Trash2, SplitSquareHorizontal } from "lucide-react";
import { WindowInstance } from "@/store/useOSStore";
import { cn } from "@/lib/utils";

type Language = "javascript" | "html" | "css" | "python" | "java" | "cpp";

interface File {
  id: string;
  name: string;
  language: Language;
  content: string;
}

const DEFAULT_FILES: File[] = [
  { id: "1", name: "main.js", language: "javascript", content: "console.log('Hello, Studyn!');\n\nfunction calculate(a, b) {\n  return a + b;\n}\n\nconsole.log(calculate(10, 5));" },
  { id: "2", name: "style.css", language: "css", content: "body {\n  background: #0a0a0a;\n  color: #fff;\n}" },
  { id: "3", name: "index.html", language: "html", content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Studyn App</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n</body>\n</html>" },
];

export default function IDEApp({ window }: { window: WindowInstance }) {
  const [files, setFiles] = useState<File[]>(() => {
    if (typeof globalThis.window !== "undefined") {
      const saved = localStorage.getItem(`studyn-ide-files`);
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    }
    return DEFAULT_FILES;
  });
  
  const [activeFileId, setActiveFileId] = useState("1");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Studyn Terminal v1.0", "Ready."]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [splitScreen, setSplitScreen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    localStorage.setItem(`studyn-ide-files`, JSON.stringify(files));
  }, [files]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(files.map(f => f.id === activeFileId ? { ...f, content: value } : f));
    }
  };

  const executeCode = () => {
    setTerminalOutput(["Executing..."]);
    if (activeFile.language === "javascript") {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(" "));
          originalLog(...args);
        };
        
        // eslint-disable-next-line no-eval
        const result = eval(activeFile.content);
        
        console.log = originalLog;
        
        setTerminalOutput([...logs, `\n> exited with code 0${result !== undefined ? ` (returns ${result})` : ''}`]);
      } catch (err: any) {
        setTerminalOutput([`Error: ${err.message}`]);
      }
    } else {
      setTimeout(() => {
        setTerminalOutput([`Execution for ${activeFile.language} requires a backend engine.`, `Mocking output...`, `\n> exited with code 0`]);
      }, 800);
    }
  };

  const getAIHelp = () => {
    setAiSuggestion("Analyzing code...");
    setTimeout(() => {
      setAiSuggestion("Suggestion: Consider using arrow functions for a more modern syntax, e.g., `const calculate = (a, b) => a + b;`");
    }, 1500);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-white/10 bg-[#181818] flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-white/40">Explorer</div>
            <div className="flex-1 overflow-y-auto py-2">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors text-left",
                    activeFileId === file.id ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                  )}
                >
                  <FileCode2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
            {aiSuggestion && (
              <div className="p-4 m-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </div>
                <div className="text-blue-200/80 leading-relaxed">{aiSuggestion}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Bar */}
        <div className="h-12 border-b border-white/10 bg-[#1e1e1e] flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center h-full">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg mr-2 transition-colors">
              <PanelLeft className="w-4 h-4 text-white/60" />
            </button>
            <div className="flex h-full">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 h-full border-r border-white/5 text-sm transition-colors",
                    activeFileId === file.id ? "bg-[#1e1e1e] border-t-2 border-t-blue-500 text-white" : "bg-black/20 text-white/40 hover:bg-[#1e1e1e]"
                  )}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <button onClick={getAIHelp} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-bold transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> AI Help
            </button>
            <button onClick={() => setSplitScreen(!splitScreen)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors" title="Toggle Split Terminal">
              <SplitSquareHorizontal className="w-4 h-4" />
            </button>
            <button onClick={executeCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-colors">
              <Play className="w-3.5 h-3.5 fill-current" /> Run
            </button>
          </div>
        </div>

        {/* Editor & Terminal Area */}
        <div className={cn("flex-1 flex", splitScreen ? "flex-col lg:flex-row" : "flex-col")}>
          <div className="flex-1 relative min-h-0 min-w-0">
            <Editor
              height="100%"
              theme="vs-dark"
              path={activeFile.name}
              language={activeFile.language}
              value={activeFile.content}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 1.6,
                padding: { top: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>
          
          <AnimatePresence>
            {(!splitScreen || splitScreen) && (
              <motion.div 
                className={cn("bg-[#111] border-white/10 flex flex-col min-h-[200px]", splitScreen ? "border-l w-1/3" : "border-t h-[30%]")}
              >
                <div className="h-8 border-b border-white/5 bg-[#181818] flex items-center px-4 text-xs font-bold text-white/40 uppercase tracking-widest flex shrink-0">
                  <Terminal className="w-3.5 h-3.5 mr-2" /> Output
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-white/80 whitespace-pre-wrap selection:bg-white/20 custom-scrollbar">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className="mb-1 leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
