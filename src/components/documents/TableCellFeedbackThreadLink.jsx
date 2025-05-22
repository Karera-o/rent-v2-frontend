"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, ExternalLink, User, UserCog } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

/**
 * TableCellFeedbackThreadLink component for displaying feedback preview in a table cell
 * that links to a full thread page
 *
 * @param {Object} props
 * @param {Array} props.messages - Array of feedback messages
 * @param {Function} props.onMarkAsRead - Function to call to mark messages as read
 * @param {Object} props.document - The document object
 */
export function TableCellFeedbackThreadLink({ messages = [], onMarkAsRead, document }) {
  const router = useRouter();

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

  // Navigate to full thread page
  const navigateToFullThread = () => {
    if (document && document.id) {
      // Mark messages as read when navigating
      if (onMarkAsRead) {
        onMarkAsRead(document);
      }

      // Navigate to the full thread page
      router.push(`/dashboard/landlord/documents/${document.id}/feedback`);
    }
  };

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
        className="rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors w-full"
        onClick={navigateToFullThread}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-2">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">
              Feedback Thread
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium mr-2">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
            <button
              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                navigateToFullThread();
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Full Thread
            </button>
          </div>
        </div>

        {/* Preview of messages */}
        <div className="p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {/* Show only the last 2 messages in preview */}
              {messages.slice(-2).map((msg, index) => (
                <div key={msg.id || index} className="flex items-start">
                  <div className="flex items-center mr-2 flex-shrink-0">
                    {msg.sender_type === 'admin' ? (
                      <UserCog className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-700">
                        {msg.sender_type === 'admin' ? 'Admin' : 'You'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1.5">
                        {formatMessageDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-0.5">{msg.message}</p>
                  </div>
                </div>
              ))}

              {/* Show "more messages" indicator if there are more than 2 messages */}
              {messages.length > 2 && (
                <p className="text-xs text-blue-600 font-medium">
                  + {messages.length - 2} more message{messages.length - 2 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
