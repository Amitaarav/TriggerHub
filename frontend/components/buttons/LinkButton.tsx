
import { ReactNode } from "react";
export const LinkButton = ({children}:{children:ReactNode, onClick:()=>void}) => {
    return <div className="flex justify-center px-4 py-2 cursor-pointer hover:bg-slate-200 rounded-md text-gray-700 font-semibold">
        {children}
    </div>
}