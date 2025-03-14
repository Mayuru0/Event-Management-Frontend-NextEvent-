"use client";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLoginMutation } from "@/Redux/features/authApiSlice";
import { setCredentials, selectuser } from "@/Redux/features/authSlice";
import Swal from "sweetalert2";
import type { User } from "@/type/user";

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "", rememberMe: "" });

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const user = useSelector(selectuser);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", rememberMe: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    // Add validation for the "Remember me" checkbox (Optional)
    if (!rememberMe) {
      newErrors.rememberMe = "Please check the 'Remember me' option"; // Optional, only if you need this validation
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login(formData).unwrap();
      if ("user" in response && "token" in response) {
        dispatch(setCredentials({
          user: response.user as User,
          token: response.token as string,
        }));
      } else if (response.data?.user && response.data?.token) {
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token,
        }));
      } else {
        throw new Error("Invalid response format from server");
      }
      Swal.fire({ icon: "success", title: "Success", text: "Login successful" });
    } catch (err) {
      console.error("Login error details:", err);
      Swal.fire({ icon: "error", title: "Login Failed", text: "Something went wrong during login" });
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-white text-lg font-medium space-x-2 hover:opacity-80 transition mt-20 px-16"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back to Home</span>
      </button>
      <div className="mx-auto max-w-lg">
        <div className="rounded-lg bg-[#1F1F1F] border border-zinc-800 p-12 mt-20">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 font-raleway">Welcome Back!</h1>
            <p className="text-base font-kulim font-normal text-[#B0B0B0]">
              Sign in to access your account and continue your journey with us.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
              </div>
              {errors.rememberMe && <p className="text-red-500 text-sm">{errors.rememberMe}</p>}
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6200EE] hover:bg-violet-700 text-white py-2 px-4 rounded-md"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
            <div className="text-center text-sm">
              <span className="text-gray-400">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
