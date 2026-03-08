"use client"
import { useDispatch, useSelector } from "react-redux"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useLoginMutation } from "@/Redux/features/authApiSlice"
import { setCredentials, selectuser } from "@/Redux/features/authSlice"
import Swal from "sweetalert2"
import type { User, LoginResponse } from "@/type/user"
import DustParticles from "@/components/common/DustParticles"

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
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

    if (!rememberMe) {
      newErrors.rememberMe = "Please check the 'Remember me' option"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response: LoginResponse = await login(formData).unwrap()
      if (response.user?.status === "verified" && response.token) {
        dispatch(
          setCredentials({
            user: response.user as User,
            token: response.token as string,
            refreshToken: response.refreshToken,
          })
        )
      } else if (response.data?.user && response.data?.token) {
        dispatch(setCredentials({ user: response.data.user, token: response.data.token }))
      } else {
        throw new Error("Invalid response format from server")
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful",
        background: "#1A1A28",
        color: "#fff",
        confirmButtonColor: "#6200EE",
      })
    } catch {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Your account is not verified yet.",
        background: "#1A1A28",
        color: "#fff",
        confirmButtonColor: "#6200EE",
      })
    }
  }

  useEffect(() => {
    if (user) router.push("/")
  }, [user, router])

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] flex flex-col overflow-hidden">
      <DustParticles count={65} />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-[#6200EE]/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-[#03DAC6]/7 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Back button */}
        <div className="p-6 pt-24 sm:pt-20">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                Next
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
                  Event
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">Welcome back! Sign in to continue.</p>
            </div>

            <div className="bg-[#111118] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
              <p className="text-gray-500 text-sm mb-6">Access your account and continue your journey.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A28] border border-white/8 rounded-lg text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#6200EE]/50 focus:ring-1 focus:ring-[#6200EE]/25 transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#1A1A28] border border-white/8 rounded-lg text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#6200EE]/50 focus:ring-1 focus:ring-[#6200EE]/25 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Remember me & forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-violet-600 rounded"
                    />
                    <span className="text-xs text-gray-400">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[#6200EE] hover:text-[#03DAC6] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                {errors.rememberMe && <p className="text-red-400 text-xs">{errors.rememberMe}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="text-[#6200EE] hover:text-[#03DAC6] transition-colors font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
