
import { ReactNode } from "react";
export const LinkButton = ({children}:{children:ReactNode, onClick:()=>void}) => {
    return <div className="flex justify-center px-4 py-2 cursor-pointer hover:bg-slate-300 rounded-md text-gray-800 font-bold"
    >
        {children}
    </div>
}