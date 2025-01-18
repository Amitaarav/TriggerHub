"use client"
import {Appbar} from "@/components/Appbar"
import { DarkButton } from "@/components/buttons/DarkButton"
import { useState } from "react"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { useEffect} from "react"
const Dashboard = () =>{
    const { loading , zaps} = useZaps()
    return <div>
        <Appbar/>
        <div className="flex justify-center pt-8">
            <div className=" max-w-2xl w-full">
                <div className="flex justify-between pr-8">
                    <div className="font-semibold text-gray-700 text-xl">
                        My Zaps
                    </div>
                    <DarkButton onClick={()=>{
                    }}>+ Create</DarkButton>
                </div>
            </div>
        </div>
        {loading?"loading...":<ZapTable/>}
    </div>
}
export default Dashboard

interface Zap{
    "id":string,
    "triggerId":string,
    "userId":number,
    "actios":{
        "id":string,
        "zapId":string,
        "actionId":string,
        "sortingOrder":number,
        "type":{
            "id":string,
            "name":string,
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
    return <div className="pt-6 flex justify-center">
        <div className=" relative overflow-x-auto rounded-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-amber-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-600 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Microsoft Surface Pro
                        </th>
                        <td className="px-6 py-4">
                            White
                        </td>
                        <td className="px-6 py-4">
                            Laptop PC
                        </td>
                        <td className="px-6 py-4">
                            $1999
                        </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Magic Mouse 2
                        </th>
                        <td className="px-6 py-4">
                            Black
                        </td>
                        <td className="px-6 py-4">
                            Accessories
                        </td>
                        <td className="px-6 py-4">
                            $99
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
}