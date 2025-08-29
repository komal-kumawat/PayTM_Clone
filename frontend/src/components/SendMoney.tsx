import { useSearchParams, useNavigate } from "react-router-dom";
import "../App.css";
import { useState } from "react";
import axios from "axios";

const SendMoney = () => {
    const [amount, setAmount] = useState<number>(0);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get("id");
    const name = searchParams.get("name");

    const handleClick = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3000/api/v1/account/transfer",
                {
                    to: id,
                    amount,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },

                }
            );
            alert("Transfer successful!");
            navigate("/dashboard"); // redirect to home/dashboard
        } catch (err) {
            console.error("Transfer failed:", err);
            alert("Transfer failed. Please try again.");
        }
    };

    return (
        <div className="sendMoneyClass">
            <h1>Send Money</h1>
            <div className="userLogo">
                <div
                    className="logo"
                    style={{ color: "white", backgroundColor: "green" }}
                >
                    {name ? name[0].toUpperCase() : "?"}
                </div>
                <div className="user">{name || "Unknown User"}</div>
            </div>
            <div className="amount">
                <div>Amount (in Rs)</div>
                <input
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
            <div>
                <button style={{ marginLeft: "10px" }} onClick={handleClick}>
                    Initiate Transfer
                </button>
            </div>
        </div>
    );
};

export default SendMoney;
