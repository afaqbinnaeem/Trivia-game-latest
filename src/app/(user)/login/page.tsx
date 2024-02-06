"use client"
import React, { useState } from 'react'
// import profile from '../assets/images/user.png'
import profile from '@/assets/images/user.png'
import elipse from '@/assets/images/Ellipse 51.png'
import Image from 'next/image'
import authService from '@/appwrite/authAppwriteService'
import { useRouter } from 'next/navigation'
import Cookies  from "js-cookie";

const Login = () => {
    const [email, setEmail] = useState('')
    const router = useRouter()

    const handleLogin = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault()
       
       const response =  await authService.login(email)
       if(response){
          Cookies.set('userId', response.$id)
          Cookies.set('providerUid', response.providerUid)
        router.push('/home')
       }

    }
    

    return (
        <div>

            <div className="main-bg h95 flex items-center justify-between flex-col">
                <div className="quizBannerPink w-full">
                    

                </div>
                <div className="quizCenter">
                    <h1 className='welcomeHeading mb-0 HindBold w265'>Welcome
                        Back</h1>
                    <h4 className="ss-heading mb-0 pt-2">Let’s log in to your account</h4>
                    {/* <h4 className="ss-heading mb-0">whatever you want to be</h4> */}
                </div>
                <div className=" px37">

                    <input
                        type="email"
                        className="form-control quizInput w-full"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder='Your Email here'
                        onChange={(e)=>setEmail(e.target.value) }
                    />

                    <div className="sbButton flex justify-center mt-5">
                        <button onClick={(e)=> handleLogin(e)} className="loginButton flex items-center justify-center">
                            <span className='pe-3'>LOG IN</span> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M11.3211 17.7359C11.3211 13.032 15.1344 9.21869 19.8384 9.21869" stroke="white" strokeWidth="2.63401" />
                                <path d="M11.4833 0.70144C11.4833 5.40539 15.2966 9.21869 20.0006 9.21869" stroke="white" strokeWidth="2.63401" />
                                <path d="M0.715576 9.21869H19.0357" stroke="white" strokeWidth="2.63401" />
                            </svg>
                        </button>
                    </div>
                    <div className="quizAgreeCheckBox flex items-center justify-center  pb-14">
                        <p className='agreePolicy ps-2 mb40 mb-5'>You already have an account? <span className='signInLink HindiBold'>Sign in  </span> </p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Login
