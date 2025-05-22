"use client";

import { MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

/**
 * TableCellFeedback component for displaying simple feedback in a table cell
 *
 * @param {Object} props
 * @param {string} props.feedback - Feedback message
 * @param {boolean} props.isRead - Whether the feedback has been read
 * @param {Function} props.onMarkAsRead - Function to call to mark feedback as read
 * @param {Object} props.document - The document object
 */
export function TableCellFeedback({ feedback, isRead, onMarkAsRead, document, updatedAt }) {
  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(document);
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
        className="bg-blue-50 p-3 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={handleClick}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
            <p className="text-sm font-medium text-gray-800">
              Admin Feedback
            </p>
          </div>
          {updatedAt && (
            <span className="text-xs text-gray-500">
              {new Date(updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback}</p>

        {/* View Full Thread Link */}
        <div className="mt-3 flex justify-end">
          <Link
            href={`/dashboard/landlord/documents/${document.id}/feedback`}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Full Thread
          </Link>
        </div>
      </div>
    </div>
  );
}
