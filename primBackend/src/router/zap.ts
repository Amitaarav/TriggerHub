import { Router } from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

router.post("/",authMiddleware,async(req,res)=>{
        const body = req.body;
        const parsedData = zapCreateSchema.safeParse(body);
        if(!parsedData.success){
            console.log("error")
            res.status(400).send("error")
            return;
        }

        await prismaClient.$transaction( async tx => {
            const zap = await prismaClient.zap.create({
                data:{
                    triggerId:"",
                    actions:{
                        create:parsedData.data.actions.map((x,index)=>(
                            {
                                actionId:x.availableActionId,
                                sortingOrder:index
                            }))
                        }
                    }
                    
            })
            const trigger = await tx.trigger.create({
                data:{
                    triggerId:parsedData.data.availableTriggerId,
                    zapId:zap.id
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
            res.status(201).json({ message: "Zap created successfully" });
        })
    })


router.get("/",authMiddleware,(req,res)=>{
    console.log("zap created")
})

router.get("/:zapId",authMiddleware,(req,res)=>{
    console.log("get a zap")
})

export const zapRouter = router;