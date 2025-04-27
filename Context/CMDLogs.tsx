'use client'

import { useContext, useState, createContext} from "react";

type Log = { cmd: string; msg: string };
type CmdContextType = {
    logs: Log[],
    setLogs: React.Dispatch<React.SetStateAction<Log[]>>
};

const CMDContext = createContext<CmdContextType | null>(null);

const CMDProvider = ({ children }: { children: React.ReactNode }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    return (
        <CMDContext.Provider value={{ logs, setLogs }}>
            {children}
        </CMDContext.Provider>
    );
};

export default CMDProvider;

export const useCMD = () => {
    const context = useContext(CMDContext);
    if (!context) {
        throw new Error("useCMD must be used within a CMDProvider");
    }
    return context;
};