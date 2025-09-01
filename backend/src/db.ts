
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export interface IAccount extends Document{
    userId:ObjectId,
    balance:number
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  name: { type: String, required: true ,set: (v: string) => v.toUpperCase()   },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
});

const User = mongoose.model<IUser>("User", userSchema);

const AccountSchema:Schema<IAccount> = new mongoose.Schema<IAccount>({
    userId:{type:mongoose.Schema.ObjectId , ref:"User" , required:true},
    balance:{type:Number , required:true , set: (v: number) => Number(v.toFixed(2))  }
})

const Account  = mongoose.model<IAccount>("Account" , AccountSchema);

export  {User,Account} ;
