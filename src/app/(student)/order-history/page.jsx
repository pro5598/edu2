"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";

const StudentOrderHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const orderData = [
    {
      id: "#5478",
      course: "App Development",
      date: "January 27, 2022",
      price: "$100.99",
      status: "completed",
    },
    {
      id: "#4585",
      course: "Graphic Design",
      date: "May 27, 2022",
      price: "$200.99",
      status: "processing",
    },
    {
      id: "#6656",
      course: "Graphic Design",
      date: "March 27, 2022",
      price: "$200.99",
      status: "completed",
    },
    {
      id: "#2045",
      course: "Application Development",
      date: "March 27, 2022",
      price: "$200.99",
      status: "cancelled",
    },
    {
      id: "#5478",
      course: "App Development",
      date: "January 27, 2022",
      price: "$100.99",
      status: "completed",
    },
    {
      id: "#4585",
      course: "Graphic Design",
      date: "May 27, 2022",
      price: "$200.99",
      status: "processing",
    },
    {
      id: "#6656",
      course: "Graphic Design",
      date: "March 27, 2022",
      price: "$200.99",
      status: "completed",
    },
    {
      id: "#2045",
      course: "Application Development",
      date: "March 27, 2022",
      price: "$200.99",
      status: "cancelled",
    },
    {
      id: "#5478",
      course: "App Development",
      date: "January 27, 2022",
      price: "$100.99",
      status: "completed",
    },
    {
      id: "#4585",
      course: "Graphic Design",
      date: "May 27, 2022",
      price: "$200.99",
      status: "processing",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";
      case "processing":
        return "⏳";
      case "cancelled":
        return "✕";
      default:
        return "?";
    }
  };

  const filteredOrders = orderData.filter((order) => {
    const matchesSearch =
      order.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
                Order History
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Track your course purchases and enrollment history
              </p>
            </div>

            {/* Action Buttons - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:flex space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-600 bg-white font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900 font-medium"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order, index) => (
                <tr
                  key={`${order.id}-${index}`}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                    {order.course}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                    {order.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order, index) => (
              <div
                key={`${order.id}-${index}`}
                className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                        {order.course}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        Order {order.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{order.price}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="flex items-center space-x-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
              No orders found
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't made any course purchases yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOrderHistoryPage;
