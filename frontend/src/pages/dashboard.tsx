import { useState, useEffect } from 'react';

import { Button } from '../components/Button';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ShareIcon } from '../components/icons/ShareIcon';
import {Tick} from '../components/icons/tick'
import { Card } from '../components/Card';
import { ContentModal } from '../components/ContentModal';
import { Sidebar } from '../components/Sidebar';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Content {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "twitter" | "article";
    content?: string;
}

export function DashBoard() {
    const [modalOpen, setModalOpen] = useState(false);

 
    const [contents, setContents] = useState<Content[]>([]);
    const[sideType,setSideType]=useState<'all'|'youtube'|'twitter'|'article'>('all')
    const[cardContent,setCardContent]=useState<Content|null>(null);
    const navigate=useNavigate();
    const [shareActive,setShareActive]=useState<boolean>(false);
    const token=localStorage.getItem('token')

    function logOut(){
        localStorage.removeItem('token');
        navigate('/signin')
    }

    async function shareLink() {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/share`,{
        share:true
      },
    
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    
     console.log("Share API response:", response.data);

    const link = `${window.location.origin}/share/${response.data.hash}`;
    await navigator.clipboard.writeText(link);

    console.log("Link copied successfully");

    setShareActive(true);

  } catch (error) {
   console.log("Share error:", error);

    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Backend response:", error.response?.data);
    }
  }finally{
    setTimeout(() => {
      setShareActive(false);
    }, 2000);
  }
}
    
    async function fetchContents() {
        try {
            
            const response = await axios.get(`${BACKEND_URL}/content`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if(sideType==='all'){
                setContents(response.data.content);
            }else{
                const filtered=response.data.content.filter((items:any)=>{
                    return items.type===sideType;
                })
                setContents(filtered);
            }
                
        } catch (error) {
             if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Backend error:", error.response?.data);
    }
        }
    }

    
    useEffect(() => {
        fetchContents();
    }, [sideType]);

    return (
        <div className="bg-gray-200 ">
            <Sidebar setSidetype={setSideType} />

            <div className="p-3 relative ml-72 min-h-screen">

                <ContentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onContentAdded={fetchContents}
                    cardContent={cardContent}
                />

                <div className="flex fixed top-0 right-0 left-[190px] bg-gray-700 justify-end gap-3 ">
                    <Button
                        variant="primary"
                        text="Sign Out"
                        onClick={()=>logOut()}
                    />
                    <Button
                        variant="primary"
                        onClick={() => {setModalOpen(true);setCardContent(null)}}
                        text="Add Content"
                        startIcon={<PlusIcon />}
                    />

                    <Button
                        variant="secondary"
                        text={shareActive ? "Link Copied" : "Share Brain"}
                        startIcon={shareActive?<Tick/>:<ShareIcon />}
                        
                        onClick={()=>shareLink()}
                    />
                </div>

                <div className="mt-20 flex flex-wrap items-start gap-4 p-3">

                    {contents.map((item) => (
                        <Card
                            key={item._id}
                            contentId={item._id}
                            type={item.type}
                            link={item.link}
                            title={item.title}
                            content={item.content}
                            onContentDeleted={fetchContents}
                            setModal={setModalOpen}
                            setContent={setCardContent}

                        />
                    ))}

                </div>
            </div>
        </div>
    );
}