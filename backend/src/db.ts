import mongoose,{Schema}from "mongoose"


interface IUser{
    name:string,
    password:string
}



interface ITag{
    name:string;
    userId:mongoose.Types.ObjectId;
}
const CONTENT_TYPES=["youtube","twitter","article"] as const;
type contentType=(typeof CONTENT_TYPES)[number]

interface IContent{
    title:string;
    link:string;
    content:string;
    type:contentType;
    userId:mongoose.Types.ObjectId;

}
interface IShare{
    hash:string;
    userId:mongoose.Types.ObjectId;
}

const userSchema=new Schema<IUser>({
    name:{type:String,required:true},
    password:{type:String,required:true,unique:true}
})
const linkSchema=new Schema<IShare>({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,unique:true}
})
const contentSchema=new Schema<IContent>({
    title:String,
    link:String,
    type:{
        type:String,
        enum:CONTENT_TYPES,
        required:true
    },
    content:String,
    
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})


export const linkModel=mongoose.model<IShare>("Link",linkSchema)
export const contentModel=mongoose.model<IContent>("Content",contentSchema);
export const userModel=mongoose.model<IUser>("User",userSchema);



