"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, UserCog, MessageSquare, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

/**
 * TableCellFeedbackThread component for displaying feedback in a table cell
 *
 * @param {Object} props
 * @param {Array} props.messages - Array of feedback messages
 * @param {Function} props.onSendMessage - Function to call when sending a new message
 * @param {Function} props.onMarkAsRead - Function to call to mark messages as read
 * @param {Object} props.document - The document object
 */
export function TableCellFeedbackThread({ messages = [], onSendMessage, onMarkAsRead, document }) {
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages when messages change or when expanded
  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }

    // Mark messages as read when component mounts or is expanded
    if (isExpanded && onMarkAsRead && document) {
      onMarkAsRead(document);
    }
  }, [messages, isExpanded, document, onMarkAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(document.id, document.property_id, newMessage);
      setNewMessage("");

      // Focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format date for display
  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Check if there are unread messages
  const hasUnreadMessages = messages?.some(msg => msg.sender_type === 'admin' && !msg.is_read);

  return (
    <div className="relative">
      {/* New feedback indicator - show if any admin messages are unread */}
      {hasUnreadMessages && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
        </span>
      )}

      <div
        className={`
          rounded-lg border transition-all duration-200
          ${isExpanded
            ? 'bg-white shadow-md border-gray-300'
            : 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer'}
        `}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            onMarkAsRead(document);
          }
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
            <p className="text-sm font-medium text-gray-800">
              Feedback Thread
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium mr-2">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>

            {isExpanded && (
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        {isExpanded ? (
          <>
            <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No messages yet</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`
                        relative max-w-[85%] rounded-lg p-3
                        ${msg.sender_type === 'admin'
                          ? 'bg-white border border-gray-200 text-gray-800'
                          : 'bg-blue-600 text-white'}
                      `}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {msg.sender_type === 'admin' ? (
                          <UserCog className="h-3 w-3 text-blue-600" />
                        ) : (
                          <User className="h-3 w-3 text-blue-100" />
                        )}
                        <span className="font-medium text-xs">
                          {msg.sender_type === 'admin' ? 'Admin' : 'You'}
                        </span>
                        <span className={`text-xs ${msg.sender_type === 'admin' ? 'text-gray-500' : 'text-blue-100'}`}>
                          {formatMessageDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply to feedback..."
                  className="flex-1 text-sm border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  className="bg-blue-600 text-white rounded-r-md px-3 py-2 text-sm hover:bg-blue-700 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage();
                  }}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          // Collapsed view - preview of messages
          <div className="p-3">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {/* Show only the last 2 messages in collapsed view */}
                {messages.slice(-2).map((msg, index) => (
                  <div key={msg.id || index} className="flex items-start">
                    <div className={`h-3 w-3 mt-1 rounded-full ${msg.sender_type === 'admin' ? 'bg-blue-600' : 'bg-gray-400'} mr-2 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-700">
                          {msg.sender_type === 'admin' ? 'Admin' : 'You'}:
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {formatMessageDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}

                {/* Show "more messages" indicator if there are more than 2 messages */}
                {messages.length > 2 && (
                  <button
                    className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                  >
                    + {messages.length - 2} more message{messages.length - 2 !== 1 ? 's' : ''}
                  </button>
                )}

                {/* "Full Thread" button in collapsed view */}
                <div className="mt-2 flex justify-end">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                  >
                    View Full Thread
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
