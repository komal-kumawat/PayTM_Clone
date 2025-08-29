import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import DashBoard from "./components/DashBoard";
import SendMoney from "./components/SendMoney";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element = {<Signup/>}></Route>
          <Route path="/signin" element = {<Signin/>}></Route>
          <Route path="/dashboard" element = {<DashBoard/>}></Route>
          <Route path="send" element = {<SendMoney/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
