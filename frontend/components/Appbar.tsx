"use client"
import { LinkButton } from"./buttons/LinkButton";
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton";
export const Appbar = () => {
    const router = useRouter();
    return <div className="flex border-b justify-between p-4">
        <div className="font-extrabold text-2xl flex flex-col justify-center">
            TriggerHub
        </div>
        <div className="flex gap-4 font-medium">
            <LinkButton onClick={() => {}} >Contact Sales</LinkButton>
            <LinkButton onClick={() => {
                router.push("/login")
            }} >Login</LinkButton>
            <PrimaryButton onClick={()=>{
                router.push("/signup")
            }}>Signup</PrimaryButton>
        </div>
    </div>
}