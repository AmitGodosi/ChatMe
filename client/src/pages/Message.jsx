import Chat from "../components/Chat/Chat"
import Navbar from "../components/Navbar/Navbar"
import {ConversationContextProvider} from '../Context/Conversation/ConversationContext'
import { Provider } from "react-redux";
import store from '../store/index'

const Message = () => {
  return (<>
    <Navbar />
    <Provider store={store}>
    <ConversationContextProvider>
    <Chat />
    </ConversationContextProvider>
    </Provider>
    </>
  )
}

export default Message