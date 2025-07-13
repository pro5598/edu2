'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      fetchCartItems()
    } else {
      setCartItems([])
    }
  }, [isAuthenticated, user])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (courseId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add courses to cart')
      return { success: false }
    }

    if (user?.role !== 'student') {
      toast.error('Only students can add courses to cart')
      return { success: false }
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        await fetchCartItems() // Refresh cart items
        toast.success('Course added to cart!')
        return { success: true }
      } else {
        toast.error(data.error || 'Failed to add course to cart')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add course to cart')
      return { success: false, error: 'Network error' }
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart items
        toast.success('Course removed from cart')
        return { success: true }
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove course from cart')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast.error('Failed to remove course from cart')
      return { success: false, error: 'Network error' }
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const purchaseCourses = async (courseIds, paymentMethod = 'card') => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseIds, paymentMethod }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        await fetchCartItems() // Refresh cart items (should be empty now)
        toast.success(`Successfully enrolled in ${data.enrollments.length} course(s)!`)
        return { success: true, enrollments: data.enrollments }
      } else {
        toast.error(data.error || 'Purchase failed')
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Purchase failed. Please try again.')
      return { success: false, error: 'Network error' }
    }
  }

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => total + (item.Course?.price || 0), 0)
  const cartCount = cartItems.length

  // Check if a course is in cart
  const isInCart = (courseId) => {
    return cartItems.some(item => item.courseId === courseId)
  }

  const value = {
    cartItems,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
    purchaseCourses,
    fetchCartItems,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}