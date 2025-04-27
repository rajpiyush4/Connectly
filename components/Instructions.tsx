"use client";

import { useState } from "react";

const commandPrefix = process.env.NEXT_PUBLIC_COMMAND_PREFIX as string;

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 right-5 bg-[#00c8ff] text-black px-4 py-2 rounded-full shadow-lg hover:bg-[#00aacc] transition cursor-pointer"
      >
        Show Instructions
      </button>
    );
  }

  return (
    <section className="w-[400px] h-[500px] shadow-lg fixed top-5 right-5 z-10 bg-[#1e1e1e] text-[#e0e0e0] rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#00c8ff]">instructions</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#e0e0e0] hover:text-red-400 text-xl font-bold transition cursor-pointer"
        >
          ×
        </button>
      </div>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li><span className="text-[#7CFC00]">{'>'}{commandPrefix} create-room</span> — create a new room</li>
        <li><span className="text-[#7CFC00]">{'>'}{commandPrefix} join-room [roomId]</span> — join an existing room</li>
        <li><span className="text-[#7CFC00]">{'>'}{commandPrefix} help</span> — list all commands</li>
        <li><span className="text-[#7CFC00]">{'>'}{commandPrefix} clear</span> — clear the console</li>
        <li><span className="text-[#7CFC00]">{'>'}{commandPrefix} exit</span> — disconnect and leave</li>
      </ul>
      <div className="mt-auto text-xs text-[#9e9e9e]">
        Tip: Commands are case-sensitive!
      </div>
    </section>
  );
};

export default Instructions;
