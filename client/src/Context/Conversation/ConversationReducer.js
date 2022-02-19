const ConversationReducer = (state, action) => {
  switch (action.type) {
    case "USER_OPEN_CONVERSATION":
      return {
        userOpenConversation: action.payload,
        openConversation: state.openConversation,
        openConversationMessages: state.openConversationMessages,
      };
    case "OPEN_CONVERSATION":
      return {
        userOpenConversation: state.openConversation,
        openConversation: action.payload,
        openConversationMessages: state.openConversationMessages,
      };
    case "OPEN_CONVERSATION_MESSAGES":
      return {
        userOpenConversation: state.userOpenConversation,
        openConversation: state.openConversation,
        openConversationMessages: action.payload,
      };
  }
};

export default ConversationReducer;
