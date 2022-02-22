import React from 'react'
import './Conversation.css'
import { useEffect, useState, useContext } from 'react'
import noProfile from '../../asset/noProfile.png'
import { axiosInstance } from '../../config'
import {useSelector } from 'react-redux'
import { ConversationContext } from '../../Context/Conversation/ConversationContext'

const Conversation = ({c, id, onClick}) => {
  const [friendData, setFriendData] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const friendsQuery = useSelector(state => state.friends)
  const [isIncludes, setIsIncludes] = useState(true)
  const {dispatch} = useContext(ConversationContext)

  //---------------GET FRIEND DATA----------------
  useEffect(() => {
    const getFriend = async () => {
      const friendId = c.members.filter(key => key !== id)
      const URL = '/users/?userId='.concat(friendId[0])    
      const friend = await axiosInstance.get(URL)
      if (friendsQuery === '' || friend.data.username.toLowerCase().includes(friendsQuery)) {
        setFriendData(friend.data)
        setIsIncludes(true)
      } else {
        setIsIncludes(false)
      }
    }
    getFriend()
  }, [friendsQuery])

  //---------------FETCH LAST MESSAGE---------------
  useEffect(() => {
    const fetchMessage = async () => {
      const URL = '/message/'.concat(c._id)
      const res = await axiosInstance.get(URL)
      if(res.data.length > 0) {
        const message = res.data[res.data.length-1]
        const editedMessage = message.text.slice(0,50)
        setLastMessage(editedMessage)
        }    
    }
    fetchMessage()
  }, [c])

  return ( <>
    {isIncludes && 
    <div onClick={onClick} className='conversation'>
      <div className='cImgWrapper'>
        <img src={friendData.pic || noProfile} alt="" className="cImg" />
      </div>
        <div className='cDetails'>
        <span className='cName'>{friendData.username}</span>
        <p className='cMessage'>{lastMessage}</p>
        </div>
    </div>}
    </>
  )
}

export default Conversation