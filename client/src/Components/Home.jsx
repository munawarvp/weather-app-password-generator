import React, { useEffect, useState } from 'react'
import Icon from '../assets/4102326_cloud_sun_sunny_weather_icon.png'
import axios from 'axios'
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast';
import {IoMdNotificationsOutline} from 'react-icons/io'
import NotificationModal from './NotificationModal';

function Home() {
  const [location, setLocation] = useState('')
  const [data, setData] = useState({})
  const [user_id, setUserId] = useState('')
  const [room_name, setRoomname] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [is_visible, setVisible] = useState(false)
  const [notifications, setNotifications] = useState([])

  const navigate = useNavigate()

  const api_key = 'https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=66bc402a4face667a247fbd26bd9b914'
  const city_key = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=66bc402a4face667a247fbd26bd9b914'

  useEffect(() => {
    getUserId()
    locationBased()
    getallnotifications()
  }, [])

  function getUserId() {
    const user = localStorage.getItem('user_id')
    console.log(user, 'sss');
    if (user) {
      setUserId(user)
    }
  }

  async function getallnotifications() {
    const response = await axios.get(`${BASE_URL}/chat/list/allnotifications`)
    if (response.status === 200) {
      setNotifications(response.data)
    }
    else {
      toast.error('Somthing Went Wrong')
    }
  }

  async function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position.coords.latitude);
      setLat(position.coords.latitude)
      setLon(position.coords.longitude)
    })
  }

  async function locationBased() {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position.coords.latitude);
        setLat(position.coords.latitude)
        setLon(position.coords.longitude)
        // console.log(lat, lon);
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=66bc402a4face667a247fbd26bd9b914&units=metric`)
        setData(response.data)
      })

    }
    catch (error) {
      console.log(error);
    }
  }

  async function searchLocation() {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=66bc402a4face667a247fbd26bd9b914&units=metric`)
      setData(response.data)
    }
    catch (error) {
      console.log(error);
    }
  }

  async function communitychat(room_name) {
    const response = await axios.get(`${BASE_URL}/chat/roomvalidation/${room_name}`)
    if (response.data.msg === 200) {
      navigate(`/chat/${room_name}`)
    }
    else {
      toast.error('No Room Found')
    }
  }

  function logoutUser() {
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  return (
    <div className='h-screen flex flex-col place-content-center place-items-center bg-myimage'>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='absolute top-6 left-9 mt-3'>
        <button className='bg-emerald-900 px-2 py-2 rounded-3xl font-bold text-amber-200 text-xl' onClick={()=>setVisible(prev=>!prev)}><IoMdNotificationsOutline size={33}/></button>
        <NotificationModal is_visible={is_visible} setVisible={setVisible} notifications={notifications} getallnotifications={getallnotifications}/>
      </div>
      <div className='w-96 p-12 bg-emerald-600 rounded-md'>
        <h1 className='text-3xl text-white'>{data.main ? data.name : 'Please Enter Location'}</h1>
        <div className='flex gap-2'>
          <h1 className='text-6xl text-white'>{data.main ? `${data.main.temp}°C` : ''}</h1>
          {data.main && <div className='h-14'>
            <img className='h-full' src={Icon} alt="" />
          </div>}
        </div>
        <div className='mt-6 flex gap-2'>
          <input className='w-full pl-3 outline-emerald-800 opacity-60 rounded-2xl' type="text" placeholder='Locations'
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button className='bg-emerald-900 px-4 py-1 rounded-2xl text-white' onClick={searchLocation}>SEARCH</button>
        </div>
        {data.main && <div className='mt-4 py-2 w-full h-max flex rounded-md opacity-75 bg-white'>
          <div className='w-1/2 mt-2 flex flex-col place-items-center'>
            <h1 className='font-bold text-emerald-900'>Pressure</h1>
            <h1 className='font-bold text-2xl text-emerald-900'>{data.main ? data.main.pressure : ""}mb</h1>
          </div>
          <div className='w-1/2 mt-2 flex flex-col place-items-center'>
            <h1 className='font-bold text-emerald-900'>Wind</h1>
            <h1 className='font-bold text-2xl text-emerald-900'>{data.wind ? data.wind.speed : ""}mph</h1>
          </div>
        </div>}
        <h1 className='text-xl mt-2 text-white'>Community Chat</h1>
        <div className='mt-1 py-2 w-full h-12 flex rounded-md opacity-75 bg-white'>
          <div className='flex gap-2 w-1/2'>
            <input className='h-8 p-2 outline-none' onChange={e => setRoomname(e.target.value)} type="text" />
            <button className='bg-emerald-900 px-5 rounded-md text-white' onClick={() => communitychat(room_name)}>JOIN</button>
          </div>
        </div>
      </div>
      <div className='absolute bottom-7 right-10 mt-3'>
        {user_id ? <button className='bg-amber-200 px-10 py-2 rounded-3xl font-bold text-emerald-900 text-xl' onClick={logoutUser}>Logout</button> :
          <button className='bg-amber-200 px-10 py-2 rounded-3xl font-bold text-emerald-900 text-xl' onClick={logoutUser}>Login</button>}
      </div>
    </div>
  )
}

export default Home