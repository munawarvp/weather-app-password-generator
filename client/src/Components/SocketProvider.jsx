import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast';
import { Outlet } from "react-router-dom";

function SocketProvider() {

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/notifications/');
    
        socket.onopen = () => {
          console.log('WebSocket connection opened');
        };
    
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data.message);
          // Update UI or show notification
          toast.success(data.message)
        };
    
        socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        return () => {
          socket.close();
        };
      }, []);

  return (
    <Outlet/>
  )
}

export default SocketProvider