import React from 'react'
import './Conversation.css'
import { useEffect, useState } from 'react'
import noProfile from '../../asset/noProfile.png'
import { axiosInstance } from '../../config'
import {useSelector } from 'react-redux'

const Conversation = ({c, id, onClick}) => {
  const [friendData, setFriendData] = useState('')
  const friendsQuery = useSelector(state => state.friends)
  const [isIncludes, setIsIncludes] = useState(true)

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

  return ( <>
    {isIncludes && <div className='conversation'>
        <img onClick={onClick}  src={friendData.pic || noProfile} alt="" className="conversationImg" />
        <span className='conversationName'>{friendData.username}</span>
    </div>}
    </>
  )
}

export default Conversation