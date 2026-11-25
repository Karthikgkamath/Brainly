import 'dotenv/config'
import e from 'express'
import express from "express"
import {createServer} from 'node:http'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { userMiddleWare } from './middleware.js'
import {userModel,contentModel, linkModel} from './db.js'
import cors from "cors";
import {random}from './utils.js'
import mongoose from 'mongoose'
import {WebSocket,WebSocketServer} from 'ws'
const app=express();
const server=createServer(app);
const websocketServer=new WebSocketServer({noServer:true});
const shareSockets=new Map<string,Set<WebSocket>>();

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
declare global{
    namespace Express{
        interface Request{
            userid?:string
        }
    }
}

async function getSharedData(hash:string){
    const link=await linkModel.findOne({hash});
    if(!link) return null;
    const [content,user]=await Promise.all([
        contentModel.find({userId:link.userId}),
        userModel.findById(link.userId)
    ]);
    return {username:user?.name ?? 'Unknown user',content};
}

async function broadcastShare(userId:string){
    const link=await linkModel.findOne({userId});
    if(!link) return;
    const clients=shareSockets.get(link.hash);
    if(!clients?.size) return;
    const data=await getSharedData(link.hash);
    if(!data) return;
    const message=JSON.stringify(data);
    for(const client of clients){
        if(client.readyState===WebSocket.OPEN) client.send(message);
    }
}

server.on('upgrade',(request,socket,head)=>{
    const pathname=new URL(request.url ?? '/', 'http://localhost').pathname;
    const match=pathname.match(/^\/ws\/share\/([^/]+)$/);
    const hash=match?.[1];
    if(!hash){
        socket.destroy();
        return;
    }
    void linkModel.findOne({hash}).then((link)=>{
        if(!link){
            socket.destroy();
            return;
        }
        websocketServer.handleUpgrade(request,socket,head,(client)=>{
            const clients=shareSockets.get(hash) ?? new Set<WebSocket>();
            clients.add(client);
            shareSockets.set(hash,clients);
            client.on('close',()=>{
                clients.delete(client);
                if(clients.size===0) shareSockets.delete(hash);
            });
            void getSharedData(hash).then((data)=>{
                if(data && client.readyState===WebSocket.OPEN) client.send(JSON.stringify(data));
            });
        });
    }).catch(()=>socket.destroy());
});

app.post('/signup',async(req,res)=>{

    try{
                const username=req.body.username;
                const password=req.body.password;

                const hashed= await bcrypt.hash(password,10);


                await userModel.create({
                    name:username,
                    password:hashed
                })

                res.status(201).json({
                    message:"User signed up"
                })
                }catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

    }
   

})

app.post('/signin',async(req,res)=>{

    try{
                const username=req.body.username;
                const password=req.body.password;
                const user=await userModel.findOne({
                    name:username
                    
                })
                if(user){
                    const result=await bcrypt.compare(password,user.password);

                    if(result){
                        const JWT_SECRET=process.env.JWT_SECRET;
                        if(typeof JWT_SECRET !=="string"){
                            return res.status(401).json({
                                message:"User is not authenticated"
                            })
                        }
                        const token=jwt.sign({
                            userid:user._id.toString()
                        },JWT_SECRET)
                        res.status(200).json({
                            message:"User signed in",
                            token:token
                        })
                    }else{
                        res.status(404).json({
                            message:"User does not exist.Please sign in."
                        })
                    }
                }
                
                }catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

                    return res.status(500).json({
                        message:"Internal Server Error."
                    })

    }
   

})

app.get('/content',userMiddleWare,async(req,res)=>{

    try{
                
                const userid=req.userid;
                if(!userid){
                    return res.status(401).json({
                                message:"User is not authenticated"
                            })
                }
                const objectid=new mongoose.Types.ObjectId(userid);
                const content=await contentModel.find({
                    userId:objectid
                    
                }).populate("userId")
                if(content){

                        res.status(200).json({
                            content
                        })
                    }else{
                        res.status(404).json({
                            message:"Content Not Found"
                        })
                    }
                }
                
                catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

                    return res.status(500).json({
                        message:"Internal Server Error."
                    })

    }
   

})

