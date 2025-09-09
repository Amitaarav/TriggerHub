
import { ReactNode } from "react";
export const LinkButton = ({children}:{children:ReactNode, onClick:()=>void}) => {
    return <div className=" flex justify-center px-4 py-2 bg-gray-800 cursor-pointer hover:bg-gray-700 rounded-md text-white hover:text-slate-50 font-bold border-2"
    >
        {children}
    </div>
}