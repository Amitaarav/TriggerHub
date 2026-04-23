import { Router } from "express";
import { SignupSchema,SigninSchema } from "../types";
import { prismaClient } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config/config"
import bcrypt from "bcrypt"
const router = Router();

router.post("/signup",async(req,res)=>{

        const body = req.body;
        const parsedData = SignupSchema.safeParse(body);
    
        if(!parsedData.success){
            res.status(400).json({error:"Invalid data"});
            return ;
        }

        const userExists = await prismaClient.user.findFirst({
            where:{
                email:parsedData.data.username,
            }
        })

        if(userExists){
            res.status(403).json({error:"User already exists"});
            return; // Adding return here to prevent duplicate creation
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

        await prismaClient.user.create({
            data:{
                email:parsedData.data.username,
                password:hashedPassword,
                name:parsedData.data.name
            }
        })
        res.status(200).json({message:"Please verify your account by checking your email"
        })
    
})

router.post("/signin",async(req,res)=>{
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if(!parsedData.success){
        res.status(400).json({error:"Invalid data"});
        return;
    }
    const userExists = await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username,            
        }
    })

    if(!userExists){
        res.status(403).json({error:"User does not exist"});
        return;
    }

    const isValid = await bcrypt.compare(parsedData.data.password,userExists.password);

    if(!isValid){
        res.status(403).json({error:"Invalid password"});
        return;
    }

    const token = jwt.sign(
        { id: userExists.id },
        JWT_PASSWORD as string,
        { expiresIn: "1h" }
    );
    //
    res.status(200).json({ token, userExists });
})

router.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where:{
            id:id
        }
    })
    res.status(200).json({user})
})
export const userRouter = router;