"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  Trash, 
  Archive, 
  Flag, 
  Tag
} from "lucide-react";

export default function MessageDetailPage({ params }) {
  const messageId = params.id;
  
  // In a real app, you would fetch the message details from an API
  // This is just mock data for demonstration
  const message = {
    id: messageId,
    sender: {
      id: "U12345",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      role: "Tenant",
      avatar: null
    },
    subject: "Question about booking",
    message: "Hello,\n\nI have a question about my recent booking. The confirmation email mentioned check-in is at 3 PM, but the property listing says 2 PM. Could you please clarify?\n\nAlso, is it possible to arrange for an early check-in? We'll be arriving in the city around 11 AM and would prefer not to wait until the afternoon if possible.\n\nThank you for your assistance!\n\nBest regards,\nJohn",
    date: "2023-03-15T14:30:00",
    status: "Read",
    priority: "Medium",
    labels: ["Booking", "Inquiry"],
    relatedBooking: {
      id: "B12345",
      property: "Modern Apartment with City View",
      checkIn: "2023-04-10",
      checkOut: "2023-04-15"
    },
    conversation: [
      {
        id: "R12345",
        sender: {
          id: "U12349",
          name: "Michael Brown",
          role: "Admin",
          avatar: null
        },
        message: "Hi John,\n\nThank you for reaching out. I apologize for the confusion. The correct check-in time is 3 PM as mentioned in your confirmation email.\n\nRegarding early check-in, I'll need to check with the property owner. I'll get back to you as soon as I have more information.\n\nBest regards,\nMichael",
        date: "2023-03-15T15:45:00"
      }
    ]
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            href="/dashboard/admin/messages" 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{message.subject}</h1>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </button>
          <button className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Message Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start border-b border-gray-200">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
              {message.sender.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {message.sender.name}
              </h3>
              <div className="flex flex-wrap items-center mt-1">
                <span className="text-sm text-gray-500 mr-3">
                  {message.sender.role}
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(message.priority)}`}>
                  {message.priority} Priority
                </span>
                {message.labels.map((label, index) => (
                  <span key={index} className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(message.date)}
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <a href={`mailto:${message.sender.email}`} className="text-sm text-primary hover:underline">
                {message.sender.email}
              </a>
            </div>
            {message.sender.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`tel:${message.sender.phone}`} className="text-sm text-primary hover:underline">
                  {message.sender.phone}
                </a>
              </div>
            )}
            {message.relatedBooking && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-gray-400 mr-2" />
                <Link href={`/dashboard/admin/bookings/${message.relatedBooking.id}`} className="text-sm text-primary hover:underline">
                  Booking: {message.relatedBooking.id}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            {message.message.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          {message.relatedBooking && (
            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Related Booking Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Property:</span>{" "}
                  <Link href={`/dashboard/admin/properties`} className="text-primary hover:underline">
                    {message.relatedBooking.property}
                  </Link>
                </div>
                <div>
                  <span className="text-gray-500">Check-in:</span>{" "}
                  <span>{new Date(message.relatedBooking.checkIn).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Check-out:</span>{" "}
                  <span>{new Date(message.relatedBooking.checkOut).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Previous Replies */}
      {message.conversation && message.conversation.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Previous Replies</h2>
          
          {message.conversation.map((reply) => (
            <div key={reply.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-start border-b border-gray-200">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {reply.sender.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium leading-6 text-gray-900">
                      {reply.sender.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {reply.sender.role}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(reply.date)}
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="prose max-w-none">
                  {reply.message.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Reply to this message
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <textarea
              rows={6}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Type your reply here..."
            ></textarea>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <Flag className="h-4 w-4 mr-2" />
                  Mark as Important
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Save as Template
                </button>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}