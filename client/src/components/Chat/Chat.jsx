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
import BeforeMeesaging from '../Message/BeforeMeesaging';

const Chat = () => {
  const reduxDispatch = useDispatch()
  const {userOpenConversation, openConversation, openConversationMessages, dispatch} = useContext(ConversationContext)
  const [conversation, setConversation] = useState([])
  const [users, setUsers] = useState([])
  const [temp, setTemp] = useState([])
  const [reversedUsers, setReversedUsers] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const user = localStorage.getItem('user')
  const messageInput = useRef() 
  // const scrollRef = useRef()
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
      // setTemp(prev => [...prev, res.data])
      messageInput.current.value = ''  
    } catch (error) {
      console.log(error)
    }
  }
useEffect(() => {
}, [openConversationMessages])

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
    setIsOpen(true)
  }

  //-----------------SEARCH--------------------
  const friendsQueryHandler = (e) => {
    const query = e.target.value
    reduxDispatch(queryActions.friends(query.toLowerCase()))
  }

  const usersQueryHandler = (e) => {
    const query = e.target.value
    if(query === '') {
      setReversedUsers([...users].reverse())
    } else {
      const includesUsers = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      setReversedUsers(includesUsers)
    }
  }

  //-----------------SHOW ALL--------------------
  const backToMain = () => {
    setIsOpen(false)
  }

  return <div className='messageContainer'>
    {/* leftbar */}
    {!isOpen && <div className="leftBar">
      {/* friends conversation */}
    <div className='conversationWrapper'>
    <h4 className='newUsers'>Your Friends</h4>
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
      {users.length > 0 && reversedUsers.map(user => {
      return <Online friendId={user._id} id={id} img={user.pic} name={user.username} key={user._id}/>
      })}
      </div>
    </div>
    </div>}
    
    {/* messages */}
    <div className="message">
      {isOpen && <>
        <div className='UserConversationNav'>
           <button onClick={backToMain}>BACK</button>
           <h4>{userOpenConversation.username}</h4>
        </div>
        <div>
        <div className='openConversationMessages'>
        {<BeforeMeesaging user={user} id={id} m={openConversationMessages} />}
        </div>
      <div className='chatMessageInput'>
        <textarea ref={messageInput} className='chatMessageTextarea' placeholder='Write Something...'></textarea>
        <button onClick={sendMessageHandler}>Send</button>
      </div>
      </div>
      </>}
      {!isOpen && <h2 className='noOpenConversation'>Open a conversation</h2>}
    </div>

  </div>;
};

export default Chat;
