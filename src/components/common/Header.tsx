"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { selectuser, logout, selectRefreshToken } from "@/Redux/features/authSlice"
import { useLogoutUserMutation } from "@/Redux/features/authApiSlice"

interface NavLink {
  href: string
  label: string
}

const navigationLinks: NavLink[] = [
  { href: "home", label: "Home" },
  { href: "about", label: "About" },
  { href: "event", label: "Events" },
  { href: "contact", label: "Contact" },
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const router = useRouter()
  const user = useSelector(selectuser)
  const refreshToken = useSelector(selectRefreshToken)
  const dispatch = useDispatch()
  const [logoutUser] = useLogoutUserMutation()

  // Track scroll position for progress bar + background change
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

    setScrolled(scrollTop > 40)
    setScrollProgress(progress)

    // Active section detection
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      const el = section as HTMLElement
      const top = el.offsetTop - 80
      const bottom = top + el.clientHeight
      if (scrollTop >= top && scrollTop < bottom) {
        setActiveSection(el.id)
      }
    })
  }, [])

  useEffect(() => {
    setIsMounted(true)
    setIsClient(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    setActiveSection(href)
    const element = document.getElementById(href)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top: offsetTop, behavior: "smooth" })
    } else {
      router.push("/")
    }
  }

  const handleAuthClick = (type: "signin" | "signup") => {
    router.push(`/auth/${type}`)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await logoutUser({ refreshToken }).unwrap()
      } catch {
        // proceed even if server call fails
      }
    }
    dispatch(logout())
    router.push("/")
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    const profileRoute =
      user?.role === "customer"
        ? "/profile/customer/my-profile"
        : "/profile/organizer/my-profile"
    router.push(profileRoute)
    setIsOpen(false)
  }

  if (!isClient || !isMounted) return null

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[#6200EE] via-[#03DAC6] to-[#6200EE]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/8 shadow-lg shadow-black/30"
            : "bg-transparent backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <div className="mx-auto w-full">
          <div className="flex h-16 px-4 lg:px-24 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="text-xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity"
            >
              Next
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
                Event
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-1 justify-center">
              <nav className="flex items-center gap-1">
                {navigationLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                  >
                    <span
                      className={
                        activeSection === link.href
                          ? "text-white"
                          : "text-white/55 hover:text-white"
                      }
                    >
                      {link.label}
                    </span>

                    {/* Active indicator */}
                    <motion.span
                      layoutId="nav-indicator"
                      className=" absolute bottom-1 left-4 -translate-x-1 h-[2px] rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC6]"
                      initial={false}
                      animate={{
                        width: activeSection === link.href ? "60%" : "0%",
                        opacity: activeSection === link.href ? 1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />

                    {/* Hover bg */}
                    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white/80 text-sm font-medium">{user.name}</span>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#6200EE]/40">
                      <Image
                        src={user?.profilePic || "/default-profile.png"}
                        fill
                        alt={user?.name || "Profile"}
                        className="object-cover"
                      />
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-white/50 hover:text-red-400 transition-colors px-2 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAuthClick("signin")}
                    className="px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] rounded-lg transition-all duration-300 shadow-md shadow-purple-900/30"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white/80 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden lg:hidden border-t border-white/8 bg-[#0A0A0F]/98 backdrop-blur-lg"
              >
                <nav className="flex flex-col px-4 py-4 gap-1">
                  {/* Profile (mobile) */}
                  {user && (
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors mb-2"
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#6200EE]/40 flex-shrink-0">
                        <Image
                          src={user?.profilePic || "/placeholder.svg"}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                      </div>
                    </button>
                  )}

                  {/* Nav links */}
                  {navigationLinks.map((link, i) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleNavClick(link.href)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                        activeSection === link.href
                          ? "bg-[#6200EE]/15 text-white border border-[#6200EE]/25"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {activeSection === link.href && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC6] flex-shrink-0" />
                      )}
                      {link.label}
                    </motion.button>
                  ))}

                  {/* Auth (mobile) */}
                  <div className="mt-3 pt-3 border-t border-white/8 flex flex-col gap-2">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/15 transition-all"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAuthClick("signin")}
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                        >
                          Sign in
                        </button>
                        <button
                          onClick={() => handleAuthClick("signup")}
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] transition-all shadow-md shadow-purple-900/30"
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}

export default Header
