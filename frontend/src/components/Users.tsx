import { useEffect, useState } from "react"
import "../App.css"
import UserLogo from "./UserLogo";
import axios from "axios";
import {useNavigate } from "react-router-dom";

const Users = () => {
    const [users , setUsers] = useState([]);
    const [filter , setFilter] = useState("");

    
    useEffect(()=>{
        if(filter.trim()===""){
            setUsers([]);
            return ;
        }
        axios.get(`http://localhost:3000/api/v1/user/bulk?name=${filter}`)
        .then(response=>{
            setUsers(response.data.users) 
        }).catch((err)=>{
            console.error("Error fetching users:",err);
        })

    } , [filter]);
    
  return (
    <>
    <div style={{fontSize:"bold" , marginLeft:"10px" , marginTop:"10px"}}>
      Users
    </div>
    <div className="my-2">
        <input type="text" placeholder="Search users" className="serachUser" onChange={(e)=>setFilter(e.target.value)}/>
    </div>
    <div >
        {users.map(user=> <User key = {user._id} user={user}></User>)}
    </div>
    </>
  )
}
function User({user}){
    const navigate = useNavigate();

    return <div className="userClass">
       <UserLogo user ={user}/>
        <div>
            <button onClick={(e)=>{navigate("/send?id="+user._id+"&name="+user.name)}}>Send Money</button>
        </div>
    </div>
}

export default Users
