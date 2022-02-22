import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { axiosInstance } from "../../config";
import { ConversationContext } from '../../Context/Conversation/ConversationContext';
import './Message.css'


const BeforeMeesaging = ({id, user}) => {
  const [members, setMembers] = useState([])
  const [secondUser, setSecondUser] = useState({})
  const [isMessages, setIsMessages] = useState(true)
  const { dispatch, openConversationMessages} = useContext(ConversationContext)
  const scrollRef = useRef()
  const arr = [id]

    //---------------SCROLL DOWN // MESSAGES EXIST?---------------
    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
      if(openConversationMessages.length === 0) {
        setIsMessages(false)
      } else { 
        setIsMessages(true)
      }
    }, [openConversationMessages])

    //---------------SET MEMBERS---------------
    useEffect(() => {
      const checkMembers = () => {
        const temp = []
        const arr = Object.assign(temp,openConversationMessages)
        dispatch({type:'OPEN_CONVERSATION_MESSAGES', payload: [arr]})
        for(let message of openConversationMessages) {
          if(arr.length === 1 && message.sender !== arr[0]) {
            arr.push(message.sender)
          }
          else {
            setMembers(arr)
            return
          }
        }
      }
      checkMembers()
    }, [])

    //---------------SET CONVERSATION FRIEND---------------
    useEffect(() => {
      const fetchMembers = async () => {
        if(arr.length === 1) {
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

export default BeforeMeesaging;
