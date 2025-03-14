import Image from "next/image"
import hero1 from "./../../../public/landing.png"
import SearchBar from "./SearchBar"

const Hero1 = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={hero1 || "/placeholder.svg"}
          alt="Hero background"
          priority
          fill
          style={{ objectFit: "cover" }}
          className="brightness-75"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Main heading with responsive text sizes */}
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-raleway max-w-4xl">
          Plan Events. Buy Tickets. <span className="text-[#03DAC6]">All in One Place.</span>
        </h1>

        {/* Subheading with responsive text sizes */}
        <h2 className="text-[#B0B0B0] text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl mt-4 font-normal max-w-3xl">
          Simplify your event journey, from planning to participation.
        </h2>

        {/* Search bar with proper spacing */}
        <div className=" mt-8 md:mt-12">
          <SearchBar />
        </div>
      </div>
    </div>
  )
}

export default Hero1

