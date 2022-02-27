import './LatestRegister.css'
import '../Conversation/Conversation.css'
import { axiosInstance } from '../../config'
import noProfile from '../../asset/noProfile.png'
import { memo } from 'react'

const LatestRegister = ({img, name, id, friendId}) => {
  if(img === '') img = noProfile

  const newConversation = async () => {
    console.log('new con online')
    if(id !== friendId) {
    const body = {
      senderId: id,
      reciverId: friendId
    }
    const message = await axiosInstance.post('/conversation/', body)
    if(message.status === 201) {
      window.alert(message.data)
    } else if (message.status === 200) {
      window.location.reload(false); 
    }       
  } else {
    window.alert("you can't talk with yourself!")
  }
}

  return ( <>
    <div onClick={newConversation}  className='online'>
        <div className="onlineImgContainer">
        <img src={img} alt="" className="onlineImg" />
        <span className='onlineIndex'></span>
        </div>
        <span className='onlineName'>{name}</span>
    </div>
    </>
  )
}

export default memo(LatestRegister)