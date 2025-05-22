"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

/**
 * FeedbackThread component for displaying and interacting with document feedback
 * 
 * @param {Object} props
 * @param {Array} props.messages - Array of feedback messages
 * @param {Function} props.onSendMessage - Function to call when sending a new message
 * @param {Function} props.onMarkAsRead - Function to call to mark messages as read
 * @param {Object} props.document - The document object
 */
export function FeedbackThread({ messages = [], onSendMessage, onMarkAsRead, document }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Mark messages as read when component mounts
    if (onMarkAsRead && document) {
      onMarkAsRead(document);
    }
  }, [messages, document, onMarkAsRead]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
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
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Document info header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Thread</h3>
          <Badge 
            variant={document?.status === 'approved' ? 'success' : 
                   document?.status === 'rejected' ? 'destructive' : 'warning'}
          >
            {document?.status?.charAt(0).toUpperCase() + document?.status?.slice(1) || 'Unknown'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Document: {document?.document_type || 'Unknown type'}
        </p>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[300px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No feedback messages yet</p>
            <p className="text-sm mt-1">Messages will appear here when admins provide feedback</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-lg p-3 shadow-sm
                    ${msg.sender_type === 'admin' 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-blue-600 text-white'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender_type === 'admin' ? (
                      <UserCog className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="font-medium text-sm">
                      {msg.sender_type === 'admin' ? 'Admin' : 'You'}
                    </span>
                    <span className={`text-xs ${msg.sender_type === 'admin' ? 'text-gray-500' : 'text-blue-100'}`}>
                      {formatMessageDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  
                  {/* If message has an attachment */}
                  {msg.attachment && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-blue-600 text-sm">
                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Paperclip className="h-3 w-3 mr-1" />
                        View Attachment
                      </a>
                    </div>
                  )}
                  
                  {/* Unread indicator for admin messages */}
                  {msg.sender_type === 'admin' && !msg.is_read && (
                    <div className="mt-1 flex justify-end">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col space-y-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="resize-none min-h-[80px]"
          />
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAttachmentClick}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach File
            </Button>
            <Button 
              type="button" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              // Handle file attachment logic here
              console.log("File selected:", e.target.files[0]);
              // You would typically upload this file and then reference it in your message
            }}
          />
        </div>
      </div>
    </div>
  );
}
