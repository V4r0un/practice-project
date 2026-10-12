'use client'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

const ClientProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  )
}

export default ClientProvider
