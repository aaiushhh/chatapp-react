import "./ChatBox.css"
import { UserContext } from '../../context/ContextProvider';
import { useContext } from "react";
import SingleChat from "./SingleChat";


const ChatBox = ({fetchAgain,setfetchAgain,displayDetails, setdisplayDetails}) => {

  const { user,selectedChat,setselectedChat,chats, setchats } = useContext(UserContext);

  return (
    <div>
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} displayDetails={displayDetails} setdisplayDetails={setdisplayDetails}/>
    </div>
  )
}
export default ChatBox