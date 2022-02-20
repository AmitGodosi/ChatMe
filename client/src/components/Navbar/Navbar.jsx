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
    <div className={classes.admin}>
    <h4>Amit Godosi Chat App</h4>
    </div>
    <div className={classes.user}>
       <h4>{username}</h4>
       <button onClick={logoutHandler}>Log-out</button>  
    </div>
  </div>;
};

export default Navbar;
