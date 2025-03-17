import About from "@/components/About/About"
import Contact from "@/components/Contact/Contact"
import Event from "@/components/Event/Event"
import PeopleWhatSay from "@/components/Event/people_what_say"
import Home from "@/components/Home/Home"

const Page = () => {
  return (
    <main className="min-h-screen">
      <section id="home" className="w-full">
        <Home />
      </section>

      <section id="about" className="w-full bg-[#121212]">
        <About />
      </section>

      <section id="event" className="w-full bg-[#121212]">
        <Event />
      </section>

      <section id="" className="w-full bg-[#121212]">
        <PeopleWhatSay />
      </section>

      <section id="contact" className="w-full">
        <Contact />
      </section>
    </main>
  )
}

export default Page

