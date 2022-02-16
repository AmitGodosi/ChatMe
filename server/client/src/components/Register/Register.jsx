import { useContext, useRef } from 'react'
import './Register.css'
import { axiosInstance } from '../../config'
import { Link } from 'react-router-dom'
import {useHistory} from 'react-router'
import { CloudUploadOutlined} from '@material-ui/icons'
import firebase from '../../firebase'
import { AuthContext } from '../../Context/AuthContext'
import {CircularProgress} from '@material-ui/core'

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

  return (<div className='registerContainer'>
    <div className='registerMessageWrapper'>
        <h2 className='registerMessage'>Start Sending Message Now FOR FREE</h2>
    </div>
    <div className='registerFormWrapper'>
    <form className='registerForm'  onSubmit={submitHandler}>
        <div className='registerInput'>
            <h4>User Name:</h4>
            <input required ref={username}></input>
        </div>        
        <div className='registerInput'>
            <h4>Email:</h4>
            <input type='email' required ref={email}></input>
        </div>        
        <div className='registerInput'>
            <h4>Password:</h4>
            <input type='password' required minLength='6' ref={password}></input>
        </div>                
        <label className='registerInput'>
                <h4> Profile Picture:</h4>
                <input type='file' hidden />
                <CloudUploadOutlined />
        </label>        
        <button className="registerSubmit">{ctx.isFetching ? <CircularProgress color='white' size='20px' /> : 'Create Account'}</button>
        <Link to='/login' style={{textDecoration: 'none', color: 'white'}} className="registerlogin">Already have an account?</Link>
    </form>
    </div>
    </div>
  )
}

export default Register