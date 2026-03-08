/*eslint-disable */
"use client"
import { useEffect, useState } from "react"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Hash, Phone, Mail, Lock, Eye, EyeOff, Camera } from "lucide-react"
import profilePic from "./../../../public/profile/profiePic.png"
import Swal from "sweetalert2"
import { useRegisterMutation } from "@/Redux/features/authApiSlice"
import DustParticles from "@/components/common/DustParticles"

const inputFields = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "nic", type: "text", placeholder: "NIC Number", icon: Hash },
  { name: "contactNumber", type: "text", placeholder: "Contact Number", icon: Phone },
  { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
]

export default function SignUp() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    nic: "",
    contactNumber: "",
    email: "",
    gender: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search)
      const roleFromQuery = searchParams.get("role")
      if (roleFromQuery) setFormData((prev) => ({ ...prev, role: roleFromQuery }))
    }
  }, [isClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.nic) newErrors.nic = "NIC is required"
    if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is not valid"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!profileImage) newErrors.profileImage = "Profile image is required"
    else if (!/^image\//.test(profileImage.type)) newErrors.profileImage = "Please upload a valid image file"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    const form = new FormData()
    form.append("name", formData.name)
    form.append("email", formData.email)
    form.append("nic", formData.nic)
    form.append("contactNumber", formData.contactNumber)
    form.append("gender", formData.gender)
    form.append("role", formData.role)
    form.append("password", formData.password)
    if (profileImage) form.append("profilePic", profileImage)

    try {
      const response = await register(form as any).unwrap()
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "Your account has been successfully created.",
          background: "#1A1A28",
          color: "#fff",
          confirmButtonColor: "#6200EE",
        })
        router.push("/auth/signin")
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
        background: "#1A1A28",
        color: "#fff",
        confirmButtonColor: "#6200EE",
      })
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] overflow-hidden">
      <DustParticles count={65} />

      {/* Decorative orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-[#6200EE]/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#03DAC6]/7 blur-3xl pointer-events-none" />

      <div className="relative z-10">
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

        <div className="flex justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                Next
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
                  Event
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">Create your account and start your journey.</p>
            </div>

            <div className="bg-[#111118] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
              <p className="text-gray-500 text-sm mb-6">Join us today as a Customer or Organizer.</p>

              {/* Profile image */}
              <div className="flex justify-center mb-7">
                <div className="relative">
                  <label
                    htmlFor="profileImage"
                    className="relative w-20 h-20 rounded-full overflow-hidden bg-[#1A1A28] border-2 border-[#6200EE]/35 cursor-pointer flex items-center justify-center hover:border-[#6200EE]/60 transition-colors"
                  >
                    {previewImage ? (
                      <Image src={previewImage} alt="Preview" width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image src={profilePic} alt="Profile" fill className="object-cover opacity-35" />
                        <Camera className="absolute inset-0 m-auto w-6 h-6 text-[#03DAC6]" />
                      </div>
                    )}
                    <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                  {errors.profileImage && (
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-red-400 text-xs">
                      {errors.profileImage}
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Account Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1A1A28] border border-white/8 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#6200EE]/50 focus:ring-1 focus:ring-[#6200EE]/25 transition-colors"
                  >
                    <option value="customer">I&apos;m a Customer</option>
                    <option value="organizer">I&apos;m an Organizer</option>
                  </select>
                </div>

                {/* Dynamic input fields */}
                {inputFields.map(({ name, type, placeholder, icon: Icon }) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{placeholder}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A28] border border-white/8 rounded-lg text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#6200EE]/50 focus:ring-1 focus:ring-[#6200EE]/25 transition-colors"
                      />
                    </div>
                    {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
                  </div>
                ))}

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1A1A28] border border-white/8 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#6200EE]/50 focus:ring-1 focus:ring-[#6200EE]/25 transition-colors"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-[#6200EE] hover:text-[#03DAC6] transition-colors font-medium">
                    Sign in
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
