"use client"
import { useState, useEffect } from "react"
import { LinkButton } from"./buttons/LinkButton";
import { useRouter } from "next/navigation"
export const Appbar = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token")
        setLoggedIn(!!token)  // Set to true if token exists, false if null
    }, [])

    const handleLogin = () => {
        const token = localStorage.getItem("token")
        setLoggedIn(!!token)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setLoggedIn(false)
        router.push("/")
    }

    return (
    <nav className ="fixed left-0 top-0 z-50 w-full flex border-b justify-between p-2 bg-gradient-to-b from-orange-600 to-orange-500 shadow-xl">
        <div className="font-extrabold text-3xl flex flex-col justify-center cursor-pointer text-white"
        onClick={() => {
            router.push("/")
        }}>
            TriggerHub
        </div>
        <div className="flex font-medium">
            {
                isLoggedIn ? (
                    <div className="flex gap-2">
                        <LinkButton onClick={() => {}} >Contact Sales</LinkButton>
                        <LinkButton onClick={ handleLogout }   
                        >Logout</LinkButton>
                    </div>
                    
                ) :(
                    <div className="flex gap-2">
                        <LinkButton onClick={() => {}} >Contact Sales</LinkButton>
                        <LinkButton onClick={() => {
                            router.push("/login")
                        }} >Login</LinkButton>
                    </div>
                )
                
            }
            
        </div>
    </nav>
    )
}