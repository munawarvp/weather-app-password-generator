import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';
import {AiOutlinePlus} from 'react-icons/ai'
import Modal from './Modal';

function ChatRoom({ rooms, activeRoomId, setActiveRoomId, getallrooms, setRooms }) {
    const navigate = useNavigate()
    const [is_visible, setVisible] = useState(false)
    return (
        <div className="flex flex-col bg-amber-50 h-screen w-80 border-r-2 border-gray-300">
            <Modal is_visible={is_visible} setVisible={setVisible} getallrooms={getallrooms} setRooms={setRooms}/>
            <h2 className="text-xl font-bold p-4 bg-amber-200 text-gray-700">Weather Community</h2>
            <ul className="flex flex-col h-screen justify-between">
                <div>
                    {rooms.map((room) => (
                        <li
                            key={room.id}
                            className={`flex items-center py-3 px-4 cursor-pointer ${room.id === activeRoomId ? 'bg-gray-300' : 'hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveRoomId(room.id)}
                        >
                            <div className="flex-shrink-0 mr-3 mt-1">

                            </div>
                            <div className="flex-grow">
                                <h3 className="text-start ms-3 text-lg font-semibold">{room.name}</h3>
                                {/* <p className="text-gray-500 truncate text-sm">{room.lastMessage}</p> */}
                            </div>
                        </li>
                    ))}
                </div>
                <div>
                    <li className='flex items-center gap-4 py-3 px-4'>
                        <div className="flex-shrink-0 mr-3 mt-1">

                        </div>
                        <button className='bg-amber-200 w-1/2 px-10 py-2 rounded-3xl font-bold text-emerald-900 text-xl cursor-pointer'
                        onClick={()=>navigate('/')}
                        >Exit</button>
                        <button className='bg-emerald-900 px-2 py-2 rounded-3xl font-bold text-white text-xl cursor-pointer'
                        onClick={()=>setVisible(prev=>!prev)}
                        ><AiOutlinePlus size={26}/></button>
                    </li>
                </div>


            </ul>
        </div>
    )
}

export default ChatRoom