import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import noProfile from '../../asset/noProfile.png'
import { axiosInstance } from "../../config";

const BeforeMeesaging = ({m, id, user}) => {
  const [members, setMembers] = useState([])
  const [secondUser, setSecondUser] = useState({})
  const [isMessages, setIsMessages] = useState(true)
  const scrollRef = useRef()
  const arr = [id]

    //---------------SCROLL DOWN---------------
    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
      if(m.length === 0) {
        setIsMessages(false)
      } else { setIsMessages(true)
      }
    }, [m])

    useEffect(() => {
      const checkMembers = () => {
        for(let message of m) {
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

    useEffect(() => {
      const fetchMembers = async () => {
        if(arr.length === 1) {
          const second = await axiosInstance.get(`/users/?userId=${members[1]}`)
          setSecondUser(second.data)
        }
      }
      fetchMembers()
    }, [members])

    useEffect(() => {
      console.log(isMessages)
    }, [isMessages])

  return <div>
      {isMessages && m.map(message => {
        console.log(message._id)
              return (
              <div ref={scrollRef}>
               <Message sender={message.sender} text={message.text} key={message._id} id={id} first={user} second={secondUser} time={message.createdAt} />
              </div>)
            })}
            {!isMessages && <h2 className='noConversation'>Start Texting...</h2>}
       </div>;
};

export default BeforeMeesaging;
