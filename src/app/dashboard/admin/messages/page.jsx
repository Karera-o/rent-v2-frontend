"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Clock,
  Download,
  PlusCircle
} from "lucide-react";

export default function MessagesPage() {
  // In a real app, you would fetch messages from an API
  // This is just mock data for demonstration
  const mockMessages = [
    {
      id: "M12345",
      sender: {
        id: "U12345",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Tenant"
      },
      subject: "Question about booking",
      message: "Hello, I have a question about my recent booking. The confirmation email mentioned check-in is at 3 PM, but the property listing says 2 PM. Could you please clarify?",
      date: "2023-03-15T14:30:00",
      status: "Unread",
      priority: "Medium"
    },
    {
      id: "M12346",
      sender: {
        id: "U12346",
        name: "Alice Smith",
        email: "alice.smith@example.com",
        role: "Agent"
      },
      subject: "Property approval request",
      message: "I've submitted a new property for approval three days ago but haven't heard back. Could you please check the status? The property ID is P12350.",
      date: "2023-03-14T09:15:00",
      status: "Read",
      priority: "High"
    },
    {
      id: "M12347",
      sender: {
        id: "U12347",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "Tenant"
      },
      subject: "Payment issue",
      message: "I'm having trouble making a payment for my booking (B12347). The system keeps showing an error when I try to complete the transaction. Can you help?",
      date: "2023-03-13T16:45:00",
      status: "Replied",
      priority: "High"
    },
    {
      id: "M12348",
      sender: {
        id: "U12348",
        name: "Emma Williams",
        email: "emma.williams@example.com",
        role: "Tenant"
      },
      subject: "Cancellation policy",
      message: "I need to cancel my upcoming booking due to a family emergency. Could you please explain the cancellation policy and potential refund options?",
      date: "2023-03-12T11:20:00",
      status: "Read",
      priority: "Medium"
    },
    {
      id: "M12349",
      sender: {
        id: "U12349",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        role: "Admin"
      },
      subject: "System maintenance notification",
      message: "Just a heads up that we'll be performing system maintenance this weekend. The platform will be down for approximately 2 hours on Sunday from 2 AM to 4 AM EST.",
      date: "2023-03-11T15:10:00",
      status: "Read",
      priority: "Low"
    },
    {
      id: "M12350",
      sender: {
        id: "U12350",
        name: "Sophia Miller",
        email: "sophia.miller@example.com",
        role: "Tenant"
      },
      subject: "Special accommodation request",
      message: "I'm booking a stay for next month and I have a special accommodation request. I need a property that is wheelchair accessible. Can you recommend any suitable options?",
      date: "2023-03-10T13:25:00",
      status: "Unread",
      priority: "Medium"
    }
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Unread":
        return "bg-red-100 text-red-800";
      case "Read":
        return "bg-blue-100 text-blue-800";
      case "Replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Message Center</h1>
        <div className="flex space-x-2">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <PlusCircle className="h-4 w-4 mr-2" />
            Compose
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Search messages..."
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative inline-block">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
          
          <div className="relative inline-block">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {mockMessages.map((message) => (
            <li key={message.id} className="hover:bg-gray-50">
              <Link href={`/dashboard/admin/messages/${message.id}`} className="block">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {message.sender.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{message.sender.name}</span>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(message.status)}`}>
                            {message.status}
                          </span>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.sender.email} • {message.sender.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(message.date)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{message.subject}</h4>
                    <p className="text-sm text-gray-500 mt-1">{truncateText(message.message)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{" "}
                <span className="font-medium">24</span> messages
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  8
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Unread Messages
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      2
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Replies
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      4
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved Today
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      5
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}