// src/app/instructor/profile/page.js
"use client";

import React from 'react';

export default function InstructorProfilePage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">My Profile</h2>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
          <dd className="mt-1 text-sm text-gray-900">February 25, 2025 6:01 gm</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">First Name</dt>
          <dd className="mt-1 text-sm text-gray-900">John</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Last Name</dt>
          <dd className="mt-1 text-sm text-gray-900">Doe</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Username</dt>
          <dd className="mt-1 text-sm text-gray-900">instructor</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">example@gmail.com</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
          <dd className="mt-1 text-sm text-gray-900">+1-202-555-0174</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Skill/Occupation</dt>
          <dd className="mt-1 text-sm text-gray-900">Application Developer</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">Biography</dt>
          <dd className="mt-1 text-sm text-gray-900">
            I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations, and creating intuitive, dynamic user experiences.
          </dd>
        </div>
      </dl>
    </div>
  );
}