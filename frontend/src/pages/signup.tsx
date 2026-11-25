
import {Input} from '../components/Input'
import { Button } from '../components/Button'
import { useRef,useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {BACKEND_URL} from '../config'

export function SignUp(){
    const usernameRef=useRef<HTMLInputElement>(null);
        const passwordRef=useRef<HTMLInputElement>(null);
        const navigate = useNavigate();
        const [loading,setLoading]=useState(false);
        async function signup(){
            setLoading(true);
            const username=usernameRef.current?.value;
            const password=passwordRef.current?.value;
            try{
                const response=await axios.post(`${BACKEND_URL}/signup`,{
                    username,
                    password
                
            })
            console.log(response.data)
            navigate('/signin')
            }catch(error){
                console.error("Signup failed:",error);
            }finally{
                setLoading(false);
            }
            
        }
    return(
        

        <div className="bg-gray-300 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-4 rounded-md flex flex-col items-center gap-3 min-w-48">
                <div className="text-2xl font-medium">Sign Up</div>
                <Input reference={usernameRef}text='Enter Name'/>
                <Input reference={passwordRef} text="Enter Password"/>
                <div >
                    <a href='./signin'>Already have an account?</a>
                    <div className="text-center text-blue-500 underline"
                  ><a href='./signin'>Sign In</a>
                    </div></div>
                <Button  onClick={signup}variant='primary' text='Submit' loading={loading} fullwidth={true}/>
            </div>
        </div>
    )
}