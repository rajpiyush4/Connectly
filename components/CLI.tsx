'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCMD } from "@/Context/CMDLogs";
import { start } from "repl";

const commandPrefix = process.env.NEXT_PUBLIC_COMMAND_PREFIX as string;

// One issue is the setcommand and command are not from context so let's say if i input something and without pressing enter I move to another page/route the command will not be there, Although not a big issue but can give the user the impression of cli is not in sync.
const CLI = () => {
    const [command, setCommand] = useState('');
    const router = useRouter();
    const cmd = useCMD();

    const handleGetMessage = (commandMsg: string) => {
        // cmd.dcRef.current?.send(command);
        // setCommand('');
        // format command message, it will be in format 'send(message)' so extact message
        const regex = /^(send)\((.*)\)$/;
        const msg = commandMsg.match(regex)?.[2];
        return msg;
    }

    const handleSubmitCommand = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (command.startsWith(commandPrefix)) {
            switch (command.slice(commandPrefix.length + 1)) {
                case 'clear':
                    cmd.setLogs([]);
                    break;
                case 'help':
                    cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Available commands: help, create-room, join-room, exit' }]);
                    break;
                case 'create-room':
                    cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Room created' }]);
                    router.push(`/room/1/?creator=true`);
                    break;
                case 'join-room':
                    cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Room joined' }]);
                    router.push('/room/1');
                    break;
                // case 'send':  
                //     const msg = handleGetMessage(command); 
                //     cmd.dcRef.current?.send(msg ? msg : 'No message provided');
                //     break;
                case 'exit':
                    cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Disconnected' }]);
                    router.push('/');
                    break;
                default:
                    console.log('indefault',command.slice(commandPrefix.length + 1).startsWith('send') )
                    if (command.slice(commandPrefix.length + 1).startsWith('send')){
                        const msg = handleGetMessage(command.slice(commandPrefix.length + 1));
                        console.log(msg)
                        cmd.dcRef.current?.send(msg ? msg : 'No message provided');
                        cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: `Message sent: ${msg}` }]);
                        return;
                    }
                    cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: 'Unknown command' }]);
            }
        } else {
            cmd.setLogs(prev => [...prev, { cmd: `> ${command}`, msg: `Unknown command: ${command}` }]);
        }
        setCommand('');
    }

    return (
        <>
            <main className="p-6 bg-[#f1f1f1] text-[#242021] font-mono">
                <p className="text-2xl font-bold mb-6">welcome to connectly [beta.exe]! [version 0.1]</p>
                <p className="text-sm text-[#666]">you are the admin now. good luck!</p>

                <section className="pt-6 space-y-4">
                    {cmd.logs.map((log, index) => (
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