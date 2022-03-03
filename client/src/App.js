import Login from "./components/Login/Login";
import Message from "./pages/Message";
import Register from "./components/Register/Register";
import Details from "./components/Details/Details";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const ifUser = localStorage.getItem("user");
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {ifUser ? <Message /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login" exact>
          {!ifUser ? <Login /> : <Redirect to="/" />}
        </Route>
        <Route path="/register" exact>
          {!ifUser ? <Register /> : <Redirect to="/" />}
        </Route>
        <Route path="/register" exact>
          {!ifUser ? <Register /> : <Redirect to="/" />}
        </Route>
        <Route path="/details" exact>
          {ifUser ? <Details /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
