import Conversation from '../Conversation/Conversation';
import Message from '../Message/Message'
import './Chat.css'
import noProfile from '../../asset/noProfile.png'
import Online from '../Online/Online';
import { useEffect, useState, useRef, useContext} from 'react';
import {io} from 'socket.io-client'
import { axiosInstance } from '../../config'
import { ConversationContext } from '../../Context/Conversation/ConversationContext';
import { useDispatch } from 'react-redux'
import { queryActions } from '../../store/index';

const Chat = () => {
  const reduxDispatch = useDispatch()
  const {userOpenConversation, openConversation, openConversationMessages, dispatch} = useContext(ConversationContext)
  const [conversation, setConversation] = useState([])
  const [users, setUsers] = useState([])
  const [reversedUsers, setReversedUsers] = useState([])
  const [usersQuery, setUsersQuery] = useState('')
  const user = localStorage.getItem('user')
  const messageInput = useRef() 
  const scrollRef = useRef()
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
      arrivalMessage && openConversation?.members.includes(arrivalMessage.sender) && dispatch({type: 'OPEN_CONVERSATION_MESSAGES', payload:[...openConversationMessages, arrivalMessage]})
  }, [arrivalMessage, userOpenConversation])

  useEffect(() => {
    socket.current.emit("addUser", id)
    socket.current.on("getUsers", users => {
    })
  }, [id])

  //---------------FETCH ALL CONVERSATIONS---------------
  useEffect(() => {
    const conversationHandler = async () => {
      try {
        const URL = '/conversation/'.concat(id)
        const res = await axiosInstance.get(URL)
        setConversation(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    conversationHandler()
  }, [])

  //---------------FETCH ALL USERS---------------
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await axiosInstance.get('/users/all')
      setUsers(allUsers.data)
      setReversedUsers([...allUsers.data].reverse())
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
    dispatch({type: 'USER_OPEN_CONVERSATION', payload: friend.data})

  }

  //---------------SCROLL DOWN---------------
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [openConversationMessages])

  const friendsQueryHandler = (e) => {
    reduxDispatch(queryActions.friends(e.target.value))
  }

  const usersQueryHandler = (e) => {
    // reduxDispatch(queryActions.users(e.target.value))

    if(e.target.value === '') {
      setReversedUsers([...users].reverse())
    } else {
      const includesUsers = users.filter(user => user.username.toLowerCase().includes(e.target.value))
      setReversedUsers(includesUsers)
    }
  }

  return <div className='messageContainer'>
    {/* leftbar */}
    <div className="leftBar">
      <div className="searchContainer">
        <input placeholder='Search...' type="text" className="search" onChange={friendsQueryHandler}/>
      </div>
      <div className="conversationContainer">
        {conversation.length > 0 && conversation.map(c => {
          return <Conversation c={c} key={c._id} id={id} onClick={fetchMessage.bind(null, c)}/>
        })}
        {conversation.length === 0 && <p>You dont start any conversation!</p>}
      </div>
          {/* new users */}
      <h4 className='newUsers'>Newest Users</h4>
      <h6 className='selectUser'>Tap on a user and start new conversation</h6>
      <div className="searchContainer">
        <input placeholder='Search...' type="text" className="search" onChange={usersQueryHandler}/>
      </div>
      <div className='newUsersList'>
      {users.length > 0 && reversedUsers.map(user => {
      return <Online friendId={user._id} id={id} img={user.pic} name={user.username} key={user._id}/>
      })}
      </div>
    </div>
    
    {/* messages */}
    <div className="message">
      <div className='chatMessageContainer'>
        {Object.keys(userOpenConversation).length !== 0 && <h4 className='ChatConversationName'>{userOpenConversation.username}</h4>}
        <div className='openConversationMessages'>
        {openConversationMessages.length > 0 &&
        openConversationMessages.map(message => {
          return (<div ref={scrollRef}>
               <Message img={noProfile} sender={message.sender} text={message.text} key={message._id} id={id} />
          </div>)
        })}
        </div>
        {openConversationMessages.length === 0 && Object.keys(userOpenConversation).length !== 0 && <h2 className='noConversation'>Start Texting...</h2>}
        {Object.keys(userOpenConversation).length === 0 && <h2 className='noConversation'>Open a conversation</h2>}
      </div>
      {Object.keys(userOpenConversation).length !== 0 && <div className='chatMessageInput'>
        <textarea ref={messageInput} className='chatMessageTextarea' placeholder='Write Something...'></textarea>
        <button onClick={sendMessageHandler}>Send</button>
      </div>}
    </div>

  </div>;
};

export default Chat;
