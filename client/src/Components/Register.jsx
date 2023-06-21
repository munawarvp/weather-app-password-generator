import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { BASE_URL } from '../config';
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().min(6).required('Username is required..!'),
    email: Yup.string().email('Invalid email').required('Email is required..!'),
    phone_number: Yup.string().min(10).required('Phone is required..!'),
    password: Yup.string().required('Password is required').min(8).matches(/^(?=.*[a-zA-Z])/, 'Characters needed in password')
                                                           .matches(/^(?=.*[0-9])/, 'Numbers needed in password')
                                                           .matches(/^(?=.*[!@#$%^&*])/, 'Special Characters needed in password'),
    confirm_pass: Yup.string().required('Confirm your password..!').oneOf([Yup.ref('password'),], 'password must match..!')
})

function Register() {

    const [suggested_password, setPassword] = useState('')
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(()=>{

    },[suggested_password])

    async function onSubmit(data) {
        console.log(data);
        
        const response = await axios.post(`${BASE_URL}/account/register/`, data)
        console.log(response);
        if(response.status===201){
            navigate('/login')
        }else{
            console.log('something went worng');
        }
    }

    async function generatePassword() {
        const response = await axios.get(`${BASE_URL}/account/generate-pass/`)
        console.log(response.data);
        setPassword(response.data.pass)
    }

  return (
    <div className='h-screen flex place-content-center place-items-center bg-registerbackground'>
        <div className='w-1/2 h-max py-5 bg-fuchsia-800 rounded-2xl flex flex-col place-content-center place-items-center '>
            <div className='w-full mb-5 mt-3 flex place-content-center'>
                <h1 className='text-white text-4xl font-bold'>Sign Up</h1>
            </div>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className={`h-9 w-1/2 p-2 rounded-sm ${errors.username && 'outline-8 outline-red-500'} ` } name='username' type="text" placeholder='username'
                        {...register('username')}
                    />
                    <div className='w-1/2'>
                        {errors.username && <div className='text-red-200 text-start'>{errors.username.message}</div>}
                        
                    </div>
                    
                </div>
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-9 w-1/2 p-2 rounded-sm' name='email' type="text" placeholder='email'
                        {...register('email')}
                    />
                    <div className='w-1/2'>
                        {errors.email && <div className='text-red-200 text-start'>{errors.email.message}</div>}
                        
                    </div>
                </div>
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-9 w-1/2 p-2 rounded-sm' name='phone_number' type="text" placeholder='phone'
                        {...register('phone_number')}
                    />
                    <div className='w-1/2'>
                        {errors.phone_number && <div className='text-red-200 text-start'>{errors.phone_number.message}</div>}
                        
                    </div>
                </div>
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-9 w-1/2 p-2 rounded-sm' name='password' type="text" placeholder='password'
                        defaultValue={suggested_password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        {...register('password')}
                    />
                    <div className='w-1/2 flex place-content-between'>
                        {errors.password && <div className='text-red-200 text-start'>{errors.password.message}</div>}
                        {errors.password && <div className='text-white cursor-pointer' onClick={generatePassword}>Generate Password</div>}
                        
                    </div>
                </div>
                <div className='mb-4 flex flex-col place-items-center'>
                    <input className='h-9 w-1/2 p-2 rounded-sm' name='confirm_pass' type="text" placeholder='confirm password'
                        {...register('confirm_pass')}
                    />
                    <div className='w-1/2'>
                        {errors.confirm_pass && <div className='text-red-200 text-start'>{errors.confirm_pass.message}</div>}
                    </div>
                </div>
                <div className='w-full mb-4 flex place-content-center'>
                    <button type='submit' className='h-10 w-1/2 bg-fuchsia-400 text-white rounded-md'>Sign Up</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register