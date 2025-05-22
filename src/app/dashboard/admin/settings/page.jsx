"use client";

import {
  User,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Mail,
  Save,
  Upload
} from "lucide-react";
import SettingsTabs from "../../../../components/dashboard/SettingsTabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* Settings Navigation with Tabs */}
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
                M
              </div>
              <div className="ml-5">
                <div className="flex items-center">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </button>
                  <button className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Remove
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    defaultValue="Michael"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    defaultValue="Brown"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue="michael.brown@example.com"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    defaultValue="+1 (555) 987-6543"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    defaultValue="System administrator with 5+ years of experience in property management systems."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
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

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Current password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
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

              <div>
                <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Session</p>
                        <p className="text-xs text-gray-500">Started on March 15, 2023 at 2:30 PM</p>
                        <p className="text-xs text-gray-500">Chrome on Windows</p>
                      </div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active Now
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button className="text-sm text-primary hover:text-primary/80">
                      Sign out of all other sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
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
                        Receive emails when new bookings are made, modified, or cancelled.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-payments"
                        name="email-payments"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-payments" className="font-medium text-gray-700">
                        Payment notifications
                      </label>
                      <p className="text-gray-500">
                        Receive emails for payment confirmations, refunds, and failed transactions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-properties"
                        name="email-properties"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-properties" className="font-medium text-gray-700">
                        Property notifications
                      </label>
                      <p className="text-gray-500">
                        Receive emails when new properties are added or require approval.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-messages"
                        name="email-messages"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-messages" className="font-medium text-gray-700">
                        Message notifications
                      </label>
                      <p className="text-gray-500">
                        Receive emails when you get new messages from users.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-marketing"
                        name="email-marketing"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-marketing" className="font-medium text-gray-700">
                        Marketing emails
                      </label>
                      <p className="text-gray-500">
                        Receive emails about new features, tips, and platform updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-all"
                        name="push-all"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-all" className="font-medium text-gray-700">
                        Enable push notifications
                      </label>
                      <p className="text-gray-500">
                        Receive real-time notifications in your browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Settings */}
        <div id="billing" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                Billing Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your billing information and view your subscription details.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Current Plan</h4>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">Enterprise Plan</p>
                  <p className="text-sm text-gray-500">Unlimited properties, users, and bookings</p>
                </div>
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <p className="text-sm text-gray-500">Next billing date: April 15, 2023</p>
                <button className="ml-4 text-sm text-primary hover:text-primary/80">
                  Change plan
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0 h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-800">VISA</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/2024</p>
                </div>
                <button className="ml-auto text-sm text-primary hover:text-primary/80">
                  Update
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Billing History</h4>
              <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Mar 15, 2023
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Enterprise Plan - Monthly
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        $299.00
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-primary hover:text-primary/80">
                          Download
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Feb 15, 2023
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Enterprise Plan - Monthly
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        $299.00
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-primary hover:text-primary/80">
                          Download
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div id="system" className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-gray-400" />
                System Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure global system settings for the platform.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Regional Settings</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Default Timezone
                    </label>
                    <div className="mt-1">
                      <select
                        id="timezone"
                        name="timezone"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      >
                        <option>UTC (GMT+0)</option>
                        <option>Eastern Time (GMT-5)</option>
                        <option>Central Time (GMT-6)</option>
                        <option>Mountain Time (GMT-7)</option>
                        <option>Pacific Time (GMT-8)</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Default Currency
                    </label>
                    <div className="mt-1">
                      <select
                        id="currency"
                        name="currency"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                        <option>CAD (C$)</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                      Date Format
                    </label>
                    <div className="mt-1">
                      <select
                        id="date-format"
                        name="date-format"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Default Language
                    </label>
                    <div className="mt-1">
                      <select
                        id="language"
                        name="language"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Booking Settings</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="auto-approve"
                        name="auto-approve"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="auto-approve" className="font-medium text-gray-700">
                        Auto-approve bookings
                      </label>
                      <p className="text-gray-500">
                        Automatically approve bookings without manual review.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="min-booking" className="block text-sm font-medium text-gray-700">
                      Minimum Booking Duration (days)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="min-booking"
                        id="min-booking"
                        defaultValue="1"
                        min="1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="max-booking" className="block text-sm font-medium text-gray-700">
                      Maximum Booking Duration (days)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="max-booking"
                        id="max-booking"
                        defaultValue="30"
                        min="1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">API Settings</h4>
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">API Key</p>
                        <p className="text-xs text-gray-500">Last generated on March 10, 2023</p>
                      </div>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Regenerate
                      </button>
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        readOnly
                        value=""
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-gray-100"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This API key provides full access to your account. Keep it secure and do not share it.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </SettingsTabs>

      {/* JavaScript to handle tab switching would be added in a real application */}
      {/* For demo purposes, we're just showing the profile tab by default */}
    </div>
  );
}