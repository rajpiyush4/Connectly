'use client'

import { useContext, useState, createContext, useRef, RefObject} from "react";

type Log = { cmd: string; msg: string };
type CmdContextType = {
    logs: Log[],
    setLogs: React.Dispatch<React.SetStateAction<Log[]>>
    dcRef: RefObject<RTCDataChannel | null>;
};

const CMDContext = createContext<CmdContextType | null>(null);

const CMDProvider = ({ children }: { children: React.ReactNode }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const dcRef = useRef<RTCDataChannel | null>(null);

    return (
        <CMDContext.Provider value={{ logs, setLogs, dcRef }}>
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