"use client";

import { useState } from "react";
import { 
  Search, 
  MessageSquare, 
  ChevronRight,
  Send
} from "lucide-react";
import Link from "next/link";

export default function LandlordMessages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Mock data - in a real app, this would come from an API
  const conversations = [
    {
      id: "C12345",
      guest: {
        name: "John Doe",
        avatar: "/path/to/avatar1.jpg"
      },
      property: "Modern Apartment with City View",
      lastMessage: {
        text: "Hi, I was wondering if there's parking available nearby?",
        timestamp: "2023-03-15T14:30:00",
        isFromGuest: true
      },
      unread: true,
      messages: [
        {
          id: "M1",
          text: "Hello, I'm interested in your apartment for the dates April 10-15.",
          timestamp: "2023-03-15T14:00:00",
          isFromGuest: true
        },
        {
          id: "M2",
          text: "Hi John, thank you for your interest! Yes, those dates are available.",
          timestamp: "2023-03-15T14:15:00",
          isFromGuest: false
        },
        {
          id: "M3",
          text: "Great! I had a question about parking. Is there any available nearby?",
          timestamp: "2023-03-15T14:30:00",
          isFromGuest: true
        }
      ]
    },
    {
      id: "C12346",
      guest: {
        name: "Alice Smith",
        avatar: "/path/to/avatar2.jpg"
      },
      property: "Luxury Villa with Pool",
      lastMessage: {
        text: "Thanks for the information! I've just made the booking.",
        timestamp: "2023-03-14T11:45:00",
        isFromGuest: true
      },
      unread: false,
      messages: [
        {
          id: "M4",
          text: "Hello, I'm interested in your villa for my family vacation.",
          timestamp: "2023-03-14T10:00:00",
          isFromGuest: true
        },
        {
          id: "M5",
          text: "Hi Alice, I'd be happy to tell you more about our villa. How many people will be staying?",
          timestamp: "2023-03-14T10:15:00",
          isFromGuest: false
        },
        {
          id: "M6",
          text: "We'll be 4 adults and 2 children. Do you offer any discounts for a 2-week stay?",
          timestamp: "2023-03-14T10:30:00",
          isFromGuest: true
        },
        {
          id: "M7",
          text: "Yes, we offer a 10% discount for stays longer than 10 days. The pool is also heated if you're coming in the cooler months.",
          timestamp: "2023-03-14T11:00:00",
          isFromGuest: false
        },
        {
          id: "M8",
          text: "Thanks for the information! I've just made the booking.",
          timestamp: "2023-03-14T11:45:00",
          isFromGuest: true
        }
      ]
    },
    {
      id: "C12347",
      guest: {
        name: "Robert Johnson",
        avatar: "/path/to/avatar3.jpg"
      },
      property: "Cozy Studio near University",
      lastMessage: {
        text: "The stay was wonderful, thank you! I've left a 5-star review.",
        timestamp: "2023-03-10T09:20:00",
        isFromGuest: true
      },
      unread: false,
      messages: [
        {
          id: "M9",
          text: "Thank you for providing such a clean and comfortable space. The location was perfect for my university visit.",
          timestamp: "2023-03-10T09:00:00",
          isFromGuest: true
        },
        {
          id: "M10",
          text: "You're welcome Robert! It was a pleasure hosting you. We hope you'll stay with us again in the future.",
          timestamp: "2023-03-10T09:15:00",
          isFromGuest: false
        },
        {
          id: "M11",
          text: "The stay was wonderful, thank you! I've left a 5-star review.",
          timestamp: "2023-03-10T09:20:00",
          isFromGuest: true
        }
      ]
    }
  ];

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => 
    conversation.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the server
    console.log("Sending message:", newMessage, "to conversation:", selectedConversation.id);
    
    // Clear input after sending
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-7rem)]">
      <div className="flex h-full bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {/* Conversation List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {conversation.guest.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{conversation.guest.name}</p>
                      <p className="text-xs text-gray-500 truncate">{conversation.property}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.unread && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {conversation.lastMessage.isFromGuest ? '' : 'You: '}
                  {conversation.lastMessage.text}
                </p>
              </div>
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try searching with different keywords"
                    : "You don't have any messages yet"}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Conversation Detail */}
        <div className="hidden md:flex flex-col w-2/3 lg:w-3/4">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {selectedConversation.guest.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedConversation.guest.name}</p>
                    <p className="text-xs text-gray-500">{selectedConversation.property}</p>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/landlord/messages/${selectedConversation.id}`}
                  className="text-primary hover:text-primary/80 flex items-center text-sm"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.isFromGuest ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
                        message.isFromGuest 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-primary text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isFromGuest ? 'text-gray-500' : 'text-primary-100'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-2 inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a conversation from the list to view messages or start a new conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}