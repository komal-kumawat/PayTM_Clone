import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
export interface authRequest extends Request{
    userId?:string;
}

export const authMiddleware = (req:authRequest , res:Response , next:NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            res.status(401).json({message:"Authorization header missing"});
            return ;
        }

        const token = authHeader;
        if(!token){
            res.status(401).json({message:"token missing!"})
            return ;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        req.userId = decoded.userId;
        next();


    }catch(err){
        res.status(403).json({message:"Invalid or expired token"});
    }
}
module.exports = {authMiddleware};