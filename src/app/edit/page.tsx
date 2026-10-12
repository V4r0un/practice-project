'use client'
import { userDataContext } from '@/context/UserContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CgProfile } from "react-icons/cg";

const page = () => {
    const data = useContext(userDataContext)
    const [name, setName] = useState("")
    const [frontendImage, setFrontendImage] = useState("")
    const [backendImage, setBackendImage] = useState<File>()
    const imageInput = useRef<HTMLInputElement>(null)

    const handleImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return
        const file = files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("name", name)
            if (backendImage) {
                formData.append('file', backendImage)
            }
            const result = await axios.post('/api/edit', formData)
            data?.setUser(result.data)
        } catch (error) {
            console.log(error)            
        }
    }

    useEffect(() => {
        if (data) {
            setName(data.user?.name as string)
            setFrontendImage(data.user?.image as string)
        }
    }, [data])
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className='w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg'>
            <h1 className='text-2xl font-semibold text-center mb-2'>Edit Profile</h1>
            <form action="" className='space-y-2 flex flex-col w-full items-center' onSubmit={handleSubmit}>
                <div className='w-25 h-25 rounded-full border-white transition-all hover:border-blue-500 text-white hover:text-blue-500 cursor-pointer overflow-hidden relative' onClick={()=>imageInput.current?.click()}>
                    <input type="file" accept='image/*' hidden ref={imageInput} onChange={handleImage}/>
                    {frontendImage ? <Image src={frontendImage} fill alt='image'/> : <CgProfile size={22} color='white'/>}
                </div>
                <div className='w-full'>
                    <label className='block mb-1 font-medium'>Name</label>
                    <input 
                    type="text" 
                    placeholder="Enter name"
                    className='w-full border-b border-white py-2 px-1 bg-black text-white outline-none placeholder-gray-400'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    />
                </div>
                <button className='w-full px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors'>Save</button>
            </form>
        </div>
    </div>
  )
}

export default page
