
import { ReactNode } from "react";
export const LinkButton = ({children}:{children:ReactNode, onClick:()=>void}) => {
    return <div className=" flex justify-center px-4 py-2 bg-white cursor-pointer hover:bg-slate-500 rounded-md text-black hover:text-slate-50 font-bold border-2 border-slate-500"
    >
        {children}
    </div>
}