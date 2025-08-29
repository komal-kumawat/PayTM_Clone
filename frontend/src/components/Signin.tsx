import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"
const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:3000/api/v1/user/signin" , { password , email});
            if(res.data.token){
                localStorage.setItem("token",res.data.token);
            }
            alert("Signin successfull .");
            navigate("/dashboard");

        }catch(err){
            console.log("signin failed ");
             setEmail("");
            setPassword("");
            setError(err.response?.data?.error || "Something went wrong");
           
        }
    }

    

    return (
        <div className='signin'>
            <h1>Sign In</h1>
            <p>Enter your credentials to access <br /> your account</p>
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <label htmlFor="email">Email</label>
                <input type="text" placeholder='Enter your email' onChange={(e)=>{setEmail(e.target.value)}} required value={email}/>
                <label htmlFor="password">Password</label>
                <input type="text" placeholder='Enter your password' onChange={(e)=>{setPassword(e.target.value)}} required value={password}/>
                <button type='submit'>Sign In</button>
            </form>
            <div className='last'>Don't have an account? <Link to={"/signin"}>Sign Up</Link></div>


        </div>
  )
}

export default Signin
