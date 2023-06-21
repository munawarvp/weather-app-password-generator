import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { BASE_URL } from '../config';
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required..!'),
    password: Yup.string().required('Password is required')
})

function Register() {


    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(()=>{

    },[])

    async function onSubmit(data) {
        console.log(data);
        try{
          const response = await axios.post(`${BASE_URL}/account/login-user/`, data)
          console.log(response);
          if(response.status===200){
              localStorage.setItem('user_id', response.data.user)
              navigate('/')
          }else if(response.status===400){
              console.log('something went worng');
          }
        }
        catch(error){
          console.log(error);
        }
          
        
    }


  return (
    <div className='h-screen flex place-content-center place-items-center bg-loginbackground'>
        <div className='w-1/2 h-max py-8 bg-white rounded-2xl flex flex-col place-content-center place-items-center '>
            <div className='w-full mb-5 mt-3 flex place-content-center'>
                <h1 className='text-blue-950 text-4xl font-bold'>Log In</h1>
            </div>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-10 w-1/2 p-2 rounded-sm border-2 border-blue-900 outline-blue-900' name='email' type="text" placeholder='email'
                        {...register('email')}
                    />
                    <div className='w-1/2'>
                        {errors.email && <div className='text-red-600 text-start'>{errors.email.message}</div>}
                        
                    </div>
                </div>
                
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-10 w-1/2 p-2 rounded-sm border-2 border-blue-900 outline-blue-900' name='password' type="text" placeholder='password'
                        {...register('password')}
                    />
                    <div className='w-1/2 flex place-content-between'>
                        {errors.password && <div className='text-red-600 text-start'>{errors.password.message}</div>}
                        
                    </div>
                </div>
                
                <div className='mt-10 w-full mb-4 flex place-content-center'>
                    <button type='submit' className='h-10 w-1/2 bg-sky-900 text-white rounded-md'>Log In</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register