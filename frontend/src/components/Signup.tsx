import { useState } from 'react'
import { useNavigate  , Link} from 'react-router-dom';
import axios from 'axios';
import "../App.css"

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:3000/api/v1/user/signup" , {name , password,email});
            alert("Signup successfull . Please Sign In");
            navigate("/signin");

        }catch(err){
            console.log("signup failed ");
            setError(err.response?.data?.error || "Something went wrong");
        }
    }

    

    return (
        <div className='signup'>
            <h1>Sign Up</h1>
            <p>Enter your information to create an account</p>
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <label htmlFor="name">Name</label>
                <input type="text" placeholder='Enter your name' onChange={(e)=>{setName(e.target.value)}} required value={name}/>
                <label htmlFor="email">Email</label>
                <input type="text" placeholder='Enter your email' onChange={(e)=>{setEmail(e.target.value)}} required value={email}/>
                <label htmlFor="password">Password</label>
                <input type="text" placeholder='Enter your password' onChange={(e)=>{setPassword(e.target.value)}} required value={password}/>
                <button type='submit'>Sign Up</button>
            </form>
            <div className='last'>Already have an account? <Link to={"/signin"}>Sign In</Link></div>


        </div>
    )
}

export default Signup
