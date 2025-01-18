import { ReactNode } from "react"

export const SecondaryButton = ({ children,onClick,size="small" }: { 
        children: ReactNode,
        onClick:()=>void,
        size?:"big" | "small"
    }) => {
    return (<div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-10 py-4"} cursor-pointer hover:shadow-xl border  border-black text-gray-700 rounded-full text-center flex justify-center flex-col font-semibold bg-slate-400}`}>
        {children}
    </div>)
}