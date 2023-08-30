import React, { useEffect, useRef, useState } from 'react'
import ChatRoom from './ChatRoom';
import { BASE_URL } from '../config';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

function Chat() {
  const [newMessage, setNewMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);

  const socketRef = useRef(null);

  function getUserId() {
    const user = localStorage.getItem('user_id')
    const user_id = parseInt(user, 10)
    if (user_id) {
      setAuthor(user_id)
    }
  }
  async function getallrooms() {
    const response = await axios.get(`${BASE_URL}/chat/rooms/getall/`)
    setRooms(response.data)
    setActiveRoomId(response.data[0].id)
  }

  useEffect(() => {
    getUserId()
    getallrooms()
  }, [])

  useEffect(() => {
    if (activeRoomId) {
      socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${activeRoomId}/`);

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const message = data.message
        setMessages((prevMessages) => [...prevMessages, data]);
      }
      axios.get(`${BASE_URL}/chat/rooms/${activeRoomId}/messages`).then((response) => {
        setMessages(response.data)
      }).catch((error) => {
        console.error('Error:', error)
      })
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      }
    }
  }, [activeRoomId])

  const sendMessage = () => {
    const message = {
      content: newMessage,
      author: author,
      room: activeRoomId,
    };

    if (socketRef.current) {
      const response = socketRef.current.send(JSON.stringify(message));
    }
    setNewMessage("")
  }

  return (
    <div className="flex h-screen  rounded-md bg-gray-200">
      <Toaster position="top-right" reverseOrder={false} />
      <ChatRoom
        rooms={rooms}
        activeRoomId={activeRoomId}
        setActiveRoomId={setActiveRoomId}
        getallrooms={getallrooms}
        setRooms={setRooms}
      />
      <div className="flex-grow ">
        <div className="flex flex-col h-screen">
          <div className="py-4 px-6 bg-emerald-600 text-white">
            <h2 className="text-xl font-bold">Share your views</h2>
          </div>
          <div className="flex-grow p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  //   ref={scroll}
                  className={`flex ${message.author === author ? 'justify-end' : 'justify-start'
                    } mb-4`}
                >
                  <div
                    className={`${message.author === author
                      ? 'bg-gray-400 text-white self-end'
                      : 'bg-emerald-700 text-white self-start'
                      } py-1 px-4 rounded-md max-w-md`}
                  >
                    <div className="flex items-center">
                      {message.author === author ? (
                        <>
                          <div className="mr-3">{message.content}</div>
                        </>
                      ) : (
                        <>
                          <div>{message.content}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">No messages yet</div>
            )}
          </div>
          <div className="py-4 px-6 bg-gray-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-sm px-4 py-2 outline-none"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-emerald-700 text-white px-4 py-2 rounded-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat