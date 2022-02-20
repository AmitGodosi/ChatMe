import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import noProfile from '../../asset/noProfile.png'
import { axiosInstance } from "../../config";

const BeforeMeesaging = ({m, id, user}) => {
  const ownUser = JSON.parse(user)
  const [members, setMembers] = useState([])
  const [secondUser, setSecondUser] = useState({})
  const scrollRef = useRef()
  const arr = [id]

    //---------------SCROLL DOWN---------------
    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
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

  return <div>
            {m.map(message => {
              console.log(m)
              return (
              <div ref={scrollRef}>
               <Message sender={message.sender} text={message.text} key={message._id} id={id} first={user} second={secondUser} time={message.createdAt} />
              </div>)
            })}
        </div>;
};

export default BeforeMeesaging;
