import './Message.css'
import { useEffect } from 'react'
import noProfile from '../../asset/noProfile.png'
import { useState } from 'react'
import { axiosInstance } from '../../config'


const Message = ({sender, text, id}) => {
  const [img , setImg] = useState(noProfile)
  let own = false
  if(id === sender) own = true

  useEffect(() => {
    const fetchUser = async () => {
      const user = await axiosInstance.get(`/users/?userId=${sender}`)
      if(user.data.pic !== '') setImg(user.data.pic)
    }
    fetchUser()
}, [])

  
  return (<>

    <div className={own ? 'messageCon ownCon' : 'messageCon friendCon'}>
        <img src={img} alt="" className="messageImg" />
        <p className={own ? 'messageText ownText' : 'messageText friendText'}>{text}</p>
    </div>
    </>
  )
}

export default Message