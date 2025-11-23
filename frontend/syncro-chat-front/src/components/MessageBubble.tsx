import type { IMessage } from "../types/message";

export function MessageBubble({ user_name, content, timestamp, isOwnMessage = false }: IMessage) {
    
    const getInitials = (name: string) => {
        if (!name || typeof name !== "string") return "??";
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const date =
        typeof timestamp === "string"
            ? new Date(timestamp)
            : timestamp instanceof Date
            ? timestamp
            : new Date(String(timestamp));

    const time = isNaN(date.getTime())
        ? "--:--"
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className={`flex items-start gap-2.5 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isOwnMessage ? 'bg-[#1a1a1a]' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0`}>
                {getInitials(user_name)}
            </div>

            {/* Burbuja con cola */}
            <div className={`relative flex flex-col w-full max-w-[320px] leading-1.5 p-4 ${isOwnMessage ? 'bg-[#1a1a1a] text-white rounded-lg rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-lg'}`}>

                {/* COLA más grande */}
                {!isOwnMessage && (
                    <div
                        className="absolute -left-2 top-4 w-0 h-0
                            border-t-12px border-t-transparent
                            border-b-12px border-b-transparent
                            border-r-12px border-r-gray-100">
                    </div>
                )}
                
                {isOwnMessage && (
                    <div
                        className="absolute -right-2 top-4 w-0 h-0
                            border-t-12px border-t-transparent
                            border-b-12px border-b-transparent
                            border-l-12px border-l-[#1a1a1a]">
                    </div>
                )}

                {/* Encabezado */}
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span className={`text-sm font-semibold ${isOwnMessage ? 'text-white' : 'text-slate-800'}`}>
                        {user_name}
                    </span>
                    <time className={`text-sm ${isOwnMessage ? 'text-gray-300' : 'text-gray-500'}`} dateTime={date.toISOString()}>
                        {time}
                    </time>
                </div>

                <p className={`text-sm py-2.5 ${isOwnMessage ? 'text-white' : 'text-gray-700'}`}>{content}</p>
            </div>
        </div>
    );
}
