"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, ExternalLink } from "lucide-react";

/**
 * TableCellFeedbackLink component for displaying simple feedback in a table cell
 * that links to a full thread page
 *
 * @param {Object} props
 * @param {string} props.feedback - Feedback message
 * @param {boolean} props.isRead - Whether the feedback has been read
 * @param {Function} props.onMarkAsRead - Function to call to mark feedback as read
 * @param {Object} props.document - The document object
 */
export function TableCellFeedbackLink({ feedback, isRead, onMarkAsRead, document, updatedAt }) {
  const router = useRouter();

  // Navigate to full thread page
  const navigateToFullThread = () => {
    if (document && document.id) {
      // Mark feedback as read when navigating
      if (!isRead && onMarkAsRead) {
        onMarkAsRead(document);
      }

      // Navigate to the full thread page
      router.push(`/dashboard/landlord/documents/${document.id}/feedback`);
    }
  };

  return (
    <div className="relative">
      {/* New feedback indicator */}
      {!isRead && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
        </span>
      )}

      <div
        className="bg-blue-50 p-3 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors w-full"
        onClick={navigateToFullThread}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-2">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">
              Admin Feedback
            </p>
          </div>
          <div className="flex items-center">
            {updatedAt && (
              <span className="text-xs text-gray-500 mr-2">
                {new Date(updatedAt).toLocaleDateString()}
              </span>
            )}
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
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback}</p>
      </div>
    </div>
  );
}
