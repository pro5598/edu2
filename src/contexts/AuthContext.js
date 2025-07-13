'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success('Login successful!')
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else if (data.user.role === 'instructor') {
          router.push('/instructor')
        } else {
          router.push('/courses')
        }
        
        return { success: true }
      } else {
        toast.error(data.error || 'Login failed')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success('Registration successful!')
        router.push('/courses')
        return { success: true }
      } else {
        toast.error(data.error || 'Registration failed')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isInstructor: user?.role === 'instructor',
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}