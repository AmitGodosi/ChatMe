import { useRef, useContext } from 'react'
import { AuthContext } from '../../Context/Auth/AuthContext'
import {CircularProgress} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../config'
import classes from '../Register/Auth.module.scss'
import Google from '../../asset/google.png'
import Facebook from '../../asset/facebook.png'
import Github from '../../asset/github.png'
import firebase from '../../firebase'
import { googleProvider, facebookProvider, githubProvider } from '../service/Auth'



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
            const { createdAt,email, password,updatedAt,__v, ...others } = loginUser.data
            localStorage.setItem('user', JSON.stringify(others))
            window.location.reload(false);        
        } catch (error) {
            ctx.dispatch({type: 'LOGIN_FAILURE', payload: error})
            console.log(error)
        }
    }

    const socialLogin = async (provider) => {
        try {
            const result = await firebase.auth().signInWithPopup(provider)
            const user = {
                email: result.user.email,
                password: result.user.uid
            }
            try {
                const loginUser =  await axiosInstance.post('/auth/login', user)
                const { createdAt,email, password,updatedAt,__v, ...others } = loginUser.data
                localStorage.setItem('user', JSON.stringify(others))
                window.location.reload(false);             
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <div className={classes.container}>
        <div className={classes.nav}>
            <h4>Amit Chat App</h4>
            <h4>Login</h4>
        </div>
        <div className={classes.formWrapper}>
        <div className={classes.formWrapper__form}>
            <div>
                <h2 className={classes.title}>Choose a Login Mathod</h2>
            </div>
            <div className={classes.methodWrapper}>
                <div className={classes.methodWrapper__social}>
                    <div onClick={socialLogin.bind(null, googleProvider)} className={classes.google}>
                    <img className={classes.methodWrapper__social__img} src={Google} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Google</h4>
                    </div>    
                    <div onClick={socialLogin.bind(null, facebookProvider)}  className={classes.facebook}>
                    <img className={classes.methodWrapper__social__img} src={Facebook} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Facebook</h4>
                    </div>                   
                    <div onClick={socialLogin.bind(null, githubProvider)}  className={classes.github}>
                    <img className={classes.methodWrapper__social__img} src={Github} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Github</h4>
                    </div>                   
                </div>
                <div className={classes.methodWrapper__center}>
                    <div className={classes.line} />
                    <div className={classes.or}>OR</div>
                </div>
                <form className={classes.methodWrapper__data}  onSubmit={submitHandler}>
                    <input  type='email' required ref={email} placeholder='Email'></input>
                    <input  type='password' required minLength='6' ref={password} placeholder='Password'></input>
                    <button className={classes.mainButton}>{ctx.isFetching ? <CircularProgress color='white' size='20px' /> : 'Login'}</button>
                    <Link to='/register' style={{textDecoration: 'none', color: 'white'}} className={classes.moveButton}>Dont have an account?</Link>
                </form>
            </div>
        </div>    
        </div>
    </div>
  )
}

export default Login