"use client"
import { Appbar } from "@/components/Appbar"
import { DarkButton } from "@/components/buttons/DarkButton"
import { useState, useEffect } from "react"
import { BACKEND_URL, HOOKS_URL } from "../config"
import authAxios from "@/utils/authAxios"
import { useRouter } from "next/navigation"
import { LinkButton } from "@/components/buttons/LinkButton"
import Image from "next/image"

const Dashboard = () => {
    const router = useRouter()
    const { loading, zaps } = useZaps()

    return (
        <div>
            <Appbar />
            <div className="flex justify-center pt-8 mt-12">
                <div className="max-w-2xl w-full">
                    <div className="flex justify-between pr-8">
                        <div className="font-bold text-gray-700 text-xl">
                            My Zaps
                        </div>
                        <DarkButton onClick={() => {
                            router.push("/zap/create")
                        }}>
                            Create
                        </DarkButton>
                    </div>
                </div>
            </div>
            {
                loading
                    ? <div className="text-center mt-8">Loading...</div>
                    : <div className="flex flex-row justify-center pl-20">
                        <ZapTable zaps={zaps} />
                    </div>
            }
        </div>
    )
}
export default Dashboard

interface Zap {
    id: string,
    triggerId: string,
    userId: number,
    actions: {
        id: string,
        zapId: string,
        actionId: string,
        sortingOrder: number,
        type: {
            id: string,
            name: string,
            image: string
        }
    }[],
    trigger: {
        id: string,
        zapId: string,
        triggerId: string,
        type: {
            id: string,
            name: string,
            image: string
        }
    },
    createdAt?: string
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);
  
    useEffect(() => {
      authAxios.get(`${BACKEND_URL}/api/v1/zap`)
        .then((res) => {
          setZaps(res.data.zaps);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch zaps", err.response?.data || err.message);
          setLoading(false);
        });
    }, []);
  
    return { loading, zaps };
  }
  


function ZapTable({ zaps }: { zaps: Zap[] }) {
    const router = useRouter()

    return (
        <div className="p-8 max-w-screen-lg w-full">
            <div className="flex font-semibold text-gray-600 pb-2">
                <div className="flex-1">Name</div>
                <div className="flex-1">ID</div>
                <div className="flex-1">Created at</div>
                <div className="flex-1">Webhook</div>
                <div className="flex-1">Go</div>
            </div>
            <div>
                {zaps.map((z) => (
                    <div key={z.id} className="flex border-b border-t py-4 items-center">
                        <div className="flex-1 flex items-center gap-2">
                            <Image src={z.trigger.type.image} alt="trigger" width={30} height={30} />
                            {z.actions.map((x) => (
                                <img key={x.id} src={x.type.image} alt="action" className="w-[30px] h-[30px]" />
                            ))}
                        </div>
                        <div className="flex-1 break-all">{z.id}</div>
                        <div className="flex-1">
                            {z.createdAt
                                ? new Date(z.createdAt).toLocaleDateString()
                                : "Unknown"}
                        </div>
                        <div className="flex-1 text-sm break-all">
                            {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
                        </div>
                        <div className="flex-1">
                            <LinkButton onClick={() => {
                                router.push("/zap/" + z.id)
                            }}>
                                Go
                            </LinkButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
