'use client'

import { useState } from "react";
// import Instructions from "./Instructions";
import { useRouter, useSearchParams } from "next/navigation";
// import {  } from "next/router";
import { useCMD } from "@/Context/CMDLogs";

const commandPrefix = process.env.NEXT_PUBLIC_COMMAND_PREFIX as string;

const CLI = () => {
    const [logs, setLogs] = useState<{ cmd: string, msg: string }[]>([]);
    const [command, setCommand] = useState('');
    const router = useRouter();
    const cmd = useCMD();
    // const searchParams = useSearchParams();

    const handleSubmitCommand = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (command.startsWith(commandPrefix)) {
            switch (command.slice(commandPrefix.length + 1)) {
                case 'clear':
                    setLogs([]);
                    break;
                case 'help':
                    setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Available commands: help, create-room, join-room, exit' }]);
                    break;
                case 'create-room':
                    setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Room created' }]);
                    router.push(`?creator=true`);
                    break;
                case 'join-room':
                    setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Room joined' }]);
                    break;
                case 'exit':
                    setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Disconnected' }]);
                    break;
                default:
                    setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Unknown command' }]);
            }
        } else {
            setLogs(prev => [...prev, { cmd: `> ${command}`, msg: `Unknown command: ${command}` }]);
        }
        setCommand('');
    }

    return (
        <>
            <main className="min-h-screen p-6 bg-[#f1f1f1] text-[#242021] font-mono">
                <p className="text-2xl font-bold mb-6">welcome to connectly [beta.exe]! [version 0.1]</p>
                <p className="text-sm text-[#666]">you are the admin now. good luck!</p>

                <section className="pt-6 space-y-4">
                    {logs.map((log, index) => (
                        <div key={index} className="border-t border-[#ddd] pt-4">
                            <p className="text-[#333]">{log.cmd}</p>
                            <p className="text-[#777]">{log.msg}</p>
                        </div>
                    ))}

                    <form onSubmit={handleSubmitCommand} className="pt-6 flex items-center">
                        <label className="text-lg mr-2">{">"}</label>
                        <input
                            autoFocus
                            className="bg-transparent outline-none w-full text-md tracking-wide placeholder-gray-400 caret-black"
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="what's the mission, captain?"
                        />
                    </form>
                </section>
            </main>

        </>

    );
}

export default CLI;