import classes from './Navbar.module.scss';
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
            <button onClick={logoutHandler}>Log-out</button>  
            <h4>{username}</h4>
        </div>;
};

export default Navbar;
