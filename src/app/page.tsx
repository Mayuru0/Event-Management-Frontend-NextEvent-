import About from '@/components/About/About'
import Contact from '@/components/Contact/Contact'
import Event from '@/components/Event/Event'

import Home from '@/components/Home/Home'
import React from 'react'

const page = () => {
  return (
    <div className=''>
      <div className='' id='home' title='home'>
        <Home/>
        </div>
        <div style={{ backgroundColor: '#121212' }} id='about' title='about'>
          <About/>
        </div>
        <div className='bg-[#121212]' id='event' title='event'>
          <Event/>
        </div>
        <div  id='contact' title='contact'>
            <Contact/>
        </div>
        
    </div>
  )
}

export default page