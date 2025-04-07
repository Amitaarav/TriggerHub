"use client"
import {Appbar} from "@/components/Appbar"
import { DarkButton } from "@/components/buttons/DarkButton"
import { useState } from "react"
import { BACKEND_URL,HOOKS_URL } from "../config"
import axios from "axios"
import { useEffect} from "react"
import { useRouter } from "next/navigation"
import { LinkButton } from "@/components/buttons/LinkButton"
import Image from "next/image"

const Dashboard = () =>{
    const router = useRouter()
    const { loading , zaps} = useZaps()
    return <div>
        <Appbar/>
        <div className="flex justify-center pt-8">
            <div className=" max-w-2xl w-full">
                <div className="flex justify-between pr-8">
                    <div className="font-bold text-gray-00 text-xl">
                        My Zaps
                    </div>
                    <DarkButton onClick={()=>{
                        router.push("/zap/create")
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? <div>Loading...</div> : <div className="flex flex-row justify-center pl-20"> <ZapTable zaps={zaps}/> </div> }
    </div>
}
export default Dashboard

interface Zap{
    "id":string,
    "triggerId":string,
    "userId":number,
    "actions":{
        "id":string,
        "zapId":string,
        "actionId":string,
        "sortingOrder":number,
        "type":{
            "id":string,
            "name":string,
            "image":string
        }
    }[],
    "trigger":{
        "id":string,
        "zapId":string,
        "triggerId":string,
        "type":{
            "id":string,
            "name":string,
            "image":string
        }
    }
}
function useZaps(){
    const [loading, setLoading] = useState(false)
    const [zaps, setZaps] = useState<Zap[]>([])

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/zap`)
        .then(res => {
            setZaps(res.data.zaps),
            setLoading(false)
        })
    },[])
    return {
        loading,zaps
    }
}

function ZapTable({zaps}:{zaps:Zap[]}){
    const router = useRouter()
    return <div className="p-8 max-w-screen-lg w-full">
    <div className="flex">
            <div className="flex-1">Name</div>
            <div className="flex-1">ID</div>
            <div className="flex-1">Created at</div>
            <div className="flex-1">Go</div>
    </div>
    <div>
    {zaps.map((z)=> <div className="flex border-b border-t py-4">
        <div className="flex-1 flex"><Image src={z.trigger.type.image} alt="zap-image" className="w-[30px] h-[30px]"/> {z.actions.map( x => <img src={x.type.image} className="w-[30px] h-[30px]"/> )}</div>
        <div className="flex-1">{z.id}</div>
        <div className="flex-1">Nov 13, 2023</div>
        <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
        <div className="flex-1"><LinkButton onClick={() => {
                router.push("/zap/" + z.id)
            }}>Go</LinkButton></div>
    </div>)}
    </div>
    
</div>
}