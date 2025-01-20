
export const ZapCell = ({
    name,
    index,
    onClick
}:{
    name?: string,
    index: number,
    onClick: () => void
}) => {

    return <div onClick={onClick}className="border border-black py-2 px-2 flex w-[300px] justify-center bg-slate-200 cursor-pointer hover:bg-slate-300">
        <div className="flex text-xl p-6">
            <div className="font-bold">{index}. </div>
            <div className="font-bold">{name}</div>
        </div>
    </div>
}