import classes from './Auth.module.scss'
import Google from '../../asset/google.png'
import Facebook from '../../asset/facebook.png'
import Github from '../../asset/github.png'
import {CircularProgress} from '@material-ui/core'
import { CloudUploadOutlined} from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { useContext, useRef } from 'react'
import { axiosInstance } from '../../config'
import {useHistory} from 'react-router'
import firebase from '../../firebase'
import { AuthContext } from '../../Context/Auth/AuthContext'
import { googleProvider, facebookProvider, githubProvider } from '../service/Auth'

const Register = () => {
    const username = useRef()
    const password = useRef()
    const email = useRef()
    const history = useHistory()
    const ctx = useContext(AuthContext)

    const submitHandler = async (e) => {
        e.preventDefault()
        const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value
        } 
        if(e.target[3]?.files[0]) {
           const file = e.target[3].files[0]
           const pic = await uploadFile(file)
           user.pic = pic
        }
        ctx.dispatch({type: 'LOGIN_START'})
        try {
            await axiosInstance.post('/auth/register', user)
            ctx.dispatch({type: 'SIGNUP_SUCCESS'})
            history.push('/login')
         } catch (error) {
            ctx.dispatch({type: 'LOGIN_FAILURE', payload: error})
        }
    }

    const uploadFile = async (file) => {
        let URL = ''
        const time = new Date().getTime()
        const res = await firebase.storage().ref().child(`${time}`).put(file)
        URL = await res.ref.getDownloadURL()
        return URL
    }

    const socialRegister = async (provider) => {
        try {
            const result = await firebase.auth().signInWithPopup(provider)
            const user = {
                username: result.user.displayName || 'NULL',
                email: result.user.email,
                password: result.user.uid
            }
            if(result.user?.photoURL) user.pic =  result.user.photoURL
            try {
                await axiosInstance.post('/auth/register', user)
                history.push('/login')
            } catch (error) {
                alert('this email was already in use! try Login instead.') 
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className={classes.container}>
        <div className={classes.nav}>
            <h4>Amit Chat App</h4>
            <h4>Register</h4>
        </div>
        <div className={classes.formWrapper}>
        <div className={classes.formWrapper__form}>
            <div>
                <h2 className={classes.title}>Choose a Register Mathod</h2>
            </div>
            <div className={classes.methodWrapper}>
                <div className={classes.methodWrapper__social}>
                    <div onClick={socialRegister.bind(null,googleProvider)} className={classes.google}>
                    <img className={classes.methodWrapper__social__img} src={Google} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Google</h4>
                    </div>    
                    <div onClick={socialRegister.bind(null,facebookProvider)} className={classes.facebook}>
                    <img className={classes.methodWrapper__social__img} src={Facebook} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Facebook</h4>
                    </div>                   
                    <div onClick={socialRegister.bind(null,githubProvider)} className={classes.github}>
                    <img className={classes.methodWrapper__social__img} src={Github} alt="" />
                    <h4 className={classes.methodWrapper__social__name}>Github</h4>
                    </div>                   
                </div>
                <div className={classes.methodWrapper__center}>
                    <div className={classes.line} />
                    <div className={classes.or}>OR</div>
                </div>
                <form  onSubmit={submitHandler}  className={classes.methodWrapper__data}>
                    <input  type='email' required ref={email} placeholder='Email'></input>
                    <input required ref={username}  placeholder='User Name'></input>
                    <input  type='password' required minLength='6' ref={password} placeholder='Password'></input>
                    <label className={classes.profilePic}>
                        <h4> Profile Picture:</h4>
                        <input type='file' hidden />
                        <CloudUploadOutlined />
                    </label> 
                    <button className={classes.mainButton}>{ctx.isFetching ? <CircularProgress color='white' size='20px' /> : 'Create Account'}</button>
                    <Link to='/login' style={{textDecoration: 'none', color: 'white'}} className={classes.moveButton}>Already have an account?</Link>
                </form>
            </div>
        </div>    
        </div>
    </div>
  )
}

export default Register