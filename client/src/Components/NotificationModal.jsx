import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import { BASE_URL } from '../config';

function NotificationModal({ is_visible, setVisible, notifications, getallnotifications }) {
    const [user, setUser] = useState('')
    useEffect(()=>{
        const user = localStorage.getItem('user_id')
        const user_id = parseInt(user, 10)
        setUser(user_id)
    }, [])

    const getTimeString = (timestamp) => {
        const currentTime = new Date();
        const time = new Date(timestamp)
        const timeDiffInSeconds = Math.floor((currentTime - time) / 1000);
        if (timeDiffInSeconds < 60) {
            return 'just now';
        } else if (timeDiffInSeconds < 3600) {
            const minutes = Math.floor(timeDiffInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (timeDiffInSeconds < 86400) {
            const hours = Math.floor(timeDiffInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(timeDiffInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    }

    async function seenNotification(notification) {
        
        const data = {
            'user_id': user,
            'notification': notification
        }
        const response = await axios.put(`${BASE_URL}/chat/seen/notification`, data)
        console.log(response);
        getallnotifications()
    }
    return (
        <div className={`${is_visible ? 'fixed top-0 left-0' : "hidden"} flex gap-2 bg-black w-full h-full bg-opacity-25`}>
            <div className='flex gap-1 fixed top-8 left-24'>

                <div className='h-full w-[350px] p-1 flex flex-col gap-1 item-center rounded-md bg-amber-100'>
                    {notifications.map((notification, index) => (
                        <div key={notification.id} className={`notification ${notification.seen_by.includes(user) ? 'bg-stone-300' : 'bg-gray-50'} h-1/6 w-full px-1 py-3 rounded-md  cursor-pointer`}
                            onClick={()=>seenNotification(notification.id)}
                        >
                            <h3>{notification.content}</h3>
                            <h6 className='text-right text-xs'>{getTimeString(notification.created_at)}</h6>
                        </div>
                    ))}


                </div>
                <IoClose className='cursor-pointer' size={31} onClick={() => setVisible(prev => !prev)} />
            </div>

        </div>
    )
}

export default NotificationModal