"use client"
import { Appbar } from "@/components/Appbar";
import { useState } from "react";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config";
export default function (){
    const router = useRouter()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    return <div>
        <Appbar />
        <div className="flex pt-8 max-w-4xl mx-auto flex-col md:flex-row items-center justify-center">
            <div className="flex pt-4 flex-col md:flex-row items-center justify-center">
                <div className="flex-1 px-4">
                    <div className="font-semibold text-3xl pb-6">
                        Join millions worldwide who automate their work using TriggerHub
                    </div>
                        <div className="pb-4 pt-2">
                            <CheckFeature label={"Create and manage your own triggers"}/>
                        </div>
                        <div className="pb-4 ">
                            <CheckFeature label={"Free forever for core features"}/>
                        </div>
                        <div className="">
                            <CheckFeature label={"14-days trial of premium features and apps"}/>
                        </div>
                </div>
                <div className="flex-1 pr-8">
                    <Input label={"Email"} placeholder={"Your Email"} onChange={e=>{
                        setEmail(e.target.value)
                    }} type="text" ></Input>
                    <Input label={"Password"} placeholder={"Password"} onChange={e=>{
                        setPassword(e.target.value)
                    }} type="password" ></Input>
                    <div className="pt-4 px-10 py-1">
                        <PrimaryButton onClick={async()=>{
                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
                                username:email,
                                password:password
                            })
                            localStorage.setItem("token",res.data.token)
                            router.push("/dashboard")
                        }} size="big">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
}