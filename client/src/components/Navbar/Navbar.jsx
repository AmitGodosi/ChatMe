import classes from './Navbar.module.css';
import { AuthContext } from '../../Context/Auth/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const dispatch = useContext(AuthContext).dispatch
  const user = localStorage.getItem('user')
  const username = JSON.parse(user).username

  const logoutHandler = (e) => {
    e.preventDefault()
    dispatch({type: 'LOGOUT'})
    localStorage.removeItem('user')
    window.location.reload(false);  
  }

  return <div className={classes.container}>
    <div className={classes.rigthBar}>
    <h2>Chat App - By Amit Godosi</h2>
    </div>
    <div className={classes.leftBar}>
       <h2>{username}</h2>
       <button onClick={logoutHandler}>Log-out</button>  
    </div>
  </div>;
};

export default Navbar;
