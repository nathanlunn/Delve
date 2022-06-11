import axios from 'axios';
import React, {useState, useEffect} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function Chat({socket, user, room}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    axios.get(`/messages/${room}`)
      .then(res => {
        console.log(res.data);
        setMessageList((prev) => [...res.data]); 
      })
    }, [room])
    
  const sendMessage = async () => {
    console.log(room);
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: user.name,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((prev) => [...prev, messageData]);
      setCurrentMessage('');
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((prev) => [...prev, data])
    })
    // socket.on('receive_url', (data) => {

    // })
  }, [socket])

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div className="message" id={user.name === messageContent.author ? "you" : "other"}>
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p style={{marginRight: "3px"}}>{messageContent.author}</p>
                    <p>{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          value={currentMessage}
          placeholder="Hey...." 
          onChange={(e) => {setCurrentMessage(e.target.value)}}
          onKeyPress={(event) => {event.key === 'Enter' && sendMessage()}}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}