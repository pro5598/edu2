"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Star,
  Clock,
  BookOpen,
  CreditCard,
  Lock,
  CheckCircle,
  ArrowRight,
  X,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Angela Yu",
      rating: 4.8,
      reviews: 2847,
      price: 89.99,
      originalPrice: 199.99,
      duration: "65 hours",
      lessons: 120,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Jose Portilla",
      rating: 4.9,
      reviews: 1923,
      price: 79.99,
      originalPrice: 149.99,
      duration: "45 hours",
      lessons: 85,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
      category: "Data Science",
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter(item => item.id !== courseId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutModal(false);
      
      // Generate order number
      const orderNum = 'ORD-' + Date.now().toString().slice(-6);
      setOrderNumber(orderNum);
      setShowSuccessModal(true);
      
      // Clear cart after successful purchase
      setTimeout(() => {
        setCartItems([]);
      }, 3000);
    }, 3000);
  };

  const closeModals = () => {
    setShowCheckoutModal(false);
    setShowSuccessModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              Browse our courses and add some to your cart
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                  <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                  <span>Shopping Cart</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  {cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                            {course.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(course.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-2">
                          by {course.instructor}
                        </p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(course.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-600">
                              {course.rating} ({course.reviews})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-slate-800">
                              ${course.price}
                            </span>
                            {course.originalPrice > course.price && (
                              <span className="text-sm line-through text-slate-500">
                                ${course.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-slate-800">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Complete Your Purchase</h3>
                <button
                  onClick={closeModals}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handlePayment} className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.title}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-blue-200 pt-2 mt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isProcessing}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Complete Purchase</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Your order has been confirmed and you now have access to your courses.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Order Number</div>
                <div className="font-mono font-bold text-gray-900">{orderNumber}</div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="text-sm text-gray-600">Purchased Courses:</div>
                {cartItems.map((item) => (
                  <div key={item.id} className="text-sm font-medium text-gray-900">
                    {item.title}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to My Courses
                </button>
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
