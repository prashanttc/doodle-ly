import Header from '@/components/Header'
import MobileHeader from '@/components/MobileHeader'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='flex flex-col bg-black '>
      <Header/>
      <MobileHeader/>
      <div className='w-full min-h-screen'>
        {children}
      </div>
    </main>
  )
}

export default layout
