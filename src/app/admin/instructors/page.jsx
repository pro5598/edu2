// app/admin/instructors/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit,
  X,
  Star,
  Trash2,
} from "lucide-react";

const AdminInstructorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    bio: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/instructors');
      
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.instructors || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch instructors');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError('An error occurred while fetching instructors');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const instructorStatus = instructor.status === 'active' ? 'approved' : 'pending';
    const matchesStatus = filterStatus === "all" || instructorStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddInstructor = () => {
    setShowAddModal(true);
  };

  const renderStars = (rating) => {
    if (rating === 0) return <span className="text-gray-500">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-700">{rating}</span>
      </div>
    );
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructor({ 
      ...instructor,
      specialization: instructor.expertise && instructor.expertise.length > 0 ? instructor.expertise[0] : instructor.specialization || '',
      isActive: instructor.status === 'active'
    });
    setShowEditModal(true);
  };

  const handleSaveInstructor = async () => {
    try {
      const response = await fetch('/api/admin/instructors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructorId: editingInstructor._id || editingInstructor.id,
          firstName: editingInstructor.firstName,
          lastName: editingInstructor.lastName,
          email: editingInstructor.email,
          phone: editingInstructor.phone,
          bio: editingInstructor.bio,
          expertise: editingInstructor.specialization ? [editingInstructor.specialization] : editingInstructor.expertise || [],
          isActive: editingInstructor.isActive
        }),
      });

      if (response.ok) {
        await fetchInstructors();
        setShowEditModal(false);
        setEditingInstructor(null);
        showToast('Instructor updated successfully!');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to update instructor', 'error');
      }
    } catch (error) {
      console.error('Error updating instructor:', error);
      showToast('An error occurred while updating instructor', 'error');
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (!window.confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/instructors?id=${instructorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchInstructors();
        showToast('Instructor deleted successfully!');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to delete instructor', 'error');
      }
    } catch (error) {
      console.error('Error deleting instructor:', error);
      showToast('An error occurred while deleting instructor', 'error');
    }
  };

  const handleSaveNewInstructor = async () => {
    try {
      const response = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newInstructor.firstName,
          lastName: newInstructor.lastName,
          username: newInstructor.username,
          email: newInstructor.email,
          phone: newInstructor.phone,
          password: newInstructor.password,
          expertise: newInstructor.specialization ? [newInstructor.specialization] : [],
          bio: newInstructor.bio
        }),
      });

      if (response.ok) {
        await fetchInstructors();
        setShowAddModal(false);
        setNewInstructor({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          phone: '',
          password: '',
          specialization: '',
          bio: ''
        });
        showToast('Instructor created successfully!');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to create instructor', 'error');
      }
    } catch (error) {
      console.error('Error creating instructor:', error);
      showToast('An error occurred while creating instructor', 'error');
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewInstructor({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      bio: ''
    });
  };

  const handleNewInstructorInputChange = (field, value) => {
    setNewInstructor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingInstructor(null);
  };

  const handleInputChange = (field, value) => {
    setEditingInstructor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                <span>Instructors Management</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Manage instructor applications and performance
              </p>
            </div>
            
            <button 
            onClick={handleAddInstructor}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Instructor</span>
          </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search instructors..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Instructors Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Loading instructors...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 text-center">
                <p className="text-lg font-medium">Error loading instructors</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={fetchInstructors}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredInstructors.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">No instructors found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstructors.map((instructor) => {
                  const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim();
                  const instructorStatus = instructor.status === 'active' ? 'approved' : 'pending';
                  
                  return (
                      <tr key={instructor._id || instructor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fullName}</div>
                          <div className="text-sm text-gray-600">{instructor.email}</div>
                          <div className="text-xs text-gray-500">{instructor.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instructorStatus)}`}>
                          {instructorStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {instructor.specialization || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {instructor.phone || 'Not provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditInstructor(instructor)}
                            className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit instructor"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(instructor._id || instructor.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete instructor"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Instructor Modal */}
      {showEditModal && editingInstructor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Instructor</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingInstructor.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingInstructor.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingInstructor.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={editingInstructor.specialization || ''}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editingInstructor.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder="Brief description about the instructor..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructor}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New Instructor</h3>
                <button
                  onClick={handleCloseAddModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newInstructor.firstName}
                    onChange={(e) => handleNewInstructorInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newInstructor.lastName}
                    onChange={(e) => handleNewInstructorInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={newInstructor.username}
                    onChange={(e) => handleNewInstructorInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newInstructor.email}
                    onChange={(e) => handleNewInstructorInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newInstructor.phone}
                    onChange={(e) => handleNewInstructorInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newInstructor.password}
                    onChange={(e) => handleNewInstructorInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={newInstructor.specialization}
                  onChange={(e) => handleNewInstructorInputChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder="e.g., Mathematics, Computer Science, Physics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={newInstructor.bio}
                  onChange={(e) => handleNewInstructorInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder="Brief description about the instructor..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCloseAddModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewInstructor}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Instructor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {toast.type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-4 text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInstructorsPage;
