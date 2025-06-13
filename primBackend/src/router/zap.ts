import { Router, Response, Request } from "express";
import { authMiddleware, CustomRequest } from "../middleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
import { StatusCodes } from "http-status-codes";
const router = Router();

router.post("/", authMiddleware, async(req: Request, res: Response) => {
    const id = (req as CustomRequest).id;
    const body = req.body;
    const parsedData = zapCreateSchema.safeParse(body);
    if(!parsedData.success){
        console.log("Validation Error: ", parsedData.error.message)
        res.status(400).send("Validation Error: " + parsedData.error.message)
        return;
    }

    const zapId = await prismaClient.$transaction( async tx => {
        const zap = await tx.zap.create({
            data:{
                userId: Number(id),
                triggerId:"",
                actions:{
                    create:parsedData.data.actions.map((x,index)=>(
                        {
                            actionId:x.availableActionId,
                            sortingOrder:index,
                            metadata:x.actionMetadata ?? {}
                        }))
                    }
                }
                
        })
        const trigger = await tx.trigger.create({
            data:{
                triggerId:parsedData.data.availableTriggerId,
                zapId:zap.id,
                metadata:parsedData.data.triggerMetadata ?? {}
                
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
        return zap.id;
    })
    res.json({
        zapId
    })
})

router.get("/", authMiddleware, async(req: Request, res: Response) => {
    const id = (req as CustomRequest).id;
    const zap = await prismaClient.zap.findFirst({
        where:{
            userId: Number(id)
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

router.get("/:zapId", authMiddleware, async(req: Request, res: Response) => {
    const id = (req as CustomRequest).id;
    const zapId = req.params.zapId;
    const zaps = await prismaClient.zap.findMany({
        where:{
            id:zapId,
            userId: Number(id)
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