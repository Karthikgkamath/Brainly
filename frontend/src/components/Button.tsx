import React from "react"
export interface ButtonProps{
    variant: "primary"|"secondary";
    size?:"sm" | "md" | "lg"
    text: string;
    startIcon?:React.ReactNode;
    endIcon?:React.ReactNode;
    onClick?:()=>void;
    fullwidth?:boolean;
    loading?:boolean;
    
}
const variantClasses={
    primary:"bg-purple-600 text-white",
    secondary:"bg-purple-300 text-purple-800"
}


const defaultStyles="rounded-md px-2 py-1 font-light flex justify-center items-center"
export const Button=({variant,text,onClick,startIcon,fullwidth,loading}: ButtonProps)=>{
    

    return <button  onClick={onClick} className={` ${variantClasses[variant]} ${defaultStyles} m-2  transition duration-200 hover:scale-105 ${fullwidth?'w-full':''} ${loading?"opacity-70 cursor-not-allowed":'cursor-pointer'}` }disabled={loading}>
           
            {startIcon?<div className="pr-2">{startIcon}</div>:null}
            {loading? <div className="mr-2 w-4 h-4 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin">
            </div>:''}
            
            {text}
             
        </button>
}
