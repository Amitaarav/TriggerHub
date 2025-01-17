import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();

const client = new PrismaClient();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body
    try {
        const response = await client.$transaction(async(tx)=>{
            const run = await tx.zapRun.create({
                data:{
                    zapId: zapId,
                    metadata: body
                }
            });
            await tx.zapRunOutbox.create({
                data:{
                    zapRunId: run.id
                }
            })
            return {
                zapRun:run
            }
        })
        res.json({
            message: "Transaction successful",
            data: response,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error processing transaction:", error.message);
            res.status(500).json({
                message: "Transaction failed",
                error: error.message,
            });
        } else {
            console.error("Unknown error:", error);
            res.status(500).json({
                message: "Transaction failed due to an unknown error.",
            });
        }
    }
})

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000")
})