app.post('/content',userMiddleWare,async(req,res)=>{

    try{
                const title=req.body.title;
                const link=req.body.link;
                const type=req.body.type;
                const cont=req.body.content;
                
                const userid=req.userid;
                if(!userid){
                    return res.status(401).json({
                                message:"User is not authenticated"
                            })
                }
                const objectid=new mongoose.Types.ObjectId(userid);
                await contentModel.create({
                    title,
                    link,
                    type,
                    content:cont,
                    
                    userId:objectid
                    
                })
                await broadcastShare(userid);
                

                 res.status(201).json({
                            message:"Content is created"
                    })
                   
                }
                
                catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

                    return res.status(500).json({
                        message:"Internal Server Error."
                    })

    }
   

})



app.delete('/delete/:contentId',userMiddleWare,async(req,res)=>{

    try{
                const userid=req.userid;
                const contentid=req.params.contentId;
                if(!userid || !contentid){
                    return res.status(401).json({
                                message:"User is not authenticated"
                            })
                }
                const content=await contentModel.findOneAndDelete({
                    _id:contentid,
                    userId:userid
                    
                })
                if(content){
                    await broadcastShare(userid);

                        res.status(200).json({
                            message:"Content has been deleted"
                        })
                    }else{
                        res.status(404).json({
                            message:"Content Not Found"
                        })
                    }
                }
                
                catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

                    return res.status(500).json({
                        message:"Internal Server Error."
                    })

    }
   

})
 
app.put('/update/:contentId',userMiddleWare,async(req,res)=>{
         try{
                const title=req.body.title;
                const link=req.body.link;
                const type=req.body.type;
                const cont=req.body.content;
                const contentId=req.params.contentId;

                const JWT_SECRET=process.env.JWT_SECRET;
                const auth=req.headers.authorization;
                const token=auth?.split(' ')[1]
                const ownerId=req.userid;
                if(!ownerId){
                    return res.status(401).json({message:"User is not authenticated"});
                }
                if(!token){
                    return res.status(401).json({
                        message:"Token is invalid."
                    })
                }
                if(typeof JWT_SECRET === 'string'){
                        jwt.verify(token,JWT_SECRET)
                        if(typeof contentId ==='string'){
                        const result=await contentModel.updateOne({
                            _id:new mongoose.Types.ObjectId(contentId),
                            userId:new mongoose.Types.ObjectId(ownerId)
                        },{
                            $set:{
                                    title,
                                    link,
                                    type,
                                    content:cont
                            }
                        });

                        if(result.matchedCount===0){
                            res.status(404).json({
                                message:'Resource does not exist.'
                            })
                        }else{
                            await broadcastShare(ownerId);
                            res.status(200).json({
                                message:"Updated Successfully."
                            })
                        }


            }}}catch(e){
                    if(e instanceof Error){
                        return res.status(500).json({
                        message:e.message
                    
                    })}

                }

})

app.post('/share',userMiddleWare,async(req,res)=>{
    const share=req.body.share;
    if(!req.userid){
        return res.status(401).json({
            message:"The token is invalid"
        })
    }
    if(share){
        const existingLink=await linkModel.findOne({
            userId:req.userid
        })

        if(existingLink){
           return res.json({
            hash:existingLink.hash
            })
        }
        const hash=random(10);
        await linkModel.create({
            userId:req.userid,
            hash:hash
        })
        res.json({
            hash
        })
    }else{
        await linkModel.deleteOne({
            userId:req.userid
        })
    }
})

app.get('/share/:shareLink',async(req,res)=>{
    const hash=req.params.shareLink;
    const data=await getSharedData(hash);
    if(!data){
        return res.status(404).json({
            message:"Share link not found"
        })
    }
    res.json(data);
})

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);

        console.log("MongoDB connected successfully");

        server.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {
        console.log("Database connection failed:", error);
    }
}

startServer();