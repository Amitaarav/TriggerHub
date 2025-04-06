import { ReactNode } from "react";
export const DarkButton = ({ children, onClick,size="small" }: { children: React.ReactNode, onClick: () => void, size?: "big" | "small" }) => {
    return (<div 
        onClick={onClick} 
        className={`flex flex-col justify-center px-8 py-2 cursor-pointer hover:shadow-md bg-purple-700 text-white rounded text-center hover:bg-purple-900 font-semibold`}>
        {children}
    </div>
    )
}