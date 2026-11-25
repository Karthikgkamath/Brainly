import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";
import { ShareIcon } from "./icons/ShareIcon";
import {useEffect} from "react"
import { BACKEND_URL } from "../config";
import axios from "axios";
type ContentType = "youtube" | "twitter" | "article";
interface Content{
    _id:string;
    type:ContentType;
    content?:string;
    title:string;
    link:string
}

interface CardProps{
    contentId:string
    title:string;
    link:string;
    type:'twitter'|'youtube'|'article';
    content?:string;
    onContentDeleted?:()=>Promise<void>;
    setModal?:(value:boolean)=>void;
    setContent?:(value:Content | null)=>void;
    readOnly?:boolean;
}

  export function Card({contentId,title,link,type,content,onContentDeleted,setModal,setContent,readOnly=false}:CardProps){
    useEffect(() => {
    if (type === "twitter" && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [link, type]);

    async function deleteContent(contentId:string){
      if (readOnly || !onContentDeleted) return;
        const token=localStorage.getItem('token')
        await axios.delete(`${BACKEND_URL}/delete/${contentId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        console.log("deleted successfully")
        await onContentDeleted();
    }

    return <div className="bg-white  p-8 rounded-md shadow-md border-gray-200 min-w-70 border">
       <div className="flex justify-between">
           <div className="flex justify-center items-center font-medium gap-3">
             <ShareIcon/>
             {title}
           </div>
           {!readOnly && <div className="flex">
              <button type="button" aria-label="Edit content" className="pr-2 cursor-pointer text-gray-500" onClick={()=>{setModal?.(true);setContent?.({_id:contentId,title,link,type,content});}}>
                <EditIcon/>
              </button>
              <button type="button" aria-label="Delete content" className="pr-2 cursor-pointer text-gray-500" onClick={()=>deleteContent(contentId)}>
                <DeleteIcon/>
              </button>
           </div>}
       </div>
       <div className="pt-9">
           {content?<div className="mb-8">{content}</div>:""}

           { type==="youtube" && <iframe width="560" className="w-full" height="315" src={link.replace('watch','embed').replace('?v=','/')} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
           
            {type=="twitter" && <blockquote className="twitter-tweet">
            <a href={link}></a> 
            </blockquote>}

       </div>
       
       
       
    </div>
}

