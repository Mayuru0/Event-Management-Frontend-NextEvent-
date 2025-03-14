"use client"
import { useDispatch, useSelector } from "react-redux"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdKeyboardArrowLeft } from "react-icons/md"
import { useLoginMutation } from "@/Redux/features/authApiSlice"
import { setCredentials, selectuser } from "@/Redux/features/authSlice"
import Swal from "sweetalert2"
import type { User } from "@/type/user"

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({ email: "", password: "", rememberMe: "" })

  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const user = useSelector(selectuser)

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "", rememberMe: "" }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
      isValid = false
    }

    // Add validation for the "Remember me" checkbox (Optional)
    if (!rememberMe) {
      newErrors.rememberMe = "Please check the 'Remember me' option" // Optional, only if you need this validation
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await login(formData).unwrap()
      if ("user" in response && "token" in response) {
        dispatch(
          setCredentials({
            user: response.user as User,
            token: response.token as string,
          }),
        )
      } else if (response.data?.user && response.data?.token) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token,
          }),
        )
      } else {
        throw new Error("Invalid response format from server")
      }
      Swal.fire({ icon: "success", title: "Success", text: "Login successful" })
    } catch (err) {
      console.error("Login error details:", err)
      Swal.fire({ icon: "error", title: "Login Failed", text: "Something went wrong during login" })
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-[#121212] p-3 sm:p-4 md:p-6">
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-white text-base sm:text-lg font-medium space-x-2 hover:opacity-80 transition mt-20 sm:mt-12 md:mt-20 px-4 sm:px-8 md:px-16"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <div className="rounded-lg bg-[#1F1F1F] border border-zinc-800 p-6 sm:p-8 md:p-12 mt-6 sm:mt-10 md:mt-20">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-raleway">Welcome Back!</h1>
            <p className="text-sm sm:text-base font-kulim font-normal text-[#B0B0B0]">
              Sign in to access your account and continue your journey with us.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                required
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                required
              />
              {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-violet-600"
                />
                <label htmlFor="remember" className="text-xs sm:text-sm text-gray-400">
                  Remember me
                </label>
                {errors.rememberMe && <p className="text-red-500 text-xs sm:text-sm ml-2">{errors.rememberMe}</p>}
              </div>

              <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6200EE] hover:bg-violet-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm sm:text-base mt-4"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-xs sm:text-sm mt-4">
              <span className="text-gray-400">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

