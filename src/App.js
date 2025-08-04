import Register from "./components/Register";
import Login from "./components/Login";
import { Route, Switch } from "react-router-dom";
import Products from "./components/Products";
import Freshers from "./components/Freshers";
import SDE1 from "./components/SDE1";
import SDE2 from "./components/SDE2";
import SDE3 from "./components/SDE3";

export const config = {
  endpoint: `https://qkart-1.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
       <Switch>
        <Route exact path="/">
          <Products />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/freshers">
          <Freshers />
        </Route>
        <Route exact path="/SDE1">
          <SDE1 />
        </Route>
        <Route exact path="/SDE2">
          <SDE2 />
        </Route>
        <Route exact path="/SDE3">
          <SDE3 />
        </Route>
        </Switch>
    </div>
  );
}

export default App;
