import { useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { Button } from "./Button";
import {useRef} from 'react'
import {Input} from './Input'
import { Description } from "./Description";
import { BACKEND_URL } from "../config";
import axios from "axios";
import {useEffect} from "react"
type ContentType = "youtube" | "twitter" | "article";

interface Content{
    _id:string;
    type:ContentType;
    content?:string;
    title:string;
    link:string
}

export function ContentModal({open,onClose,onContentAdded,cardContent}:{
    open:boolean;
    onClose:()=>void;
    onContentAdded:()=>Promise<void>;
    cardContent:Content | null
}){
    const [loading,setLoading]=useState(false);
    const titleRef=useRef<HTMLInputElement>(null);
    const linkRef=useRef<HTMLInputElement>(null);
    const contentRef=useRef<HTMLTextAreaElement>(null);
    const[type,setType]=useState<ContentType>('youtube')
    useEffect(() => {
    if (open) {
        if (titleRef.current) {
            titleRef.current.value = cardContent?.title ?? "";
        }

        if (linkRef.current) {
            linkRef.current.value = cardContent?.link ?? "";
        }

        if (contentRef.current) {
            contentRef.current.value =cardContent?.content ?? "";
        }

        setType(cardContent?.type ?? "youtube");
    }
}, [open]);
    async function editContent(){
        try{
             setLoading(true);
             const title=titleRef.current?.value;
             const link=linkRef.current?.value;
             const content=contentRef.current?.value;
             const typeContent=type;
             const token=localStorage.getItem('token');
             await axios.put(`${BACKEND_URL}/update/${cardContent?._id}`,{
                title,
                link,
                content,
                type:typeContent
             },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
             })
             await onContentAdded();
             onClose();
             
            
            
        }catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }
    }




    async function addContent(){
        try{
            setLoading(true);
            const title=titleRef.current?.value;
            const link=linkRef.current?.value;
            const content=contentRef.current?.value;

            const token=localStorage.getItem('token')
            await axios.post(`${BACKEND_URL}/content`,{
                title,
                link,
                type,
                content},
                { headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
               

            )
            console.log("Content added successfully!!")

            await onContentAdded();

            onClose();
            }catch(e){
                console.log(e)
            }finally{
                setLoading(false);
            }
            
    }
    function selectType(selectedType: ContentType) {
    setType(selectedType);
    }
    return <div >
        {open && <div className='w-screen h-screen bg-blue-800/90 fixed top-0 left-0  flex justify-center'>
            <div className="flex justify-center items-center">
                <div className="bg-white  rounded-md p-4">
                    <div className="flex justify-end">
                        <div onClick={onClose}>
                            <CrossIcon/>
                        </div>
                        </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <Input reference={titleRef} text='Enter the title'/>
                        
                        <Description reference={contentRef}/>
                        <Button
                            text="YouTube"
                            variant={type === "youtube" ? "primary" : "secondary"}
                            onClick={() => selectType("youtube")}
                        />

                        <Button
                            text="Twitter"
                            variant={type === "twitter" ? "primary" : "secondary"}
                            onClick={() => selectType("twitter")}
                        />

                        <Button
                            
                            text="Article"
                            variant={type === "article" ? "primary" : "secondary"}
                            onClick={() => selectType("article")}
                        />
                        {type ==="twitter" || type==="youtube"?<Input reference={linkRef} text='Enter the link'/>:""}
                                                
                       
                        <Button loading={loading}variant="primary" text="Submit" onClick={cardContent?editContent:addContent}/>
                    </div>
                    
                    
                    
                </div>

            </div>
            
            
            </div>}
       
    
    </div>
    

}

