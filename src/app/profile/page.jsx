'use client';
import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view profile
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to manage your profile and preferences
          </p>
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-blue-100">
                  Member since {new Date(user.date_joined).getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.phone}</span>
                </div>
              )}
              
              {user.address && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.address}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">
                  Joined {new Date(user.date_joined).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={logout}
                className="border border-red-300 hover:bg-red-50 text-red-700 px-6 py-3 rounded-lg font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}