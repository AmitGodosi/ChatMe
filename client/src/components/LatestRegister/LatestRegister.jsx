import classes from './LatestRegister.module.scss'
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
    <div onClick={newConversation}  className={classes.online}>
        <div className={classes.online__ImgContainer}>
          <img src={img} alt=""/>
        </div>
        <span className={classes.online__Name}>{name}</span>
    </div>
    </>
  )
}

export default memo(LatestRegister)