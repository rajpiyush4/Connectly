"use client";

import { useEffect, useRef, useState } from "react";

const commandPrefix = process.env.NEXT_PUBLIC_COMMAND_PREFIX || ">";

const Instructions = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void; }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section id="instructions" ref={wrapperRef}>
      <div
        className="w-[35vw] min-w-[300px] h-[500px] shadow-lg fixed top-5 right-5 z-10 rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto border border-[#00c8ff]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#00c8ff]">Instructions</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 text-xl font-bold transition cursor-pointer"
          >
            ×
          </button>
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><span className="text-[#000000] font-bold">{'>'}{commandPrefix} create-room</span> — create a new room</li>
          <li><span className="text-[#000] font-bold">{'>'}{commandPrefix} join-room [roomId]</span> — join an existing room</li>
          <li><span className="text-[#000] font-bold">{'>'}{commandPrefix} help</span> — list all commands</li>
          <li><span className="text-[#000] font-bold">{'>'}{commandPrefix} clear</span> — clear the console</li>
          <li><span className="text-[#000] font-bold">{'>'}{commandPrefix} exit</span> — disconnect and leave</li>
        </ul>
        <div className="mt-auto text-xs text-[#9e9e9e]">
          Tip: Commands are case-sensitive!
        </div>
      </div>
    </section>
  );
};


function InstructionWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        {!isOpen ? <button
          onClick={() => setIsOpen(true)}
          className="fixed top-5 right-5 bg-[#00c8ff] text-black px-4 py-2 rounded-full shadow-lg hover:bg-[#00aacc] transition cursor-pointer"
        >
          i
        </button>
          :
          <Instructions
            setIsOpen={setIsOpen}
          />}

      </div>
    </>
  )

}

export default InstructionWrapper;
