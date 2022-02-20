import './Message.css'
import noProfile from '../../asset/noProfile.png'
import {format} from 'timeago.js';

const Message = ({sender, text, id, second, first, time}) => {
  const fUser = JSON.parse(first)
  let own = true
  let user = fUser
  if(id !== sender) {
    own = false
    user = second
  }

  time = format(time)

  return (<>

    <div className={own ? 'messageCon ownCon' : 'messageCon friendCon'}>
      <div className='textDetails'>
        <img src={user.pic || noProfile} alt="" className="messageImg" />
        <p className={own ? 'messageText ownText' : 'messageText friendText'}>{text}</p>
      </div>
        <span className='time'>{time}</span>
    </div>
    </>
  )
}

export default Message