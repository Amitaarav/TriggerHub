"use client"
import { Appbar } from "@/components/Appbar"
import { ZapCell } from "@/components/ZapCell"
import { useState,useEffect } from "react"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { BACKEND_URL } from "@/app/config"
import { useRouter } from "next/navigation"
import { Input } from "@/components/Input"
import axios from "axios"
export default function() {
    const router = useRouter()
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers()
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id:string;
        name:string;
    }>()
    const [selectedAction, setSelectedAction] = useState<{
        index:number;
        availableActionId:string;
        availableActionName:string;
        metadata:any
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
                            availableActionId:action.availableActionId,
                            actionMetadata: action.metadata
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
                        setSelectedAction( actions => [...actions, {index: actions.length + 2,availableActionId: "", availableActionName: "",metadata:{}}])
                        }}><div className="text-2xl max-w-2 flex justify-center">+</div></PrimaryButton>
                    </div>
            </div>
        </div>
        {selectedModalIndex && <Modal availableItems={ selectedModalIndex === 1 ?availableTriggers : availableActions} onSelect={(
            props: null | {name:string, id: string,metadata: any;}) =>{
                if(props === null){
                    setSelecedModalIndex(null)
                    return ;
                }
                if(selectedModalIndex === 1){
                    setSelectedTrigger({
                        id: props.id,
                        name: props.name
                    })
                }else{
                    setSelectedAction( action => {
                        let newActions = [...action];
                        newActions[selectedModalIndex - 2] = {
                            index: selectedModalIndex,
                            availableActionId: props.id,
                            availableActionName: props.name,
                            metadata:props.metadata
                        }
                        return newActions;
                    })
                }
                setSelecedModalIndex(null)
            }
        }index={selectedModalIndex}  />}
    </div>
}

function Modal({ index,onSelect,availableItems}:{index: number,onSelect: (props: null | {name:string, id: string,metadata:any;}) => void,availableItems: {name: string, id: string,image:string;}[]}) {
    const [step,setStep] = useState(0);
    const [selectedAction,setSelectedAction] = useState<{
        id:string,
        name:string
    }>();
    const isTrigger = index === 1

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
            {step === 1 && selectedAction?.id === "send-email" && <EmailSelector setMetadata={(metadata)=>{
                onSelect({
                    ...selectedAction,
                    metadata
                })
            }}/>}
            { step === 1 && selectedAction?.id === "send-solana" && <SolanaSelector setMetadata={(metadata)=>{
                onSelect({
                    ...selectedAction,
                    metadata
                })
            }}/>}
            {( step === 0 && <div>
                        {
                            availableItems.map(({id,name,image})=>{
                                return <div onClick={()=>{
                                            if(isTrigger){
                                                onSelect({
                                                    id,
                                                    name,
                                                    metadata: {}
                                                })
                                            }
                                            else{
                                                setStep(s => s+1);
                                                setSelectedAction({
                                                    id,
                                                    name
                                                })
                                            }
                                            
                                            }} className="flex border p-2 cursor-pointer hover:bg-gray-100">
                                                <img className="rounded-full" src={image}  width={30} />
                                                <div className="pr-2 font-semibold flex flex-col justify-center">{name}</div>
                                        </div>
                                })
                        }
                        </div>)
                }
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

function EmailSelector({setMetadata}:{
    setMetadata:(params:any)=>void
}){
    const [email,setEmail] = useState("")
    const [body,setBody] = useState("")

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(event => setEmail(event.target.value))}></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(event => setBody(event.target.value))}></Input>
        <PrimaryButton onClick={()=>{
            setMetadata({
                email,
                body
            })
        }}>Submit</PrimaryButton>
    </div>
}

function SolanaSelector({setMetadata}:{
    setMetadata:(params:any)=>void
}){
    const [address,setAddress] = useState("")
    const [amount,setAmount] = useState("")
    return <div className="gap-4">
        <Input label={"To"} type={"text"} placeholder="To" onChange={(event => setAddress(event.target.value))}></Input>
        <Input label={"Amount"} type={"text"} placeholder="Body" onChange={(event => setAmount(event.target.value))}></Input>
        <div className="p-8"></div>
        <div className="m-8">
        <PrimaryButton  onClick={()=>{
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
        </div>
    </div>
}