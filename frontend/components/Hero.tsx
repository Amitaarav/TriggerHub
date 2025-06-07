"use client"
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { Feature } from "./Feature";
import { KnowTrigger}from "./KnowTrigger";
export const Hero = () => {
    const router = useRouter()
    return(<div>
            <div className="flex justify-center">
                <div className="text-5xl font-bold text-center pt-4 max-w-xl">
                    Automate as fast as you can type
                </div>
            </div>
            <div className="flex justify-center">
                <div className="text-xl  font-normal text-center pt-8 max-w-2xl text-gray-700">
                    AI gives you automation superpowers, and TriggerHub puts them to work. Pairing AI and TriggerHub helps you turn ideas 
                    into workflows and bots that work for you.
                </div>
            </div>
            <div className="flex justify-center p-4">
                <div className="flex ">
                    <PrimaryButton onClick={()=>{
                        router.push("/signup")
                    }} size="big">Get Started free</PrimaryButton>
                    <div className="pl-14"></div>
                    <SecondaryButton onClick={()=>{}} size="big">Contact Sales</SecondaryButton>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Feature title={"Free Forever"} subtitle={"for core features"}/>
                <Feature title={"More apps"} subtitle={"than any other platforms"}/>
                <Feature title={"Cutting Edge"} subtitle={ " AI Features"}/>
            </div>
            <div className="m-20">
                <KnowTrigger></KnowTrigger>
            </div>
            
    </div>
    )
}