/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pencil, Camera, Save, Mail, Phone, MapPin, User, Hash, Home } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectuser, setCredentials, selectRefreshToken } from "@/Redux/features/authSlice";
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

const fieldConfig = [
  { key: "name", label: "Full Name", icon: User, type: "text" },
  { key: "nic", label: "NIC Number", icon: Hash, type: "text" },
  { key: "contactNumber", label: "Contact Number", icon: Phone, type: "text" },
  { key: "email", label: "Email Address", icon: Mail, type: "text" },
];

const addressFields = [
  { key: "address", label: "Street Address", icon: Home, type: "text" },
  { key: "PostalCode", label: "Postal Code", icon: MapPin, type: "text" },
];

export default function ProfilePage() {
  const user = useSelector(selectuser) as User;
  const refreshToken = useSelector(selectRefreshToken);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [update] = useUpdateUserMutation();
  const [isMounted, setIsMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setProfile(user);
  }, [user]);

  if (!isMounted || !profile) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden animate-pulse">
        <div className="h-44 bg-[#242424]" />
        <div className="px-8 pt-4 pb-8">
          <div className="h-7 bg-white/5 rounded-lg w-44 mb-2" />
          <div className="h-4 bg-white/5 rounded w-60 mb-8" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfile((prev) => ({ ...prev, profilePic: result }));
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
        const response = await update({ UserId: user._id, formData }).unwrap();

        if (response.success && response.data) {
          const { token: newToken, ...updatedUser } = response.data;
          dispatch(
            setCredentials({
              user: updatedUser as any,
              token: newToken,
              ...(refreshToken ? { refreshToken } : {}),
            })
          );
        }

        setPreviewImage(null);
        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          background: "#1A1A1A",
          color: "#fff",
          confirmButtonColor: "#6200EE",
        });
      } catch (error) {
        Swal.fire({
          title: "Update Failed!",
          text: "There was an error updating your profile.",
          icon: "error",
          confirmButtonText: "Try Again",
          background: "#1A1A1A",
          color: "#fff",
          confirmButtonColor: "#6200EE",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setProfile(user);
    setPreviewImage(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const displayImage = previewImage || (user?.profilePic && user.profilePic.startsWith("http") ? user.profilePic : "/default-profile.png");

  return (
    <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28">
      {/* Hero Banner */}
      <div className="relative h-44 rounded-t-3xl md:rounded-tr-3xl overflow-hidden bg-gradient-to-br from-[#00897B] via-[#00695C] to-[#1C1C2E]">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#03DAC6]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-6 right-36 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 left-16 w-44 h-44 rounded-full bg-[#03DAC6]/10 blur-3xl pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleUpdate}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all shadow-lg ${
              isEditing
                ? "bg-[#03DAC6] hover:bg-[#03DAC6]/90 text-black shadow-[#03DAC6]/25"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
            }`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Avatar Row — overlaps the hero banner */}
      <div className="flex items-end gap-5 -mt-14 px-6 md:px-8 relative z-10">
        <div
          className={`relative group shrink-0 ${isEditing ? "cursor-pointer" : ""}`}
          onClick={handleImageClick}
        >
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[#1A1A1A]">
            <Image
              src={displayImage}
              alt={user?.name || "Profile"}
              width={112}
              height={112}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          {/* Online indicator */}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#1A1A1A] shadow-lg" />
          {isEditing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white mb-0.5" />
              <span className="text-[10px] text-white/80 font-medium">Change</span>
            </div>
          )}
        </div>

        {isEditing && (
          <p className="hidden sm:block text-xs text-[#03DAC6]/70 mb-4">Click photo to change</p>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

      {/* Profile Identity */}
      <div className="px-6 md:px-8 pt-4 pb-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{profile.name || "Your Name"}</h1>
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                {profile.email || "—"}
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-xs font-bold text-[#03DAC6] bg-[#03DAC6]/10 px-2.5 py-0.5 rounded-full border border-[#03DAC6]/20 tracking-wide">
                CUSTOMER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="mx-6 md:mx-8 h-px bg-gradient-to-r from-[#03DAC6]/40 via-[#03DAC6]/10 to-transparent" />

      {/* Form Sections */}
      <div className="p-6 md:p-8 space-y-10">
        {/* Personal Information */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-0.5 h-5 rounded-full bg-gradient-to-b from-[#03DAC6] to-[#6200EE]" />
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fieldConfig.map(({ key, label, icon: Icon, type }) => (
              <div key={key}>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </label>
                <input
                  name={key}
                  type={type}
                  value={String(profile[key as keyof User] || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 ${
                    isEditing
                      ? "bg-[#1F1F1F] border border-[#03DAC6]/30 text-white placeholder-gray-600 focus:border-[#03DAC6] focus:ring-2 focus:ring-[#03DAC6]/15"
                      : "bg-[#222222] border border-white/5 text-gray-300 cursor-default"
                  }`}
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none ${
                  isEditing
                    ? "bg-[#1F1F1F] border border-[#03DAC6]/30 text-white focus:border-[#03DAC6] focus:ring-2 focus:ring-[#03DAC6]/15"
                    : "bg-[#222222] border border-white/5 text-gray-300 cursor-default"
                }`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-0.5 h-5 rounded-full bg-gradient-to-b from-[#6200EE] to-[#03DAC6]" />
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Location</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {addressFields.map(({ key, label, icon: Icon, type }) => (
              <div key={key}>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </label>
                <input
                  name={key}
                  type={type}
                  value={String(profile[key as keyof User] || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 ${
                    isEditing
                      ? "bg-[#1F1F1F] border border-[#03DAC6]/30 text-white placeholder-gray-600 focus:border-[#03DAC6] focus:ring-2 focus:ring-[#03DAC6]/15"
                      : "bg-[#222222] border border-white/5 text-gray-300 cursor-default"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Edit mode hint */}
        {isEditing && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#03DAC6]/8 border border-[#03DAC6]/15">
            <div className="w-2 h-2 rounded-full bg-[#03DAC6] animate-pulse shrink-0" />
            <p className="text-xs text-gray-400">
              You&apos;re in edit mode — click{" "}
              <span className="text-[#03DAC6] font-semibold">Save Changes</span> to apply your updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
