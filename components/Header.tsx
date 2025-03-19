import { signOut } from '@/utils/login'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className='bg-black hidden md:flex fixed w-full px-10  items-center text-white h-16 border-b-2 border-white/60 justify-between drop-shadow-xl z-50'>
      <h1 className=' font-bold text-xl'>doodl-ly</h1>
      <ul className='flex gap-5 cursor-pointer'>
        <li className='hover:underline'><Link href='/about'>about</Link></li>
      </ul>
      <h1 className='cursor-pointer' onClick={signOut}>logout</h1>
    </header>
  )
}

export default Header
