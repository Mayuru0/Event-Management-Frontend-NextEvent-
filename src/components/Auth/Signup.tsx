/*eslint-disable */
"use client"
import { useEffect, useState } from "react"
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MdKeyboardArrowLeft } from "react-icons/md"
import profilePic from "./../../../public/profile/profiePic.png"
import Swal from "sweetalert2"
import { useRegisterMutation } from "@/Redux/features/authApiSlice"
import { CiCamera } from "react-icons/ci"
export default function SignUp() {
  const router = useRouter()
  //const searchParams = useSearchParams();
  //const roleFromQuery = searchParams.get("role");
  const [isClient, setIsClient] = useState(false)

  const [formData, setFormData] = useState({
    role: "",
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

  // Set filters only after the component is mounted on the client-side
  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search)
      const roleFromQuery = searchParams.get("role")
      if (roleFromQuery) {
        setFormData((prev) => ({
          ...prev,
          role: roleFromQuery,
        }))
      }
    }
  }, [isClient])

  const inputFields = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "nic", type: "text", placeholder: "NIC" },
    { name: "contactNumber", type: "text", placeholder: "Contact No" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file)) // Set image preview URL
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.nic) newErrors.nic = "NIC is required"
    if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.gender) newErrors.gender = "Gender is required"

    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid"
    }

    // Image upload validation
    if (!profileImage) {
      newErrors.profileImage = "Profile image is required"
    } else if (!/^image\//.test(profileImage.type)) {
      newErrors.profileImage = "Please upload a valid image file"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // If there are no errors, return true
  }

  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return // Stop the form submission if validation fails
    }

    // Create FormData
    const form = new FormData()
    form.append("name", formData.name)
    form.append("email", formData.email)
    form.append("nic", formData.nic)
    form.append("contactNumber", formData.contactNumber)
    form.append("gender", formData.gender)
    form.append("role", formData.role)
    form.append("password", formData.password)

    // Append profile image if selected
    if (profileImage) {
      form.append("profilePic", profileImage)
    }

    try {
      const response = await register(form as any).unwrap() // Send FormData
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "Your account has been successfully created.",
        })
        router.push("/auth/signin")
      }
    } catch (err) {
      console.error("Registration error:", err)
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-2 sm:p-4 md:p-6">
        <button
        onClick={() => router.push("/")}
        className="flex items-center text-white text-lg font-medium space-x-2 hover:opacity-80 transition mt-20 sm:px-8"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <div className="rounded-lg bg-[#1F1F1F] border border-zinc-800 p-6 sm:p-8 md:p-12 mt-4 sm:mt-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-raleway">Create Your Account</h1>
            <p className="text-sm sm:text-base font-kulim font-normal text-[#B0B0B0]">
              Join us today! Whether you&apos;re a Customer or an Organizer, we&apos;ve got you covered.
            </p>
          </div>

          <div className="flex justify-center mb-8 relative">
            <label
              htmlFor="profileImage"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-800 cursor-pointer flex items-center justify-center"
            >
              {previewImage ? (
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image src={profilePic || "/placeholder.svg"} alt="Profile picture" fill className="object-cover" />
                  <CiCamera className="absolute inset-0 m-auto text-white text-4xl" />
                </div>
              )}
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            {errors.profileImage && (
              <p className="absolute mt-20 sm:mt-24 text-red-500 text-xs sm:text-sm">{errors.profileImage}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Role Selection */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm sm:text-base"
            >
              <option value="customer">I&apos;m a Customer</option>
              <option value="organizer">I&apos;m an Organizer</option>
            </select>

            {/* Mapped Input Fields */}
            {inputFields.map((field) => (
              <div key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm sm:text-base"
                  required
                />
                {errors[field.name] && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]}</p>}
              </div>
            ))}

            {/* Gender Selection */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm sm:text-base"
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gender}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6200EE] hover:bg-violet-700 text-white py-2 px-4 rounded-md transition-colors duration-200 mt-4 text-sm sm:text-base"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>

            {/* Login Link */}
            <div className="text-center text-xs sm:text-sm mt-4">
              <span className="text-gray-400">Do you have an account&#63; </span>
              <Link href="/auth/signin" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

