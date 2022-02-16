import Conversation from '../Conversation/Conversation';
import Message from '../Message/Message'
import './Chat.css'
import noProfile from '../../asset/noProfile.png'
import Online from '../Online/Online';
import { useEffect, useState, useRef} from 'react';
import {io} from 'socket.io-client'
import { axiosInstance } from '../../config'

const Chat = () => {
  const messageInput = useRef() 
  const [conversation, setConversation] = useState([])
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [reversedUsers, setReversedUsers] = useState([])
  const [openConversation, setOpenConversation] = useState({})
  const [currentChat, setCurrentChat] = useState({})
  const user = localStorage.getItem('user')
  const id = JSON.parse(user)._id
  const scrollRef = useRef()

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
      arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages(prev => [...prev, arrivalMessage])
  }, [arrivalMessage, openConversation])

  useEffect(() => {
    socket.current.emit("addUser", id)
    socket.current.on("getUsers", users => {
      console.log(users)
    })
  }, [id])

  // fetch all conversation
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

  //fetch all users
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await axiosInstance.get('/users/all')
      setUsers(allUsers.data)
      setReversedUsers([...allUsers.data].reverse())
    }
    getUsers()
  }, [])

  //send new message
  const sendMessageHandler = async (e) => {
    e.preventDefault()
    const body = {
      conversationId: currentChat._id,
      sender: id,
      text: messageInput.current.value
    }
    
    const receiverId = currentChat.members.find(member => member !== id)

    socket.current.emit("sendMessage", {
      senderId: id,
      receiverId,
      text: messageInput.current.value
    })

    try {
      const res = await axiosInstance.post('/message/', body)
      setMessages([...messages ,res.data])
      messageInput.current.value = ''  
    } catch (error) {
      console.log(error)
    }
  }

  //get all conversation messages
  const fetchMessage = async (c) => {
    setCurrentChat(c)
    const URL = '/message/'.concat(c._id)
    const res = await axiosInstance.get(URL)
    setMessages(res.data)

    const friendId = c.members.filter(key => key !== id)
    const body = {
      userId: friendId
    }
    const friendURL = '/users/?userId='.concat(friendId[0])    
    const friend = await axiosInstance.get(friendURL, body)
    setOpenConversation(friend.data)
  }

  // scrollDown
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  return <div className='messageContainer'>
    {/* leftbar */}
    <div className="leftBar">
      <div className="searchContainer">
        <input placeholder='Search...' type="text" className="search" />
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
      <div className='newUsersList'>
      {users.length > 0 && reversedUsers.map(user => {
      return <Online friendId={user._id} id={id} img={user.pic} name={user.username} key={user._id}/>
      })}
      </div>
    </div>
    
    {/* messages */}
    <div className="message">
      <div className='chatMessageContainer'>
        {Object.keys(openConversation).length !== 0 && <h4 className='ChatConversationName'>{openConversation.username}</h4>}
        {messages.length > 0 && messages.map(message => {
          return <div ref={scrollRef}>
               <Message img={noProfile} sender={message.sender} text={message.text} key={message._id} id={id} />
          </div>
        })}
        {messages.length === 0 && Object.keys(openConversation).length !== 0 && <h2 className='noConversation'>Start Texting...</h2>}
        {Object.keys(openConversation).length === 0 && <h2 className='noConversation'>Open a conversation</h2>}
      </div>
      {Object.keys(openConversation).length !== 0 && <div className='chatMessageInput'>
        <textarea ref={messageInput} className='chatMessageTextarea' placeholder='Write Something...'></textarea>
        <button onClick={sendMessageHandler}>Send</button>
      </div>}
    </div>

  </div>;
};

export default Chat;
