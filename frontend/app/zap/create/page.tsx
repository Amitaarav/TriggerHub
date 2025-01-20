"use client"
import { Appbar } from "@/components/Appbar"
import { ZapCell } from "@/components/ZapCell"
import { useState,useEffect } from "react"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { BACKEND_URL } from "@/app/config"
import { useRouter } from "next/navigation"
import axios from "axios"
export default function() {
    const router = useRouter()
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers()
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id:string;
        name:string;
        image:string;
    }>()
    const [selectedAction, setSelectedAction] = useState<{
        index:number;
        availableActionId:string;
        availableActionName:string;
    }[]>([])
    const [selectedModalIndex,setSelecedModalIndex] = useState<number | null>(null)
    return <div>
        <Appbar />
        <div className="flex justify-end">
            <PrimaryButton onClick={
                async() => {
                    if(!selectedTrigger?.id) {
                        return;
                    }
                    const response = await axios.post(`${BACKEND_URL}/api/v1/zap`,{
                        "availableTriggerId":selectedTrigger.id,
                        "triggerMetadata":{},
                        "actions":selectedAction.map((action) => ({
                            "availableActionId":action.availableActionId,
                            "actionMetadata":{}
                        }))
                    },
                    {
                        headers:{
                            Authorization:localStorage.getItem("token") || ""
                        }
                    }
                )

                router.push("/dashboard")
                }
            }>Publish</PrimaryButton>
        </div>
        <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center pt-[-40px]">
    
            <div className="flex justify-center w-full">
                <ZapCell onClick={()=>{
                    setSelecedModalIndex(1)
                }} index={1}  name={selectedTrigger?.name? selectedTrigger.name : "Select a trigger"}  />
            </div>
            <div className="w-full pt-2 pb-2">
                {selectedAction.map((action, index) => <div className="pt-2 flex justify-center">
                    <ZapCell onClick={()=>{
                    setSelecedModalIndex(action.index)
                }} index={action.index}  name={ action.availableActionName ? action.availableActionName : "Select an Action"}  />
                    </div>
                )}
            </div>
            <div className="flex justify-center">
                    <div className="">
                        <PrimaryButton onClick={()=>{
                        setSelectedAction( actions => [...actions, {index: actions.length + 2,availableActionId: "", availableActionName: ""}])
                        }}><div className="text-2xl max-w-2 flex justify-center">+</div></PrimaryButton>
                    </div>
            </div>
        </div>
        {selectedModalIndex && <Modal availableItems={ selectedModalIndex === 1 ?availableTriggers : availableActions} onSelect={(
            props: null | {name:string, id: string,image: string}) =>{
                if(props === null){
                    setSelecedModalIndex(null)
                    return ;
                }
                if(selectedModalIndex === 1){
                    setSelectedTrigger({
                        id: props.id,
                        name: props.name,
                        image:props.image
                    })
                }else{
                    setSelectedAction( action => {
                        let newActions = [...action];
                        newActions[selectedModalIndex - 2] = {
                            index: selectedModalIndex,
                            availableActionId: props.id,
                            availableActionName: props.name
                        }
                        return newActions;
                    })
                }
                setSelecedModalIndex(null)
            }
        }index={selectedModalIndex}  />}
    </div>
}

function Modal({ index,onSelect,availableItems}:{index: number,onSelect: (props: null | {name:string, id: string,image:string}) => void,availableItems: {name: string, id: string,image:string}[]}) {
    return <div>
        <div  className="  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex ">
    <div className="relative p-4 w-full max-w-2xl max-h-full">
        
        <div className="relative bg-white rounded-lg shadow ">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <div className="text-lg font-semibold text-gray-900">
                    Select { index === 1 ? "Trigger" : "Action" }
                </div>
                <button onClick={()=>{
                    onSelect(null)
                }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
                {
                    availableItems.map(({id,name,image})=>{
                        return <div onClick={()=>{
                            onSelect({id,name,image})
                        }} className="flex border p-2 cursor-pointer hover:bg-gray-100">
                            <img className="rounded-full" src={image}  width={30} />
                            <div className="pr-2 font-semibold flex flex-col justify-center">{name}</div>
                            </div>
                    })
                }
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button data-modal-hide="default-modal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">I accept</button>
                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
            </div>
        </div>
    </div>
</div>
    </div>

}

function useAvailableActionsAndTriggers(){
    const [availableActions,setAvailebleActions] = useState([])
    const [availableTriggers,setAvailableTriggers] = useState([])

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
        .then(res=>{
            setAvailableTriggers(res.data.availableTriggers)
        })

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
        .then(res=>{
            setAvailebleActions(res.data.availableActions)
        })
        
    },[])

    return {
        availableActions,
        availableTriggers
    }
}