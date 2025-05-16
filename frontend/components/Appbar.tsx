"use client"
import { useState, useEffect } from "react"
import { LinkButton } from"./buttons/LinkButton";
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton";
import { div } from "framer-motion/client";
export const Appbar = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)


    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token")
        setLoggedIn(!!token)
    },[])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setLoggedIn(false)
        router.push("/")
    }
    return <div className="flex border-b justify-between p-4">
        <div className="font-extrabold text-3xl flex flex-col justify-center cursor-pointer"
        onClick={() => {
            router.push("/")
        }}>
            TriggerHub
        </div>
        <div className="flex gap-4 font-medium">
            {
                isLoggedIn ? (
                    <>
                        <LinkButton onClick={() => {}} >Contact Sales</LinkButton>
                        <LinkButton onClick={handleLogout}   
                        >Logout</LinkButton>
                    </>
                    
                ) :(
                    <div className="flex gap-4">
                        <LinkButton onClick={() => {}} >Contact Sales</LinkButton>
                        <LinkButton onClick={() => {
                            router.push("/login")
                        }} >Login</LinkButton>
                        <PrimaryButton onClick={()=>{
                            router.push("/signup")
                        }}>Signup</PrimaryButton>
                    </div>
                )
            }
            
        </div>
    </div>
}