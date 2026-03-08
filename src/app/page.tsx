import About from "@/components/About/About"
import Contact from "@/components/Contact/Contact"
import Event from "@/components/Event/Event"
import PeopleWhatSay from "@/components/Event/people_what_say"
import Home from "@/components/Home/Home"

const Page = () => {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <section id="home" className="w-full">
        <Home />
      </section>

      <section id="about" className="w-full">
        <About />
      </section>

      <section id="event" className="w-full">
        <Event />
        <PeopleWhatSay />
      </section>

      <section id="contact" className="w-full">
        <Contact />
      </section>
    </main>
  )
}

export default Page
