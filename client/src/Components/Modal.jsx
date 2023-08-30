import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../config'
import { IoClose } from 'react-icons/io5'

const Modal = ({ is_visible, setVisible, getallrooms, setRooms }) => {
    const [name, setName] = useState('')
    const [user, setUserId ] = useState('')

    async function createRoom() {
        const user = localStorage.getItem('user_id')
        if (user) {
            setUserId(user)
            const data = { 'name': name, 'user': user }
            const response = await axios.post(`${BASE_URL}/chat/createnew/room`, data)
            const new_room = response.data
            // getallrooms()
            setRooms((prevRooms) => [...prevRooms, new_room])
            setVisible(prev => !prev)
          }
        
    }
    
    return (
        <div className={`${is_visible ? 'fixed top-0 left-0' : "hidden"} flex justify-center items-center gap-2 bg-black w-full h-full bg-opacity-30`}>

            <div className='h-[150px] w-1/2 flex justify-center rounded-md items-center bg-amber-50'>
                <form className='flex justify-center items-center w-full gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        createRoom()
                    }}
                >
                    <input className='h-10 w-1/2 p-2 outline-none' type="text"
                        onChange={e => setName(e.target.value)}
                    />
                    <button type='submit' className='bg-amber-200 px-10 py-2 rounded-3xl font-bold text-emerald-900 text-xl cursor-pointer'>Create</button>
                </form>

            </div>
            <div className='h-[150px]'>
                <IoClose className='cursor-pointer' size={31} onClick={()=>setVisible(prev => !prev)} />
            </div>
        </div>
    )
}

export default Modal