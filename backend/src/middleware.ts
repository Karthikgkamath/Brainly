import type{ Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken"

declare global{
    namespace Express{
        interface Request{
            userid?:string
        }
    }
}

export const userMiddleWare=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const auth=req.headers.authorization;
         if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "User is not authenticated"
        });
    }
        const token=auth.split(" ")[1]
        const JWT_SECRET=process.env.JWT_SECRET;
        if(typeof JWT_SECRET !=="string"){
                    return res.status(401).json({
                            message:"User is not authenticated"
                                })
        }
        if (!token) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

        const result=jwt.verify(token,JWT_SECRET);
        if(typeof result==="string" || typeof result.userid !=="string"){
            return res.status(401).json({
                message:"Token is invalid"
            })
        }
        
        req.userid=result.userid;

        if(result){
            console.log("Going to next")
            return next();
        }
    }catch(e){
        if(e instanceof Error){
            res.status(403).json({
                message:"User is not authorized"
            })
        }
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
    


}