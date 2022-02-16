import './Online.css'
import '../Conversation/Conversation.css'
import { axiosInstance } from '../../config'
import noProfile from '../../asset/noProfile.png'
import axios from 'axios'

const Online = ({img, name, id, friendId}) => {
  if(img === '') img = noProfile

  const newConversation = async () => {
    if(id !== friendId) {
    const body = {
      senderId: id,
      reciverId: friendId
    }
    const message = await axios.post('http://localhost:5000/api/conversation/', body)
    if(message.status === 201) {
      window.alert(message.data)
    } else if (message.status === 200) {
      window.location.reload(false); 
    }       
  } else {
    window.alert("you can't talk with yourself!")
  }
}

  return (
    <div className='online'>
        <div className="onlineImgContainer">
        <img onClick={newConversation} src={img} alt="" className="onlineImg" />
        <span className='onlineIndex'></span>
        </div>
        <span className='onlineName'>{name}</span>
    </div>
  )
}

export default Online