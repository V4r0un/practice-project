"use client";
import { userDataContext } from "@/context/UserContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { HiPencil } from "react-icons/hi2";

const page = () => {
  const [loading, setLoading] = useState(false)
  const data = useContext(userDataContext)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      {data && <div className="w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg text-center relative flex flex-col items-center">
        <HiPencil size={22} color="white" className="absolute right-5 top-5 cursor-pointer" onClick={()=>router.push('/edit')}/>
        {data.user?.image && <div className="relative w-50 h-50 rounded-full border-2 border-white overflow-hidden">
          <Image src={data.user.image} fill alt="userImage"/>
          </div>}
          <h1 className="text-2xl font-semibold my-4">Welcome, {data.user?.name}</h1>
          <button className="w-full px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors" onClick={handleSignOut}>Sign Out</button>
        </div>}
      {!data && <div className="text-white text-2xl">Loading...</div>}
    </div>
  );
};

export default page;
