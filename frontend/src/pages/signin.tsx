import {Input} from '../components/Input'
import { Button } from '../components/Button'
import { useState,useRef} from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../config';
import{useNavigate } from 'react-router-dom'

export function SignIn(){
    const [loading,setLoading]=useState(false);
    const usernameRef=useRef<HTMLInputElement>(null);
    const passwordRef=useRef<HTMLInputElement>(null);
    const navigate=useNavigate();
    async function signin() {
    setLoading(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
        const response = await axios.post(`${BACKEND_URL}/signin`, {
            username,
            password
        });

        const token = response.data.token;
        
        console.log('User has signed in successfully');
        localStorage.setItem("token",token);
        navigate('/dashboard');

    } catch (error) {
        console.error('Signin failed:', error);
    } finally {
        setLoading(false);
    }
}

    return(
        <div className="bg-gray-300 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-4 rounded-md flex flex-col items-center gap-3 min-w-48">
                <div className="text-2xl font-medium">Sign In</div>
                <Input reference={usernameRef} text='Enter Name'/>
                <Input reference={passwordRef} text="Enter Password"/>
                <div >
                    <a href='./signup'>Don't  have an account?</a>
                    <div className="text-center text-blue-500 underline"
                  ><a href='./signup'>Sign Up</a>
                    </div></div>
                <Button variant='primary' onClick={signin} text='Submit' loading={loading}fullwidth={true}/>
                
            </div>
        </div>
    )
}