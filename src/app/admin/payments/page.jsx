// app/admin/payments/page.jsx
"use client";
import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle
} from "lucide-react";

const AdminPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalRevenue: 0,
    totalInstructorEarnings: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    refundedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '20'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`/api/admin/payments?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      setPayments(data.payments);
      setPaymentStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPayments();
  }, [pagination.currentPage, searchTerm, filterStatus]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };
  
  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

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
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="ml-2 text-red-600">{error}</span>
              <button 
                onClick={fetchPayments}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <CreditCard className="w-8 h-8 text-gray-400" />
              <span className="ml-2 text-gray-600">No payments found</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Revenue Split</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
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
                      <div className="text-sm font-medium text-gray-900">${payment.amount?.toFixed(2)}</div>
                      <div className="text-sm text-gray-700">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-green-600 font-medium">Admin: ${payment.adminRevenue?.toFixed(2)}</div>
                        <div className="text-blue-600">Instructor: ${payment.instructorAmount?.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      {payment.status === 'failed' && payment.failureReason && (
                        <div className="text-xs text-red-600 mt-1">{payment.failureReason}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalPayments)} of {pagination.totalPayments} payments
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
                  {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
