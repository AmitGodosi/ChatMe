import './Message.scss'
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

    <div className={own ? 'ownContainer' : 'friendContainer'}>
        <div className={own ? 'container__Text ownText' : 'container__Text friendText'}>
          <p>{text}</p>
          <span>{time}</span>
        </div>
    </div>
    </>
  )
}

export default Message