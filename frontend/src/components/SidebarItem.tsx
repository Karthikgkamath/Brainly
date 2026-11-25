import type{ ReactElement } from "react";
const variantStyles={
    primary:'bg-gray-400',
    secondary:'bg-white'
}
export function SidebarItem({text,icon,variant,onClick}:{
    text:string;
    icon:ReactElement
    variant:'primary' | 'secondary'
    onClick:()=>void
}){
    return <div onClick={onClick} className={`flex hover:bg-gray-400 cursor-pointer transition duration-300 rounded max-w-45 ${variantStyles[variant]}`}>
        <div className="p-2">{icon}</div>
         <div className="p-2">{text}</div>
    </div>
}