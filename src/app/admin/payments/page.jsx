// app/admin/payments/page.jsx
"use client";
import React, { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";

const AdminPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const payments = [
    {
      id: "PAY-001",
      studentName: "John Doe",
      studentEmail: "john.doe@example.com",
      courseName: "React Masterclass 2024",
      instructorName: "Sarah Johnson",
      amount: 60.00,
      status: "completed",
      paymentMethod: "Credit Card",
      paymentGateway: "Stripe",
    },
    {
      id: "PAY-002",
      studentName: "Emma Wilson",
      studentEmail: "emma.wilson@example.com",
      courseName: "JavaScript Fundamentals",
      instructorName: "Mike Chen",
      amount: 45.00,
      status: "pending",
      paymentMethod: "PayPal",
      paymentGateway: "PayPal",
    },
    {
      id: "PAY-003",
      studentName: "David Rodriguez",
      studentEmail: "david.rodriguez@example.com",
      courseName: "Node.js Complete Guide",
      instructorName: "Alex Thompson",
      amount: 75.00,
      status: "failed",
      paymentMethod: "Credit Card",
      paymentGateway: "Stripe",
    },
    {
      id: "PAY-004",
      studentName: "Lisa Anderson",
      studentEmail: "lisa.anderson@example.com",
      courseName: "Angular Zero to Mastery",
      instructorName: "Sarah Johnson",
      amount: 40.00,
      status: "completed",
      paymentMethod: "Credit Card",
      paymentGateway: "Stripe",
    },
    {
      id: "PAY-005",
      studentName: "Chris Lee",
      studentEmail: "chris.lee@example.com",
      courseName: "PHP Beginner to Advanced",
      instructorName: "Mike Chen",
      amount: 80.00,
      status: "refunded",
      paymentMethod: "PayPal",
      paymentGateway: "PayPal",
    },
  ];

  const paymentStats = {
    totalRevenue: 15420.50,
    totalInstructorEarnings: 10794.35,
    totalTransactions: 342,
    completedTransactions: 298,
    pendingTransactions: 23,
    failedTransactions: 15,
    refundedTransactions: 6,
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                <span>Payments Management</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Monitor and manage all platform transactions
              </p>
            </div>
            
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">${paymentStats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Instructor Earnings</p>
                  <p className="text-xl font-bold text-gray-900">${paymentStats.totalInstructorEarnings.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Total Transactions</p>
                  <p className="text-xl font-bold text-gray-900">{paymentStats.totalTransactions}</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                      <div className="text-sm text-gray-700">{payment.paymentGateway}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                      <div className="text-sm text-gray-700">{payment.studentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.courseName}</div>
                      <div className="text-sm text-gray-700">by {payment.instructorName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
