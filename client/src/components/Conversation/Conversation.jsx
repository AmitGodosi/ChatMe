import classes from './Conversation.module.scss'
import { useEffect, useState, memo } from 'react'
import noProfile from '../../asset/noProfile.png'
import { axiosInstance } from '../../config'
import {useSelector, useDispatch } from 'react-redux'
import {queryActions} from '../../store/index'

const Conversation = ({c, id, onClick}) => {
  const dispatch = useDispatch()
  const [friendData, setFriendData] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const [isExist, setIsExist] = useState(true)
  const friendQuery = useSelector(state => state.friendQuery)

  //---------------GET FRIEND DATA----------------
  useEffect(() => {
    const getFriend = async () => {
      const friendId = c.members.filter(key => key !== id)
      const URL = '/users/?userId='.concat(friendId[0])    
      const friend = await axiosInstance.get(URL)
      dispatch(queryActions.setChats(friend.data))
      if(friendQuery === '' || friend.data.username.toLowerCase().includes(friendQuery)) {
        setFriendData(friend.data)
        setIsExist(true)
      } else {
        setIsExist(false)
      }
    }
    getFriend()
  }, [c, id, friendQuery])

  //---------------FETCH LAST MESSAGE---------------
  useEffect(() => {
    const fetchMessage = async () => {
      const URL = '/message/'.concat(c._id)
      const res = await axiosInstance.get(URL)
      if(res.data.length > 0) {
        const message = res.data[res.data.length-1]
        const editedMessage = message.text.slice(0,20)
        setLastMessage(editedMessage)
        }    
    }
    fetchMessage()
  }, [c])

  return (<>
   {isExist && 
   <div onClick={onClick} className={classes.conversation}>
      <div className={classes.conversation__ImgWrapper}>
        <img src={friendData.pic || noProfile} alt="" />
      </div>
      <div className={classes.conversation__Details}>
        <span>{friendData.username}</span>
        <p>{lastMessage}</p>
      </div>
    </div>}
    </>
  )
}

export default memo(Conversation)