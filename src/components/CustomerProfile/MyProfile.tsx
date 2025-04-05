/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pencil, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useUpdateUserMutation } from "@/Redux/features/authApiSlice";
import Swal from "sweetalert2";

interface User {
  _id: string;
  name: string;
  nic: string;
  contactNumber: string;
  email: string;
  gender: string;
  address: string;
  PostalCode: string;
  profilePic?: string;
  isVerified?: boolean;
}

export default function ProfilePage() {
  const user = useSelector(selectuser) as User;
  const [profile, setProfile] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [update] = useUpdateUserMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setProfile(user);
  }, [user]);

  if (!isMounted || !profile) return <div>Loading...</div>;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (isEditing) {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });

      const imageFile = fileInputRef.current?.files?.[0];
      if (imageFile) {
        formData.append("profilePic", imageFile);
      }

      try {
        await update({ UserId: user._id, formData }).unwrap();
        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Update Failed!",
          text: "There was an error updating your profile.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  return (
    <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl md:mt-28 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-[#B0B0B0] font-semibold text-lg">
              View and update your personal details.
            </p>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-[#6200EE] hover:bg-[#6200EE]/90 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            {isEditing ? "Save" : "Update"}
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center md:justify-start mb-6 md:mb-8">
  <div
    className="relative w-20 h-20 md:w-24 md:h-24 group cursor-pointer"
    onClick={handleImageClick}
  >
    <Image
      src={
        user?.profilePic && user?.profilePic.startsWith("http")
          ? user.profilePic
          : "/default-profile.png"
      }
      alt={user?.name || "Image"}
      className="rounded-full"
      width={96}
      height={96}
      style={{ objectFit: "cover" }}
      priority
    />
    {isEditing && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="w-8 h-8 text-white" />
      </div>
    )}
  </div>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageChange}
    accept="image/*"
    className="hidden"
  />
</div>


        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#888888] mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "nic", "contactNumber", "email"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-white text-lg block">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  type="text"
                  value={String(profile[field as keyof User] || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-[#2C2C2C] border border-[#FFFFFF] rounded px-4 py-2 text-[#B0B0B0] focus:ring-2 focus:ring-[#6200EE] disabled:opacity-50"
                />
              </div>
            ))}
            {/* Gender Dropdown */}
            <div className="space-y-2">
              <label className="text-white text-lg block">Gender</label>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-[#2C2C2C] border border-[#FFFFFF] rounded px-4 py-2 text-[#B0B0B0] focus:ring-2 focus:ring-[#6200EE] disabled:opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address & Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["address", "PostalCode"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-white text-lg block">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  type="text"
                  value={String(profile[field as keyof User] || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-[#2C2C2C] border border-[#FFFFFF] rounded px-4 py-2 text-[#B0B0B0] focus:ring-2 focus:ring-[#6200EE] disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
