import Appbar from './Appbar'
import Balance from './balance'
import "../App.css"
import Users from './Users'
import { useEffect, useState } from 'react'
import axios from 'axios'

const DashBoard =() => {
    const [balance , setBalance] = useState<number |null>(null);
    const [loading , setLoading] = useState(true);
    useEffect(()=>{
        const fetchBalance = async()=>{
            try{
                const response = await axios.get("http://localhost:3000/api/v1/account/balance" , {
                    headers:{
                        Authorization:localStorage.getItem("token")||"",
                    },
                });
                setBalance(response.data.balance);


            }catch(err){
                console.error("failed to fetch balance",err);
            }finally{
                setLoading(false);
            }
        };
        fetchBalance();
    } , [])
  return (
    <div className='dashboard'>
        <h1>PayTM</h1>
        <Appbar/>
        {loading ? (
        <div>Loading balance...</div>
      ) : balance !== null ? (
        <Balance amount={balance} />
      ) : (
        <div>Could not fetch balance</div>
      )}

        <Users/>
        
      
    </div>
  )
}

export default DashBoard
