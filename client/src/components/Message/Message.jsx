import './Message.scss'
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

    <div className={own ? 'container ownCon' : 'container friendCon'}>
      <div className='container__Details'>
        <img src={user.pic || noProfile} alt=""/>
        <div className={own ? 'container__Details__Text ownText' : 'container__Details__Text friendText'}>
          <p>{text}</p>
          <span>{time}</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Message