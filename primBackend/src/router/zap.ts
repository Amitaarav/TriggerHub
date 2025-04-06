import { Router } from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

router.post("/",authMiddleware,async(req,res)=>{
        //@ts-ignore
        const id = req.id;
        const body = req.body;
        const parsedData = zapCreateSchema.safeParse(body);
        if(!parsedData.success){
            console.log("error")
            res.status(400).send("error")
            return;
        }

        const zapId = await prismaClient.$transaction( async tx => {
            const zap = await prismaClient.zap.create({
                data:{
                    userId:parseInt(id),
                    triggerId:"",
                    actions:{
                        //@ts-ignore
                        create:parsedData.data.actions.map((x,index)=>(
                            {
                                actionId:x.availableActionId,
                                sortingOrder:index,
                                metadata:x.actionMetadata
                            }))
                        }
                    }
                    
            })
            const trigger = await tx.trigger.create({
                data:{
                    triggerId:parsedData.data.availableTriggerId,
                    zapId:zap.id,
                    
                }
            })
            await prismaClient.zap.update({
                where:{
                    id:zap.id
                },
                data:{
                    triggerId:trigger.id
                }
            })
            res.json (
                zap.id
            )
        })
        res.json({
            zapId
        })
    })


router.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id = req.id;
    const zap = await prismaClient.zap.findFirst({
        where:{
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    console.log("zap created")
    res.json({ zap });
})

router.get("/:zapId",authMiddleware,async(req,res)=>{
    console.log("get a zap")
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zaps = await prismaClient.zap.findMany({
        where:{
            id:zapId,
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    console.log("zap created")
    res.json({ zaps });
})

export const zapRouter = router;