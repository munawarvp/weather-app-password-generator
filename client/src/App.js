import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import ChatRoom from "./Components/ChatRoom";
import Chat from "./Components/Chat";
import SocketProvider from "./Components/SocketProvider";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path="/login" exact Component={Login} />
          <Route path="/register" exact Component={Register} />

          <Route path="/" Component={SocketProvider}>
            <Route path="" exact Component={Home} />
            <Route path="chat/:room_name" exact Component={Chat} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
