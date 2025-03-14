import Image from 'next/image'
import React from 'react'
import hero1 from './../../../public/landing.png'
import SearchBar from './SearchBar'

const Hero1 = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex mt-[20%] justify-center ">
        <h1 className='text-white text-xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-raleway'>Plan Events. Buy Tickets. <span className='text-[#03DAC6]'>All in One Place.</span> </h1>
        <h2 className=' absolute justify-center text-[#B0B0B0] text-xs md:text-xl lg:text-3xl xl:text-4xl mt-[4%] font-normal'>Simplify your event journey, from planning to participation.</h2>
          <div className='absolute justify-center mt-[8.5%]'>
        <SearchBar />
        </div>
      </div>
      <Image 
        src={hero1} 
        alt="hero1" 
        priority
        width={1920}
        height={1080}

      />
    </div>
  )
}

export default Hero1