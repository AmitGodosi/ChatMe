import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { axiosInstance } from "../../config";
import { ConversationContext } from '../../Context/Conversation/ConversationContext';
import './Message.scss'

const BeforeMessaging = ({id, user}) => {
  const [members, setMembers] = useState([id])
  const [secondUser, setSecondUser] = useState({})
  const [isMessages, setIsMessages] = useState(true)
  const {openConversationMessages, dispatch} = useContext(ConversationContext)
  const scrollRef = useRef()

    //---------------SET MEMBERS // SCROLL DOWN // MESSAGES EXIST?---------------
    useEffect(() => {
      dispatch({type: 'OPEN_CONVERSATION_MESSAGES', payload: [{key: '1'}]})
    }, [])

    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
      if(openConversationMessages.length === 0) {
        setIsMessages(false)
      } else { 
        setIsMessages(true)
      }
      for(let message of openConversationMessages) {
        if(message.sender !== members[0]) {
          setMembers(prev => [...prev, message.sender])
          return
        }
      }
    }, [openConversationMessages])

    //---------------SET CONVERSATION FRIEND---------------
    useEffect(() => {
      const fetchMembers = async () => {
        if(members.length === 2) {
          const second = await axiosInstance.get(`/users/?userId=${members[1]}`)
          setSecondUser(second.data)
        }
      }
      fetchMembers()
    }, [members])

  return <div>
      {isMessages && openConversationMessages.map(message => {
              return (
              <div key={message._id} ref={scrollRef}>
                  <Message sender={message.sender} text={message.text} id={id} first={user} second={secondUser} time={message.createdAt} />
              </div>)
            })}
            {!isMessages && <h2 className='noConversation'>Start Texting...</h2>}
       </div>;
};

export default BeforeMessaging;
