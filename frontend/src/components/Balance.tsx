import "../App.css"

type BalanceProps = {
    amount:number;
}
const Balance = ({amount}:BalanceProps) => {
  return (
    <div className='balanceClass'>
        Your Balance : Rs {amount}
    </div>
  )
}

export default Balance
