import { useRef, useContext } from 'react'
import './Login.css'
import { AuthContext } from '../../Context/AuthContext'
import {CircularProgress} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../config'


const Login = () => {
    const password = useRef()
    const email = useRef()
    const ctx = useContext(AuthContext)

    const submitHandler = async (e) => {
        e.preventDefault()
        const user = {
            email: email.current.value,
            password: password.current.value
        } 
        ctx.dispatch({type: 'LOGIN_START'})
        try {
            const loginUser =  await axiosInstance.post('/auth/login', user)
            ctx.dispatch({type: 'LOGIN_SUCCESS', payload: loginUser.data})
            const { userPass, ...others } = loginUser.data
            localStorage.setItem('user', JSON.stringify(others))
            window.location.reload(false);        
        } catch (error) {
            ctx.dispatch({type: 'LOGIN_FAILURE', payload: error})
        }
    }

  return (
  <div className='loginContainer'>
    <div className='loginMessageWrapper'>
        <h2 className='loginMessage'>Login now and start talking with your friends!</h2>
    </div>
    <div className='loginFormWrapper'>
    <form className='loginForm' onSubmit={submitHandler}>       
        <div className='loginInput'>
            <h4>Email:</h4>
            <input type='email' required ref={email}></input>
        </div>        
        <div className='loginInput'>
            <h4>Password:</h4>
            <input type='password' required minLength='6' ref={password}></input>
        </div>        
        <button className="loginSubmit">{ctx.isFetching ? <CircularProgress color='white' size='20px' /> : 'Submit'}</button>
        <Link to='/register' style={{textDecoration: 'none', color: 'white'}} className='creareAccount'>Create a new Account</Link>
    </form>
    </div>
    </div>
  )
}

export default Login