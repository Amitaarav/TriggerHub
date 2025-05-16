import { ReactNode } from "react"

export const PrimaryButton = ({ children,onClick,size="small" }: { 
        children: ReactNode,
        onClick:()=>void,
        size?:"big" | "small"
    }) => {
        return (
                <div
                onClick={onClick}
                className={`${size === "small" ? "text-sm px-8 py-2" : "text-xl px-10 py-4"} 
                    cursor-pointer 
                    hover:shadow-xl 
                    bg-orange-500 
                    text-white 
                    rounded-full 
                    text-center 
                    flex justify-center items-center
                    font-bold 
                    hover:bg-orange-700 
                    group relative overflow-hidden`}
                >
                <span className="relative z-10 group-hover:text-shine">{children}</span>
                {/* <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white to-white/10 opacity-0 group-hover:opacity-30 blur-sm animate-shimmer" /> */}
                </div>
            );   
}