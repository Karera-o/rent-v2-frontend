"use client";

import { useState } from 'react';
import { User, Home } from 'lucide-react';

export default function RoleSelectionModal({ onRoleSelect, onCancel, isLoading, mode = 'signin' }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-2 text-center">I am a...</h2>
        <p className="text-center text-gray-500 mb-6">
          Please select your role to {mode === 'signup' ? 'sign up' : 'sign in'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('tenant')}
              className={`flex flex-col items-center justify-center p-6 border rounded-lg transition-all ${
                selectedRole === 'tenant'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <User className="h-12 w-12 mb-3 text-gray-700" />
              <span className="font-medium text-lg">Tenant</span>
              <p className="text-sm text-gray-500 text-center mt-2">
                I'm looking for a place to rent
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('agent')}
              className={`flex flex-col items-center justify-center p-6 border rounded-lg transition-all ${
                selectedRole === 'agent'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Home className="h-12 w-12 mb-3 text-gray-700" />
              <span className="font-medium text-lg">Landlord</span>
              <p className="text-sm text-gray-500 text-center mt-2">
                I have properties to rent out
              </p>
            </button>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors ${
                !selectedRole ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedRole || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                selectedRole ? `${mode === 'signup' ? 'Sign up' : 'Sign in'} as ${selectedRole === 'tenant' ? 'Tenant' : 'Landlord'}` : 'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
