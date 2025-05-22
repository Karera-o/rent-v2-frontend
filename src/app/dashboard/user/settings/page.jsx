"use client";

import {
  User,
  Lock,
  Bell,
  CreditCard,
  Mail,
  Save,
  Upload
} from "lucide-react";
import SettingsTabs from "@/components/dashboard/SettingsTabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <SettingsTabs>
        {/* Profile Settings */}
        <div id="profile" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-400" />
                Profile Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal information and how it appears on your account.
              </p>
            </div>

            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-2xl overflow-hidden">
                U
              </div>
              <div className="ml-5">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div id="security" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-gray-400" />
                Security Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your password and account security preferences.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="two-factor"
                      name="two-factor"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="two-factor" className="font-medium text-gray-700">
                      Enable two-factor authentication
                    </label>
                    <p className="text-gray-500">
                      Add an extra layer of security to your account by requiring both your password and a verification code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div id="notifications" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-gray-400" />
                Notification Preferences
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage how and when you receive notifications.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-bookings"
                        name="email-bookings"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-bookings" className="font-medium text-gray-700">
                        Booking notifications
                      </label>
                      <p className="text-gray-500">
                        Receive emails when your bookings are confirmed, modified, or cancelled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div id="payment" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                Payment Methods
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your payment methods and preferences.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Saved Payment Methods</h4>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </SettingsTabs>
    </div>
  );
}