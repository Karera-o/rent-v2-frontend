"use client";

import {
  MessageSquare,
  Search,
  Send,
  Trash2,
  Archive,
} from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const messages = [
    {
      id: 1,
      sender: "John Smith",
      subject: "Welcome to Downtown Loft",
      preview: "Looking forward to hosting you...",
      date: "Mar 17, 2025",
      unread: true,
      content: "Hi there! Looking forward to hosting you at Downtown Loft. Please let me know if you have any questions about the property or check-in process.",
    },
    {
      id: 2,
      sender: "Platform Support",
      subject: "Booking Confirmation",
      preview: "Your booking has been confirmed...",
      date: "Mar 15, 2025",
      unread: false,
      content: "Your booking for Downtown Loft has been confirmed. Check-in details will be sent 48 hours before your arrival.",
    },
    {
      id: 3,
      sender: "Sarah Jones",
      subject: "Beachfront Villa Inquiry",
      preview: "Regarding your upcoming stay...",
      date: "Mar 14, 2025",
      unread: false,
      content: "Just checking if you need any specific arrangements for your stay at the Beachfront Villa next month.",
    },
  ];

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMessage) {
      // In a real app, this would send the message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
          New Message
        </button>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No messages found</div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?.id === msg.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${
                          msg.unread ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {msg.sender}
                      </p>
                      <p className="text-sm text-gray-900 truncate">{msg.subject}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.preview}</p>
                    </div>
                    <p className="text-xs text-gray-500">{msg.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-600">From: {selectedMessage.sender}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900" title="Archive">
                    <Archive className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600" title="Delete">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-gray-700">{selectedMessage.content}</p>
                <p className="text-sm text-gray-500 mt-2">{selectedMessage.date}</p>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-md ${
                      newMessage.trim()
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}