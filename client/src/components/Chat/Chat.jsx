import Conversation from '../Conversation/Conversation';
import './Chat.css'
import LatestRegister from '../LatestRegister/LatestRegister';
import { useEffect, useState, useRef, useContext} from 'react';
import {io} from 'socket.io-client'
import { axiosInstance } from '../../config'
import { ConversationContext } from '../../Context/Conversation/ConversationContext';
import { useDispatch } from 'react-redux'
import { queryActions } from '../../store/index'
import BeforeMessaging from '../Message/BeforeMessaging';
import noProfile from '../../asset/noProfile.png'

const Chat = () => {
  const reduxDispatch = useDispatch() 
  const {userOpenConversation, openConversation, openConversationMessages, isOpen, dispatch} = useContext(ConversationContext)
  const [conversation, setConversation] = useState([])
  const [users, setUsers] = useState([])
  const user = localStorage.getItem('user')
  const messageInput = useRef() 
  const id = JSON.parse(user)._id

  //---------------SOCKET---------------
  const socket = useRef()
  const [arrivalMessage, setArrivalMessage] = useState(null)
  
  useEffect(() => {
    socket.current = io("ws://localhost:8900")
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
     if (arrivalMessage && openConversation?.members.includes(arrivalMessage.sender)) {
        dispatch({type: 'OPEN_CONVERSATION_MESSAGES', payload:[...openConversationMessages, arrivalMessage]})
     }
  }, [arrivalMessage, userOpenConversation])

  useEffect(() => {
    socket.current.emit("addUser", id)
    socket.current.on("getUsers", users => {
    })
  }, [id])

  //---------------FETCH ALL CONVERSATIONS---------------
  useEffect(() => {
    const conversationHandler = async () => {
      if(conversation.length === 0) {
      try {
        const URL = '/conversation/'.concat(id)
        const res = await axiosInstance.get(URL)
        setConversation(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
    conversationHandler()
  }, [])

  //---------------FETCH ALL USERS---------------
  useEffect(() => {
    const getUsers = async () => {
      if(users.length === 0) {
      const allUsers = await axiosInstance.get('/users/all')
      setUsers(allUsers.data)
    }
  }
    getUsers()
  }, [])

  //---------------SEND NEW MESSAGE---------------
  const sendMessageHandler = async (e) => {
    e.preventDefault()
    const body = {
      conversationId: openConversation._id,
      sender: id,
      text: messageInput.current.value
    }
    
    const receiverId = openConversation.members.find(member => member !== id)

    socket.current.emit("sendMessage", {
      senderId: id,
      receiverId,
      text: messageInput.current.value
    })

    try {
      const res = await axiosInstance.post('/message/', body)
      dispatch({type: 'OPEN_CONVERSATION_MESSAGES', payload: [...openConversationMessages, res.data]})
      messageInput.current.value = ''  
    } catch (error) {
      console.log(error)
    }
  }

  //---------------FETCH ALL CONVERSATION MESSAGE---------------
  const fetchMessage = async (c) => {
    dispatch({type: 'OPEN_CONVERSATION', payload: c})
    const URL = '/message/'.concat(c._id)
    const res = await axiosInstance.get(URL)
    dispatch({type: 'OPEN_CONVERSATION_MESSAGES', payload: res.data})
    
    const friendId = c.members.filter(key => key !== id)
    const body = {
      userId: friendId
    }
    const friendURL = '/users/?userId='.concat(friendId[0])    
    const friend = await axiosInstance.get(friendURL, body)
    await dispatch({type: 'USER_OPEN_CONVERSATION', payload: friend.data})
  }

  //-----------------SEARCH--------------------
  const friendsQueryHandler = (e) => {
    const query = e.target.value
    reduxDispatch(queryActions.setQuery(query))
  }

  const usersQueryHandler = (e) => {
    const query = e.target.value
    if(query === '') {
      setUsers(prev =>[...prev])
    } else {
      const includesUsers = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      if(includesUsers.length === 0) includesUsers.push({pic: noProfile,username: 'No Such Result'})
      setUsers(includesUsers)
    }
  }

  //-----------------SHOW ALL--------------------
  const backToMain = () => {
    dispatch({type: 'IS_OPEN'})
    }

  return (
  <div className='messageContainer'>
    {!isOpen && <> 
    {/* TITLE */}
    <div className='messageTitle'>
      <h2>Amit Godosi Chap App</h2>
    </div>
    {/* leftbar */}
    <div className="leftBar">
      {/* friends conversation */}
    <div className='conversationWrapper'>
    <h4 className='newUsers'>Chats</h4>
      <div className="searchContainer">
        <input placeholder='Search...' type="text" className="search" onChange={friendsQueryHandler}/>
      </div>
      <div className="conversationContainer">
        {conversation.length > 0 && conversation.map(c => {
          return <Conversation c={c} key={c._id} id={id} onClick={fetchMessage.bind(null, c)}/>
        })}
        {conversation.length === 0 && <p>You dont start any conversation!</p>}
      </div>
      </div>
      
          {/* new users */}
       <div className='newUserWrapper'>
      <h4 className='newUsers'>Newest Users</h4>
      <div className="searchContainer">
        <input placeholder='Search...' type="text" className="search" onChange={usersQueryHandler}/>
      </div>
      <div className='newUsersList'>
      {users.length > 0 && users.map(user => {
      return <LatestRegister friendId={user._id} id={id} img={user.pic} name={user.username} key={user._id}/>
      })}
      </div>
    </div>
    </div>
    </>}
    
    {/* messages */}
      {isOpen && <>
    <div className="message">
        <div className='UserConversationNav'>
           <button onClick={backToMain}>BACK</button>
           <h4>{userOpenConversation.username}</h4>
        </div>
        <div>
        <div className='openConversationMessages'>
        {<BeforeMessaging user={user} id={id}/>}
        </div>
      <div className='chatMessageInput'>
        <textarea ref={messageInput} className='chatMessageTextarea' placeholder='Write Something...'></textarea>
        <button onClick={sendMessageHandler}>Send</button>
      </div>
      </div>
    </div>
      </>}

  </div>
  );
};

export default Chat;
