import Chat from "../components/Chat/Chat";
import { ConversationContextProvider } from "../Context/Conversation/ConversationContext";
import { Provider } from "react-redux";
import store from "../store/index";

const Message = () => {
  return (
    <>
      <Provider store={store}>
        <ConversationContextProvider>
          <Chat />
        </ConversationContextProvider>
      </Provider>
    </>
  );
};

export default Message;
