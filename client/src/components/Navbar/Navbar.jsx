import classes from "./Navbar.module.scss";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { useContext, useEffect, useState } from "react";

const Navbar = () => {
  // const [username, setUsername] = useState(localStorage.getItem("user"));
  const dispatch = useContext(AuthContext).dispatch;
  const user = localStorage.getItem("user");
  const username = JSON.parse(user).username;
  // useEffect(() => {
  //   const nameLower = JSON.parse(username).username;
  //   const arr = nameLower.split(" ");
  //   const edited = [];
  //   arr.map((name) => {
  //     const nameUpper = name.charAt(0).toUpperCase() + name.slice(1);
  //     edited.push(nameUpper);
  //   });
  //   setUsername(edited.join(" "));
  // }, []);

  const logoutHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    window.location.reload(false);
  };

  return (
    <div className={classes.container}>
      <button onClick={logoutHandler}>Log-out</button>
      <h4>{username}</h4>
    </div>
  );
};

export default Navbar;
