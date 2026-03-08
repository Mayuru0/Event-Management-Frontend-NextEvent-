/*eslint-disable @typescript-eslint/no-explicit-any*/
"use client"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store/store"
import type { User } from "@/type/user"
import { isTokenExpired } from "@/utils/tokenUtils"

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const storage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

const initialState: AuthState = {
  user: storage.getItem("user") || null,
  token: storage.getItem("token") || null,
  refreshToken: storage.getItem("refreshToken") || null,
  isAuthenticated: !!storage.getItem("token"),
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      if (action.payload.user && action.payload.token) {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        storage.setItem("token", action.payload.token)
        storage.setItem("user", action.payload.user)
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken
          storage.setItem("refreshToken", action.payload.refreshToken)
        }
      }
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      storage.setItem("token", action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      storage.removeItem("token")
      storage.removeItem("user")
      storage.removeItem("refreshToken")
    },
    checkAuth: (state) => {
      const token = storage.getItem("token")
      if (!token || isTokenExpired(token)) {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        storage.removeItem("token")
        storage.removeItem("user")
        storage.removeItem("refreshToken")
      }
    },
  },
})

export const { setCredentials, updateToken, logout, checkAuth } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectuser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken

export default authSlice.reducer
