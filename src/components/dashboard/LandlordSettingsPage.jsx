"use client";

import { useState } from "react";
import SettingsTabs from "@/components/dashboard/SettingsTabs";

export default function LandlordSettingsPage() {
  const [name, setName] = useState("John Landlord");
  const [email, setEmail] = useState("john.landlord@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Main St, New York, NY 10001");
  const [notifyNewBookings, setNotifyNewBookings] = useState(true);
  const [notifyBookingUpdates, setNotifyBookingUpdates] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState("email");
  const [allowInstantBooking, setAllowInstantBooking] = useState(true);
  const [minBookingDays, setMinBookingDays] = useState(2);
  const [maxBookingDays, setMaxBookingDays] = useState(30);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(365);
  const [cancellationPolicy, setCancellationPolicy] = useState("moderate");
  const [paymentMethods, setPaymentMethods] = useState(["bank_transfer", "paypal"]);
  const [bankAccount, setBankAccount] = useState({
    accountName: "John Landlord",
    accountNumber: "XXXX-XXXX-XXXX-1234",
    routingNumber: "XXX-XXX-XXX"
  });
  const [paypalEmail, setPaypalEmail] = useState("john.landlord@example.com");

  // Handler functions
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data to a server
    console.log("Profile updated");
    // Show a success notification or message
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data to a server
    console.log("Notification preferences updated");
    // Show a success notification or message
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data to a server
    console.log("Booking preferences updated");
    // Show a success notification or message
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data to a server
    console.log("Payment settings updated");
    // Show a success notification or message
  };

  const togglePaymentMethod = (method) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
      
      <SettingsTabs>
        {/* Profile Settings */}
        <div id="profile" className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div id="notifications" className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h2>
          
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newBookings"
                    name="newBookings"
                    type="checkbox"
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    checked={notifyNewBookings}
                    onChange={() => setNotifyNewBookings(!notifyNewBookings)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newBookings" className="font-medium text-gray-700">
                    New booking notifications
                  </label>
                  <p className="text-gray-500">Receive notifications when a new booking is made.</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="bookingUpdates"
                    name="bookingUpdates"
                    type="checkbox"
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    checked={notifyBookingUpdates}
                    onChange={() => setNotifyBookingUpdates(!notifyBookingUpdates)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="bookingUpdates" className="font-medium text-gray-700">
                    Booking update notifications
                  </label>
                  <p className="text-gray-500">Receive notifications when a booking is updated or cancelled.</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="messages"
                    name="messages"
                    type="checkbox"
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    checked={notifyMessages}
                    onChange={() => setNotifyMessages(!notifyMessages)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="messages" className="font-medium text-gray-700">
                    Message notifications
                  </label>
                  <p className="text-gray-500">Receive notifications when a guest sends you a message.</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="payments"
                    name="payments"
                    type="checkbox"
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    checked={notifyPayments}
                    onChange={() => setNotifyPayments(!notifyPayments)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="payments" className="font-medium text-gray-700">
                    Payment notifications
                  </label>
                  <p className="text-gray-500">Receive notifications when a payment is made or processed.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="notificationMethod" className="block text-sm font-medium text-gray-700">
                Preferred notification method
              </label>
              <select
                id="notificationMethod"
                name="notificationMethod"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={notificationMethod}
                onChange={(e) => setNotificationMethod(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both Email and SMS</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Booking Settings */}
        <div id="booking" className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Booking Settings</h2>
          
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="instantBooking"
                  name="instantBooking"
                  type="checkbox"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  checked={allowInstantBooking}
                  onChange={() => setAllowInstantBooking(!allowInstantBooking)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="instantBooking" className="font-medium text-gray-700">
                  Allow instant booking
                </label>
                <p className="text-gray-500">Guests can book without requiring approval.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label htmlFor="minBookingDays" className="block text-sm font-medium text-gray-700">
                  Minimum stay (days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="minBookingDays"
                    id="minBookingDays"
                    min="1"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={minBookingDays}
                    onChange={(e) => setMinBookingDays(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="maxBookingDays" className="block text-sm font-medium text-gray-700">
                  Maximum stay (days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="maxBookingDays"
                    id="maxBookingDays"
                    min="1"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={maxBookingDays}
                    onChange={(e) => setMaxBookingDays(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="advanceBookingDays" className="block text-sm font-medium text-gray-700">
                  Advance booking (days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="advanceBookingDays"
                    id="advanceBookingDays"
                    min="1"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    value={advanceBookingDays}
                    onChange={(e) => setAdvanceBookingDays(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">
                Cancellation Policy
              </label>
              <select
                id="cancellationPolicy"
                name="cancellationPolicy"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
              >
                <option value="flexible">Flexible - Full refund 1 day prior to arrival</option>
                <option value="moderate">Moderate - Full refund 5 days prior to arrival</option>
                <option value="strict">Strict - 50% refund up until 1 week prior to arrival</option>
                <option value="non_refundable">Non-refundable - No refund</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Payment Settings */}
        <div id="payment" className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Settings</h2>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Payment Methods</label>
              <div className="mt-4 space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="bankTransfer"
                      name="paymentMethods"
                      type="checkbox"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      checked={paymentMethods.includes('bank_transfer')}
                      onChange={() => togglePaymentMethod('bank_transfer')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="bankTransfer" className="font-medium text-gray-700">
                      Bank Transfer
                    </label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="paypal"
                      name="paymentMethods"
                      type="checkbox"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      checked={paymentMethods.includes('paypal')}
                      onChange={() => togglePaymentMethod('paypal')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="paypal" className="font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="stripe"
                      name="paymentMethods"
                      type="checkbox"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      checked={paymentMethods.includes('stripe')}
                      onChange={() => togglePaymentMethod('stripe')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="stripe" className="font-medium text-gray-700">
                      Credit Card (Stripe)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {paymentMethods.includes('bank_transfer') && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-4">Bank Account Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                      Account Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="accountName"
                        id="accountName"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={bankAccount.accountName}
                        onChange={(e) => setBankAccount({...bankAccount, accountName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="accountNumber"
                        id="accountNumber"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={bankAccount.accountNumber}
                        onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
                      Routing Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="routingNumber"
                        id="routingNumber"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={bankAccount.routingNumber}
                        onChange={(e) => setBankAccount({...bankAccount, routingNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethods.includes('paypal') && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-4">PayPal Details</h3>
                <div>
                  <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700">
                    PayPal Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="paypalEmail"
                      id="paypalEmail"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Security Settings */}
        <div id="security" className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>
          
          <form className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </SettingsTabs>
    </div>
  );
}